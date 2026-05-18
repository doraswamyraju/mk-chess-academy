// src/context/AdminEditContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

const AdminEditContext = createContext();

export const AdminEditProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const checkAdminSession = () => {
        const token = localStorage.getItem('adminToken');
        const valid = token === 'mkca_admin_token_123';
        setIsAdmin(valid);
        if (!valid) {
            setEditMode(false);
        }
    };

    useEffect(() => {
        // Initial check
        checkAdminSession();

        // Listen for storage changes across tabs
        window.addEventListener('storage', checkAdminSession);

        // Keep a poll for current tab transitions
        const interval = setInterval(checkAdminSession, 1000);

        return () => {
            window.removeEventListener('storage', checkAdminSession);
            clearInterval(interval);
        };
    }, []);

    const logOut = () => {
        localStorage.removeItem('adminToken');
        setIsAdmin(false);
        setEditMode(false);
        // Force refresh or redirect to home to reset state cleanly
        window.location.href = '/';
    };

    return (
        <AdminEditContext.Provider value={{ isAdmin, editMode, setEditMode, logOut }}>
            {children}
        </AdminEditContext.Provider>
    );
};

export const useAdminEdit = () => {
    const context = useContext(AdminEditContext);
    if (!context) {
        throw new Error('useAdminEdit must be used within an AdminEditProvider');
    }
    return context;
};
