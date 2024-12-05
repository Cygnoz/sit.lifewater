import { createContext, useState ,ReactNode} from "react";


interface TableLoadingContextType {
  loading: any;
  setLoading: React.Dispatch<React.SetStateAction<any>>;
}

export const TableResponseContext = createContext<
  TableLoadingContextType | undefined
>(undefined);

interface ContextShareProps {
    children: ReactNode;
  }

const ContextShare: React.FC<ContextShareProps> = ({ children }) => {
  const [loading, setLoading] = useState<any>({
    skelton: false,
    noDataFound: false,
  });
  

  return (
    <TableResponseContext.Provider value={{ loading, setLoading }}>
       <TableResponseContext.Provider value={{loading,setLoading}}>
      {children}
      </TableResponseContext.Provider>
    </TableResponseContext.Provider>
  );
};

export default ContextShare;
