import { useEffect, useState } from "react";
import NewAccountModal from "./NewAccountModal";
// import AccountTypes from "../chartOfAccountant/AccountTypes";
import Table from "./Table";
import useApi from "../../Hook/UseApi";
import { endpoints } from "../../services/ApiEndpoint";
interface Account {
  _id: string;
  accountName: string;
  accountCode: string;
  accountSubhead: string;
  accountHead: string;
  description: string;
}
type Props = {};

const ChartOfAccountant = ({}: Props) => {
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading,setLoading]=useState<object | null>({
    skelton:false,
    noDataFound:false
  })
  const { request: AllAccounts } = useApi("get", 4000);

  useEffect(() => {
    fetchAllAccounts();
}, []);

const fetchAllAccounts = async () => {
  try {
    setLoading((prev) => ({ ...prev, skeleton: true }));

    const url = `${endpoints.GET_ALL_ACCOUNTS}`;
    const { response, error } = await AllAccounts(url);

    if (error || !response) {
      setLoading((prev) => ({ ...prev, skeleton: false, noDataFound: true }));
      return;
    }

    console.log("Fetched Data:", response.data);

    // Extract only `_doc` from each object
    const formattedData = response.data.map((item: any) => item._doc);

    setAccountData(formattedData); // Now `accountData` is correctly structured

    setLoading((prev) => ({ ...prev, skeleton: false }));

  } catch (error) {
    console.error("Error fetching accounts:", error);
    setLoading((prev) => ({ ...prev, skeleton: false, noDataFound: true }));
  }
};



  const HandleOnSave = () =>{
    fetchAllAccounts();
    // toast.success('Account successfully added!'); 
  }

  return (
    <div className="mx-5 my-4">
      <div className="top-side flex items-center justify-between">
        <div className="head-frame">
          <h1 className="font-bold text-2xl text-textColo">Chart Of Account</h1>
          <p className="text-sm mt-1">
          It serves as a framework for organizing financial data and helps ensure accurate and consistent reporting 
          </p>
        </div>
        <div className="button-frame me-4">
          {/* Pass fetchAllAccounts as prop to NewAccountModal */}
          <NewAccountModal accountData={accountData} fetchAllAccounts={HandleOnSave} />
        </div>
      </div>
      <br />
      <div className="flex flex-col gap-3 p-3 bg-white mt-1">
        {/* <AccountTypes /> */}
        {/* Pass accountData and searchValue as props to Table */}
        <Table
        fetchAllAccounts={fetchAllAccounts}
          accountData={accountData}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ChartOfAccountant;
