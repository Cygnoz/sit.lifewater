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
interface SupplierResponseContextType {
  supplierResponse: any;
  setsupplierResponse: React.Dispatch<React.SetStateAction<any>>;
}
interface SupplierDetailsContextType {
    supplierDetails: any;
    setSupplierDetails: React.Dispatch<React.SetStateAction<any>>;
  }
export const AnStaffResponseContext = createContext<
  AnStaffResponseContextType | undefined
>(undefined);
export const WarehouseResponseContext = createContext<
  WarehouseResponseContextType | undefined
>(undefined);
export const AnVehicleResponseContext = createContext<
  AnVehicleResponseContextType | undefined
>(undefined);
export const SupplierResponseContext = createContext<
  SupplierResponseContextType | undefined
>(undefined);
export const SupplierDetailsContext = createContext<
  SupplierDetailsContextType | undefined
>(undefined);

interface ContextShareProps {
  children: ReactNode;
}

const ContextShare: React.FC<ContextShareProps> = ({ children }) => {
  const [staffResponse, setStaffResponse] = useState("");
  const [warehouseResponse, setWarehouseResponse] = useState("");
  const [vehicleResponse, setVehicleResponse] = useState("");
  const [supplierResponse, setsupplierResponse] = useState<any>({});
  const [supplierDetails, setSupplierDetails] = useState("");

  return (
    <SupplierDetailsContext.Provider
    value={{ supplierDetails, setSupplierDetails }}
  >
    <AnVehicleResponseContext.Provider
      value={{ vehicleResponse, setVehicleResponse }}
    >
      <WarehouseResponseContext.Provider
        value={{ warehouseResponse, setWarehouseResponse }}
      >
        <AnStaffResponseContext.Provider
          value={{ staffResponse, setStaffResponse }}
        >
          <SupplierResponseContext.Provider
            value={{ supplierResponse, setsupplierResponse }}
          >
            {children}
          </SupplierResponseContext.Provider>
        </AnStaffResponseContext.Provider>
      </WarehouseResponseContext.Provider>
    </AnVehicleResponseContext.Provider>
    </SupplierDetailsContext.Provider>
  );
};

export default ContextShare;
