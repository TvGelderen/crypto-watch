import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState();

    return (
        <AppContext.Provider
          value={{
            open,
            setOpen,
            screenWidth,
            setScreenWidth
          }}
        >
            { children }
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);