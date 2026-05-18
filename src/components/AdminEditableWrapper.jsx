// src/components/AdminEditableWrapper.jsx
import React from 'react';
import { useAdminEdit } from '../context/AdminEditContext';

const AdminEditableWrapper = ({ children, type, data, style = {} }) => {
    const { isAdmin, editMode } = useAdminEdit();

    if (!isAdmin || !editMode) {
        return <>{children}</>;
    }

    const handleEditClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // Dispatch global custom event to trigger the Quick Edit modal in the toolbar
        const event = new CustomEvent('trigger-admin-quick-edit', {
            detail: {
                type,
                action: 'update',
                data
            }
        });
        window.dispatchEvent(event);
    };

    return (
        <div className="mkca-admin-editable" style={{ position: 'relative', ...style }}>
            {/* INJECT CONTAINER HOVER EDIT BUTTON STYLES */}
            <style>{`
                .mkca-admin-editable {
                    transition: all 0.3s ease;
                }
                .mkca-admin-editable:hover {
                    box-shadow: 0 0 0 2px rgba(201, 168, 76, 0.75), 0 0 15px rgba(201, 168, 76, 0.3);
                    border-radius: 12px;
                }
                .mkca-admin-edit-trigger {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(10, 12, 22, 0.9);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    border: 1.5px solid rgba(201, 168, 76, 0.8);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                    color: #c9a84c;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    z-index: 999;
                    opacity: 0.85;
                    transform: scale(0.95);
                    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .mkca-admin-editable:hover .mkca-admin-edit-trigger {
                    opacity: 1;
                    transform: scale(1);
                    background: #11131e;
                    box-shadow: 0 5px 15px rgba(201, 168, 76, 0.4), 0 0 0 2px rgba(201, 168, 76, 0.2);
                }
                .mkca-admin-edit-trigger:hover {
                    color: #fff;
                    border-color: #bb2649;
                    box-shadow: 0 5px 15px rgba(187, 38, 73, 0.5), 0 0 0 2px rgba(187, 38, 73, 0.2);
                }
            `}</style>

            {/* FLOATING ACTION TRIGGER */}
            <button className="mkca-admin-edit-trigger" onClick={handleEditClick} title={`Quick Edit this ${type}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>Edit {type}</span>
            </button>

            {children}
        </div>
    );
};

export default AdminEditableWrapper;
