import React, { useState, createContext, useContext } from 'react';

const CursorContext = createContext();

export const useCursor = () => useContext(CursorContext);

export const CursorProvider = ({ children }) => {
    const [cursorType, setCursorType] = useState('pawn');

    return (
        <CursorContext.Provider value={{ cursorType, setCursorType }}>
            {children}
        </CursorContext.Provider>
    );
};