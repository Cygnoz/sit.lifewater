
import { Link } from "react-router-dom";
import CheveronLeftIcon from "../../assets/icons/CheveronLeft";

function AccountantViewUI() {
  const trialBalance = [
    { _id: "1", date: "2024-11-15", accountName: "Account 1", action: "Credit", debitAmount: 100, creditAmount: 50 },
    { _id: "2", date: "2024-11-14", accountName: "Account 2", action: "Debit", debitAmount: 200, creditAmount: 0 },
  ];
  const baseCurrency = "USD";

  return (
    <div className="p-2">
      <div className="flex items-center gap-5 mb-2">
        <Link to="/chartofaccount">
          <div className="w-[40px] h-[40px] flex items-center justify-center bg-white rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <p className="text-textColor text-xl font-bold">Account Name</p>
      </div>

      <div className="p-6 rounded-lg bg-white">
        <div className="flex justify-between mb-4">
          <p className="font-bold text-textColor text-base">Recent Transaction</p>
          <div className="flex text-[#565148] text-xs font-medium">
            <button className="border border-[#565148] border-r-0 px-3 py-1 rounded-s-lg text-sm">FCY</button>
            <button className="border border-[#565148] px-3 py-1 rounded-e-lg text-sm">BCY</button>
          </div>
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
                  <td className="py-3 px-4 border-b border-tableBorder">{item.date}</td>
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
              Total: <span>150.00 ({baseCurrency})</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountantViewUI;
