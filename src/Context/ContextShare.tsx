
import React, { createContext, useState, ReactNode } from "react";

interface AnStaffResponseContextType {
    staffResponse: any;
    setStaffResponse: React.Dispatch<React.SetStateAction<any>>;
}
interface WarehouseResponseContextType {
    warehouseResponse: any;
    setWarehouseResponse: React.Dispatch<React.SetStateAction<any>>;
}
interface AnVehicleResponseContextType {
    vehicleResponse: any;
    setVehicleResponse: React.Dispatch<React.SetStateAction<any>>;
}
export const AnStaffResponseContext = createContext<AnStaffResponseContextType | undefined>(undefined);
export const WarehouseResponseContext = createContext<WarehouseResponseContextType | undefined>(undefined);
export const AnVehicleResponseContext = createContext<AnVehicleResponseContextType | undefined>(undefined);

interface ContextShareProps {
    children: ReactNode;
}

const ContextShare: React.FC<ContextShareProps> = ({ children }) => {
    const [staffResponse, setStaffResponse] = useState("");
    const [warehouseResponse, setWarehouseResponse] = useState("");
    const [vehicleResponse, setVehicleResponse] = useState("");

    return (
        <AnVehicleResponseContext.Provider value={{ vehicleResponse, setVehicleResponse }}>
            <WarehouseResponseContext.Provider value={{ warehouseResponse, setWarehouseResponse }}>
                <AnStaffResponseContext.Provider value={{ staffResponse, setStaffResponse }}>
                    {children}
                </AnStaffResponseContext.Provider>
            </WarehouseResponseContext.Provider>
        </AnVehicleResponseContext.Provider>

    );
};

export default ContextShare;
