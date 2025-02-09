import BookTypeIcon from "../../assets/icons/BookTypeIcon";
import FolderClosedIcon from "../../assets/icons/FolderClosedIcon";
import NewspaperIcon from "../../assets/icons/NewspaperIcon";
import PlusCircle from "../../assets/icons/PlusCircle";
import RecieptText from "../../assets/icons/RecieptText";
import SentToBack from "../../assets/icons/SentToBack";
import UserRoundPlus from "../../assets/icons/UserRoundPlus";
import Button from "../../commoncomponents/Buttons/Button";


type Props = {}
interface StepProps {
    icon: React.ReactNode;
    label: string;
    isLast: boolean;
  }
  
  interface CircleProps {
    index: number;
  }
  const circlesArray = new Array(7).fill(null);
    const steps = [
      { icon:   <UserRoundPlus/>, label: 'Account Creation' },
      { icon: <RecieptText/>, label: 'Transaction Recording' },
      { icon: <BookTypeIcon/>, label: 'Journal Entries' },
      { icon: <SentToBack/>, label: 'Reconciliation' },
      { icon: <RecieptText/>, label: 'Financial Reporting' },
      { icon: <NewspaperIcon color='#4B5C79'/>, label: 'Audit Trail' },
      { icon: <FolderClosedIcon  color='#4B5C79'/>, label: 'Year-End Closing' },
    ];
    const Circle: React.FC<CircleProps> = ({ index }) => (
      <div key={index} className='w-[28px] h-[28px] rounded-full border border-[#BDBFB2] flex justify-center items-center -mt-3 bg-white'>
        <div className='w-[11px] h-[11px] bg-[#CACCBE] rounded-full'></div>
      </div>
    );
    
    const Step: React.FC<StepProps> = ({ icon, label, isLast }) => (
      <div className='flex items-center '>
        <div className='h-[105px] bg-white rounded-lg mt-4 flex flex-col justify-center items-center mb-2 space-y-2'>
          <div className='bg-[#F7E7CE] w-6 h-6 flex justify-center rounded items-center'>
            {icon}
          </div>
          <p className='text-[#4B5C79] font-semibold text-center text-[13px] w-[140px] mx-2'>{label}</p>
        </div>
        {!isLast && (
          <div className='flex items-center'>
            <p className='w-8 border border-dashed text-[#CACCBE]'></p>
            <div className='w-2 h-2 bg-[#CACCBE] rounded-full'></div>
          </div>
        )}
      </div>
    );

function AccountantInfo({}: Props) {
  return (
    <>
     <div className="p-5 flex justify-evenly items-center">
        <div>
          <p className="text-textColor text-3xl text-center">
            Streamline Your Accounts with <br /> Precision
          </p>
          <br />
          <p className="text-dropdownText font-light text-base text-center">
            Lorem ipsum dolor sit amet consectetur. Arcu porttitor lacus <br /> sit ut a sed gravida.
          </p>
          <br />
          <div className="flex justify-center">
            <Button className="text-sm">
              <PlusCircle /> Add Account
            </Button>
          </div>
        </div>
        <div>
        

      
        </div>
      </div>
      <div className='space-y-6'>
      <h2 className='text-[24px] font-bold text-[#303F58] text-center mb-7'>How Accountant life cycle works?</h2>
      <div className='h-1 w-full bg-white px-14 flex justify-between'>
        {circlesArray.map((_, index) => (
          <Circle key={index} index={index} />
        ))}
      </div>
    </div>
    <div className='flex'>
    {steps.map((step, index) => (
          <Step key={index} icon={step.icon} label={step.label} isLast={index === steps.length - 1} />
        ))}
      </div>
    </>
  )
}

export default AccountantInfo