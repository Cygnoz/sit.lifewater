
import React, { createContext, useState, ReactNode } from "react";

interface StaffResponseContextType {
    staffResponse: any;
    setStaffResponse: React.Dispatch<React.SetStateAction<any>>;
}
interface WarehouseResponseContextType {
    warehouseResponse: any;
    setWarehouseResponse: React.Dispatch<React.SetStateAction<any>>;
}

export const StaffResponseContext = createContext<StaffResponseContextType | undefined>(undefined);
export const WarehouseResponseContext = createContext<WarehouseResponseContextType | undefined>(undefined);

interface ContextShareProps {
    children: ReactNode;
}

const ContextShare: React.FC<ContextShareProps> = ({ children }) => {
    const [staffResponse, setStaffResponse] = useState("");
    const [warehouseResponse, setWarehouseResponse] = useState("");

    return (
        <WarehouseResponseContext.Provider value={{warehouseResponse,setWarehouseResponse}}>
            <StaffResponseContext.Provider value={{ staffResponse, setStaffResponse }}>
                {children}
            </StaffResponseContext.Provider>
        </WarehouseResponseContext.Provider>

    );
};

export default ContextShare;
