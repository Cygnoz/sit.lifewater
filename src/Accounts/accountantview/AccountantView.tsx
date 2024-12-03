import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import CheveronLeftIcon from "../../assets/icons/CheveronLeft"
import { getOneTrialBalanceAPI } from "../../services/AccountsAPI/accounts"
import { endpoints } from "../../services/ApiEndpoint"
import useApi from "../../Hook/UseApi"

interface TrialBalance {
  _id: string
  date: string
  accountName: string
  action: string
  debitAmount: number
  creditAmount: number
}


function AccountantViewUI() {
  const { id } = useParams<{ id: string }>() // Extract the `id` parameter from the route
  const [trialBalance, setTrialBalance] = useState<TrialBalance[]>([])
  const [loading, setLoading] = useState(false);
  const { request: getOneTrialBalance } = useApi("get", 4000)
  
  
  const baseCurrency = "AED"

  const fetchAccounts = async () => {
    try {
      const url = `${endpoints.GET_ONE_TRIAL_BALANCE}/${id}`
      const { response, error } = await getOneTrialBalance(url)
      console.log("API RESPONSE :",response)

      if (!error && response) {
        setLoading(false)
        setTrialBalance(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [id])

  const totalDebits = trialBalance.reduce((acc, item) => acc + (item.debitAmount || 0), 0);
  const totalCredits = trialBalance.reduce((acc, item) => acc + (item.creditAmount || 0), 0);
  const netTotal = totalDebits - totalCredits;
  

  return (
    <div className="p-2">
      <div className="flex items-center gap-5 mb-2">
        <Link to="/chartofaccount">
          <div className="w-[40px] h-[40px] flex items-center justify-center bg-white rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        {/* <p className="text-textColor text-xl font-bold">{trialBalance.accountName}</p> */}
        <p className="text-textColor text-xl font-bold">{trialBalance.length > 0 ? trialBalance[0].accountName : "No Account Name"}</p>
      </div>

      <div className="p-6 rounded-lg bg-white">
        <div className="flex justify-between mb-4">
          <p className="font-bold text-textColor text-base">Recent Transaction</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-tableBorder rounded-lg">
            <thead className="text-[12px] text-center text-dropdownText">
              <tr className="bg-[#F9F7F0]">
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">Date</th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">Transaction Details</th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">Type</th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">Debit ({baseCurrency})</th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">Credit ({baseCurrency})</th>
              </tr>
            </thead>
            <tbody className="text-dropdownText text-center text-[13px]">
              {trialBalance.map((item) => (
                <tr key={item._id}>
                  <td className="py-3 px-4 border-b border-tableBorder">{item?.date?.split("T")[0].split("-").reverse().join("/") || "N/A"}</td>
                  <td className="py-3 px-4 border-b border-tableBorder">{item.accountName}</td>
                  <td className="py-3 px-4 border-b border-tableBorder">{item.action}</td>
                  <td className="py-3 px-4 border-b border-tableBorder">{item.debitAmount}</td>
                  <td className="py-3 px-4 border-b border-tableBorder">{item.creditAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-end">
            <p className="text-textColor font-bold me-36">
              Total: <span>{netTotal} ({baseCurrency})</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountantViewUI
