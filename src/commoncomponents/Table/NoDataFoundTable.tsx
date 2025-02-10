// import No_Data_found from '../../assets/images/image.png';

type Props = {
    columns: any[]
}


function NoDataFoundTable({ columns }: Props) {
  return (
    <tr>
      <td colSpan={columns.length} className="text-center py-4 border-y border-tableBorder">
        <div className="flex justify-center flex-col items-center">
          {/* <img width={70} src={No_Data_found} alt="No Data Found" /> */}
          <p className="font-bold text-red-700">No Records Found!</p>
        </div>
      </td>
    </tr>
  );
}

export default NoDataFoundTable;
