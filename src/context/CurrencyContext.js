import React, { createContext, useContext, useState, useEffect } from 'react';

const Currency = createContext();

const CurrencyContext = ({ children }) => {
    const [currency, setCurrency] = useState("USD");
    const [symbol, setSymbol] = useState("$");

    useEffect(() => {
        switch (currency) {
            case "USD":
                setSymbol("$");
            break;
            case "EUR":
                setSymbol("€");
            break;
            default:
                setSymbol("$");
            break;
        }
    }, [currency]);

    return <Currency.Provider value={{currency, symbol, setCurrency}}>{ children }</Currency.Provider>
};

export default CurrencyContext;

export const CurrencyState = () => {
    return useContext(Currency);
};