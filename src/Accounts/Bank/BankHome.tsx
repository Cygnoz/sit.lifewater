// import Ellipsis from "../../assets/icons/Ellipsis";
import NewBankModal from "./NewBankModal";
import Table from "./Table";

type Props = {};

function BankHome({}: Props) {
  // const [searchValue, setSearchValue] = useState<string>("");
  return (
    <div className="p-2  h-[100vh]">
      <div className="flex items-center">
        <div>
          <h3 className="font-bold text-2xl text-textColor">Bank</h3>
          <p className="text-sm text-gray mt-1">
            Lorem ipsum dolor sit amet consectetur. Commodo enim odio fringilla
            egestas consectetur amet.
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <NewBankModal />
          <div className="cursor-pointer">
           
          </div>
        </div>
        <div></div>
      </div>

      <div className="mt-5 bg-white">
        <div>
          <Table />
        </div>
      </div>
    </div>
  );
}

export default BankHome;
