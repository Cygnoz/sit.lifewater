import { Link, useParams } from "react-router-dom";
import useApi from "../../Hook/UseApi";
import { useEffect, useState } from "react";
import { endpoints } from "../../services/ApiEndpoint";
import CheveronLeftIcon from "../../assets/icons/CheveronLeft";
import Pen from "../../assets/icons/Pen";
import Button from "../../commoncomponents/Buttons/Button";
import PrinterIcon from "../../assets/icons/PrinterIcon";
import Trash2 from "../../assets/icons/Trash2";


type Props = {};

function ManualView({ }: Props) {
  const { request: getOneJournal } = useApi("get", 4000);
  const { id } = useParams<{ id: string }>();
  const [oneJournal, setOneJournal] = useState<any>(null);

  const getOneJournalData = async () => {
    try {
      const url = `${endpoints.GET_ONE_JOURNAL}/${id}`;
      const { response, error } = await getOneJournal(url);
      if (!error && response) {
        console.log("response", response.data);
        setOneJournal(response.data);
      }
    } catch (error) {
      console.error("Error fetching journal:", error);
    }
  };

  useEffect(() => {
    if (id) {
      getOneJournalData();
    }
  }, [id]);

  return (
    <>
      <div className="px-6">
        <div className="flex items-center gap-5 mb-2">
          <Link to={"/journals"}>
            <div
              style={{ borderRadius: "50%" }}
              className="w-[40px] h-[40px] flex items-center justify-center bg-white"
            >
              <CheveronLeftIcon />
            </div>
          </Link>
          <p className="text-textColor text-xl font-bold">
            View Manual Journal
          </p>
        </div>

        <div className="bg-white rounded-xl px-5 mb-32 mt-5">
          <br />
          <div className="flex justify-between">
            <div className="flex gap-3 items-center">
              <p className="text-xl text-textColor font-bold pr-4 border-borderRight">
                {oneJournal ? `#${oneJournal?.journalId}` : "#001"}
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <Button variant="secondary" className="pl-6 pr-6" size="sm">
                <Pen color="#565148" />{" "}
                <p className="text-sm font-medium">Edit</p>
              </Button>
              <Button variant="secondary" className="pl-5 pr-5" size="sm">
                <PrinterIcon color="#565148" height={0} width={0} />{" "}
                <p className="text-sm font-medium">Print</p>
              </Button>
              <Button variant="secondary" className="pl-5 pr-5" size="sm">
                <Trash2 color="#565148" />{" "}
                <p className="text-sm font-medium">Delete</p>
              </Button>
            </div>
          </div>
          <hr className="border-t border-inputBorder mt-4" />

          {/* pdf view */}
          <div className="flex items-center justify-center text-sm text-textColor p-5">
            <div
              className="p-5"
              style={{ width: "595px", boxShadow: "-1px 1px 15px -8px black" }}
            >
              <div className="bg-lightPink p-5 rounded-lg">
                <div className="flex mb-7">
                  <p className="font-bold text-2xl">JOURNAL</p>
                  {/* journalId */}
                  <p className="ml-auto">
                    {oneJournal ? `#${oneJournal?.journalId}` : "#0001"}
                  </p>
                </div>

                <div className="space-y-2 mb-5">
                  <p className="mt-5">
                    {/* date */}
                    Billed Date:
                    <b className="ms-4">
                      {oneJournal ? oneJournal?.date : "*/*/*"}
                    </b>
                  </p>

                  {/* totalCreditAmount */}
                  <p>
                    Amount:
                    <b className="ms-4">
                      {oneJournal
                        ? oneJournal?.totalCreditAmount.toFixed(2)
                        : "0.00"}
                    </b>
                  </p>

                  {/* reference */}
                  <p>
                    Reference Number:
                    <b className="ms-4">
                      {oneJournal ? oneJournal?.reference : "#00"}
                    </b>
                  </p>
                </div>
              </div>

              {/* Transaction Table */}
              <table className="w-full table-auto border-collapse my-7">
                <thead>
                  <tr>
                    <th className="text-left p-2">Account</th>
                    <th className="text-right p-2 font-normal">Debits</th>
                    <th className="text-right p-2 font-normal">Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {oneJournal?.transaction?.map((txn: any) => (
                    <tr className="border-b border-slate-400 mb-5" key={txn.accountId}>
                      <td className="px-2 py-5 text-left">{txn.accountName}</td>
                      <td className="text-right px-2 py-5">
                        {txn.debitAmount.toFixed(2)}
                      </td>
                      <td className="text-right px-2 py-5">
                        {txn.creditAmount.toFixed(2)}
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td className="px-2 py-5 text-left"></td>
                    <td className="px-2 py-5 text-right">SubTotal</td>
                    <td className="px-2 py-5 text-right">
                      {oneJournal
                        ? oneJournal?.totalDebitAmount.toFixed(2)
                        : "0.00"}
                    </td>
                    <td className="text-right px-2 py-5">
                      {oneJournal
                        ? oneJournal?.totalCreditAmount.toFixed(2)
                        : "0.00"}
                    </td>
                  </tr>
                </tbody>
              </table>


              <div className="bg-[#F3E6E6] ms-auto flex gap-5 rounded-lg p-3 text-end w-[55%] text-xs">
                <b>Total</b>
                <br />
                <b>
                  RS.
                  {oneJournal
                    ? oneJournal?.totalDebitAmount.toFixed(2)
                    : "0.00"}
                </b>{" "}
                <br />
                <b>
                  Rs.
                  {oneJournal
                    ? oneJournal?.totalCreditAmount.toFixed(2)
                    : "0.00"}
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManualView;
