import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
import CheveronLeftIcon from "../../assets/icons/CheveronLeft";

type TrialBalance = {
  _id: string;
  accountId: string;
  accountName: string;
  action: string;
  creditAmount: number;
  debitAmount: number;
  remark: string;
  cumulativeSum: string;
  createdDate: string;
  createdTime: string;
};

function AccountantView() {
  const { id } = useParams<{ id: string }>();
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const fromCash = searchParams.get("fromCash") === "true";
  // const fromBank = searchParams.get("fromBank") === "true";
  const { request: getOneTrialBalance } = useApi("get", 4000);
  const [trialBalance, setTrialBalance] = useState<TrialBalance[]>([]);

  // Fetch Trial Balance Data
  const getOneTrialBalanceData = async () => {
    try {
      const url = `${endpoints.GET_ONE_TRIAL_BALANCE}/${id}`;
      const { response, error } = await getOneTrialBalance(url);
      if (!error && response) {
        // Extract the _doc field from each object
        const formattedData = response.data;
        setTrialBalance(formattedData);
      }
    } catch (error) {
      console.error("Error fetching trial balance:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getOneTrialBalanceData();
    }
  }, [id]);

  // Calculate Total Debit - Credit
  const calculateTotal = () => {
    const totalCredit = trialBalance.reduce(
      (sum, item) => sum + (Number(item?.creditAmount) || 0),
      0
    );
    const totalDebit = trialBalance.reduce(
      (sum, item) => sum + (Number(item?.debitAmount) || 0),
      0
    );
    return totalDebit - totalCredit;
  };

  // Format Total as Debit (Dr) or Credit (Cr)
  const formattedTotal = () => {
    const total = calculateTotal();
    const absoluteValue = total ? Math.abs(total).toFixed(2) : "0.00";
    return total < 0 ? `${absoluteValue} (Cr)` : `${absoluteValue} (Dr)`;
  };

  return (
    <div className="px-6">
      {/* Header */}
      <div className="flex items-center gap-5 mb-2">
        <Link to="/chartofaccount">
          <div
            style={{ borderRadius: "50%" }}
            className="w-[40px] h-[40px] flex items-center justify-center bg-white"
          >
            <CheveronLeftIcon />
          </div>
        </Link>
        <p className="text-textColor text-xl font-bold">
          {trialBalance.length > 0 && trialBalance[0]?.accountName}
        </p>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-6 rounded-lg bg-white">
        <div className="flex justify-between mb-4">
          <p className="font-bold text-textColor text-base">
            Recent Transactions
          </p>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-tableBorder rounded-lg">
            <thead className="text-[12px] text-center text-dropdownText">
              <tr className="bg-[#F9F7F0]">
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">
                  Date
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">
                  Type
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">
                  Debit Amount
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">
                  Credit Amount
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">
                  Cumulative Sum
                </th>
                <th className="py-3 px-4 font-medium border-b border-tableBorder text-sm">
                  Note
                </th>
              </tr>
            </thead>
            <tbody className="text-dropdownText text-center text-[13px]">
              {trialBalance.length > 0 ? (
                trialBalance.map((item) => (
                  <tr key={item._id}>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.createdDate || "-"}
                    </td>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.action || "-"}
                    </td>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.debitAmount
                        ? Number(item.debitAmount).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.creditAmount
                        ? Number(item.creditAmount).toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.cumulativeSum
                        ? Number(item.cumulativeSum.replace(/\D/g, "")).toFixed(
                            2
                          ) +
                          " " +
                          item.cumulativeSum.replace(/[0-9.]/g, "")
                        : "0.00"}
                    </td>

                    <td className="py-3 px-4 border-b border-tableBorder">
                      {item?.remark || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-3 px-4 border-b border-tableBorder text-center text-red-600"
                  >
                    No data found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Total Amount Display */}
          <div className="mt-4 text-end">
            <p className="text-textColor font-bold me-36">
              Total: <span>{formattedTotal()}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountantView;
