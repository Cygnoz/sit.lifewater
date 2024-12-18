
import React, { createContext, useState, ReactNode } from "react";

interface AllOrderResponseContextType {
    orderResponse: any;
    setOrderResponse: React.Dispatch<React.SetStateAction<any>>;
}

export const AllOrderResponseContext = createContext<AllOrderResponseContextType | undefined>(undefined);

interface ContextShareProps {
    children: ReactNode;
}

const ContextShare: React.FC<ContextShareProps> = ({ children }) => {
    const [orderResponse, setOrderResponse] = useState("");

    return (

        <AllOrderResponseContext.Provider value={{ orderResponse, setOrderResponse }}>
            {children}
        </AllOrderResponseContext.Provider>


    );
};

export default ContextShare;
