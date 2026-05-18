// src/components/VisualAdminToolbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminEdit } from '../context/AdminEditContext';
import QuickEditModal from './QuickEditModal';

const VisualAdminToolbar = () => {
    const { isAdmin, editMode, setEditMode, logOut } = useAdminEdit();
    const [isMinimized, setIsMinimized] = useState(false);
    const [activeModal, setActiveModal] = useState(null); // { type, action, data }
    const navigate = useNavigate();
    const location = useLocation();

    // Do not show toolbar on admin or login screens
    const isSystemRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

    // Broadcast editMode changes globally so other components can synchronize if needed
    useEffect(() => {
        const event = new CustomEvent('admin-edit-mode-changed', { detail: { editMode } });
        window.dispatchEvent(event);
    }, [editMode]);

    // Handle incoming quick-edit triggers from dynamic elements on the page
    useEffect(() => {
        const handleTriggerEdit = (e) => {
            const { type, action, data } = e.detail;
            setActiveModal({ type, action, data });
        };
        window.addEventListener('trigger-admin-quick-edit', handleTriggerEdit);
        return () => window.removeEventListener('trigger-admin-quick-edit', handleTriggerEdit);
    }, []);

    if (!isAdmin || isSystemRoute) return null;

    const navSections = [
        { label: 'Admin Dashboard', path: '/admin' },
        { label: 'Leads CRM', path: '/admin/leads' },
        { label: 'Enrollments', path: '/admin/enrolments' },
        { label: 'Announcements', path: '/admin/announcements' },
        { label: 'Blog Posts', path: '/admin/blog' },
        { label: 'Courses Hub', path: '/admin/courses' },
        { label: 'Coaches Team', path: '/admin/coaches' },
        { label: 'FAQs List', path: '/admin/faq' },
        { label: 'Gallery Admin', path: '/admin/gallery' },
        { label: 'Testimonials', path: '/admin/testimonials' },
        { label: 'Chess Puzzles', path: '/admin/puzzles' },
    ];

    const quickAddTypes = [
        { label: '📢 New Announcement', type: 'announcement' },
        { label: '✍️ New Blog Post', type: 'blog' },
        { label: '♟ New Course', type: 'course' },
        { label: '🎓 New Instructor', type: 'coach' },
        { label: '💬 New Testimonial', type: 'testimonial' },
        { label: '❓ New FAQ', type: 'faq' },
        { label: '🖼 New Gallery Image', type: 'gallery' },
        { label: '🧩 New Puzzle', type: 'puzzle' },
    ];

    const handleQuickAdd = (type) => {
        setActiveModal({ type, action: 'add', data: null });
    };

    return (
        <>
            {/* INJECT CUSTOM PREMIUM TOOLBAR STYLES */}
            <style>{`
                .mkca-admin-toolbar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 54px;
                    background: rgba(10, 12, 22, 0.95);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 2px solid rgba(201, 168, 76, 0.65);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(201, 168, 76, 0.15);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 24px;
                    box-sizing: border-box;
                    color: #fff;
                    font-family: 'Roboto', sans-serif;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .mkca-admin-toolbar * {
                    box-sizing: border-box;
                }
                .mkca-admin-toolbar.minimized {
                    top: 12px;
                    left: auto;
                    right: 12px;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    padding: 0;
                    justify-content: center;
                    border: 2px solid rgba(201, 168, 76, 0.85);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(187, 38, 73, 0.3);
                    cursor: pointer;
                    overflow: hidden;
                }
                .mkca-toolbar-left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .mkca-admin-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, rgba(187, 38, 73, 0.2), rgba(201, 168, 76, 0.2));
                    border: 1px solid rgba(201, 168, 76, 0.45);
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 900;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    color: #c9a84c;
                    animation: goldPulse 3s infinite alternate;
                }
                .mkca-toolbar-right {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                /* SWITCH SLIDER STYLING */
                .mkca-mode-switch-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .mkca-mode-label {
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 0.5px;
                    color: #a0aec0;
                }
                .mkca-mode-label.active {
                    color: #fff;
                    text-shadow: 0 0 8px rgba(255,255,255,0.4);
                }
                .mkca-switch {
                    position: relative;
                    display: inline-block;
                    width: 50px;
                    height: 24px;
                }
                .mkca-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .mkca-slider {
                    position: absolute;
                    cursor: pointer;
                    inset: 0;
                    background-color: #2d3748;
                    border: 1px solid rgba(255,255,255,0.1);
                    transition: .3s cubic-bezier(0.16, 1, 0.3, 1);
                    border-radius: 24px;
                }
                .mkca-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 2px;
                    bottom: 2px;
                    background-color: #fff;
                    transition: .3s cubic-bezier(0.16, 1, 0.3, 1);
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                input:checked + .mkca-slider {
                    background: linear-gradient(135deg, #bb2649, #e53e3e);
                    border-color: rgba(187, 38, 73, 0.4);
                    box-shadow: 0 0 10px rgba(187, 38, 73, 0.5);
                }
                input:checked + .mkca-slider:before {
                    transform: translateX(26px);
                    background-color: #fff;
                }
                /* DROPDOWN STYLING */
                .mkca-dropdown {
                    position: relative;
                    display: inline-block;
                }
                .mkca-dropdown-btn {
                    background: rgba(255, 255, 255, 0.08);
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    padding: 6px 14px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.2s;
                }
                .mkca-dropdown-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: rgba(201, 168, 76, 0.5);
                }
                .mkca-dropdown-content {
                    display: none;
                    position: absolute;
                    top: calc(100% + 6px);
                    right: 0;
                    background: #11131e;
                    min-width: 200px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5), 0 0 10px rgba(201,168,76,0.1);
                    border: 1px solid rgba(201, 168, 76, 0.35);
                    border-radius: 10px;
                    padding: 8px 0;
                    z-index: 10005;
                    overflow: hidden;
                    animation: dropdownFade 0.2s ease-out;
                }
                .mkca-dropdown:hover .mkca-dropdown-content {
                    display: block;
                }
                .mkca-dropdown-item {
                    display: block;
                    width: 100%;
                    text-align: left;
                    padding: 10px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #cbd5e0;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: all 0.15s;
                    text-decoration: none;
                }
                .mkca-dropdown-item:hover {
                    background: linear-gradient(90deg, rgba(201, 168, 76, 0.15) 0%, transparent 100%);
                    color: #c9a84c;
                    padding-left: 20px;
                }
                /* ACTION BUTTONS */
                .mkca-action-btn {
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 700;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s;
                }
                .mkca-logout-btn {
                    background: transparent;
                    color: #e53e3e;
                    border: 1px solid rgba(229, 62, 62, 0.3);
                }
                .mkca-logout-btn:hover {
                    background: rgba(229, 62, 62, 0.1);
                    border-color: #e53e3e;
                }
                .mkca-toggle-view-btn {
                    background: transparent;
                    border: none;
                    color: #a0aec0;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    transition: all 0.2s;
                }
                .mkca-toggle-view-btn:hover {
                    background: rgba(255,255,255,0.1);
                    color: #fff;
                }
                /* KEYFRAME ANIMATIONS */
                @keyframes goldPulse {
                    0% { box-shadow: 0 0 5px rgba(201, 168, 76, 0.2); border-color: rgba(201, 168, 76, 0.4); }
                    100% { box-shadow: 0 0 12px rgba(201, 168, 76, 0.45); border-color: rgba(201, 168, 76, 0.75); }
                }
                @keyframes dropdownFade {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* MINIMIZED VIEW (SLEEK PILL BADGE) */}
            {isMinimized ? (
                <div 
                    className="mkca-admin-toolbar minimized" 
                    onClick={() => setIsMinimized(false)}
                    title="Expand Admin Toolbar"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        boxShadow: 'inset 0 0 10px rgba(201, 168, 76, 0.5)',
                        animation: 'goldPulse 2s infinite alternate',
                        pointerEvents: 'none'
                    }}></div>
                </div>
            ) : (
                /* EXPANDED VIEW (FULL STRIP OVERLAY) */
                <div className="mkca-admin-toolbar">
                    <div className="mkca-toolbar-left">
                        {/* Collapsed Button */}
                        <button 
                            className="mkca-toggle-view-btn" 
                            onClick={() => setIsMinimized(true)}
                            title="Collapse Toolbar"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>

                        <div className="mkca-admin-badge">
                            <span style={{ fontSize: 13 }}>🛡️</span>
                            <span>MKCA Admin</span>
                        </div>

                        {/* Switch View/Edit Mode */}
                        <div className="mkca-mode-switch-wrapper">
                            <span className={`mkca-mode-label ${!editMode ? 'active' : ''}`}>View</span>
                            <label className="mkca-switch">
                                <input 
                                    type="checkbox" 
                                    checked={editMode} 
                                    onChange={(e) => setEditMode(e.target.checked)} 
                                />
                                <span className="mkca-slider"></span>
                            </label>
                            <span className={`mkca-mode-label ${editMode ? 'active' : ''}`} style={{ color: editMode ? '#c9a84c' : '#a0aec0' }}>
                                Edit Mode
                            </span>
                        </div>
                    </div>

                    <div className="mkca-toolbar-right">
                        {/* Quick Navigation Dropdown */}
                        <div className="mkca-dropdown">
                            <button className="mkca-dropdown-btn">
                                <span>🌐 Jump to Admin Panel</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            <div className="mkca-dropdown-content">
                                {navSections.map((sec, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => navigate(sec.path)} 
                                        className="mkca-dropdown-item"
                                    >
                                        {sec.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Add Dropdown */}
                        <div className="mkca-dropdown">
                            <button className="mkca-dropdown-btn" style={{ borderColor: 'rgba(201, 168, 76, 0.45)' }}>
                                <span style={{ color: '#c9a84c' }}>✨ Quick Actions</span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            <div className="mkca-dropdown-content">
                                {quickAddTypes.map((add, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleQuickAdd(add.type)} 
                                        className="mkca-dropdown-item"
                                    >
                                        {add.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Log Out */}
                        <button className="mkca-action-btn mkca-logout-btn" onClick={logOut}>
                            Disconnect
                        </button>
                    </div>
                </div>
            )}

            {/* RENDER QUICK EDIT / ADD MODAL POPUP */}
            {activeModal && (
                <QuickEditModal 
                    activeModal={activeModal} 
                    onClose={() => setActiveModal(null)} 
                />
            )}
        </>
    );
};

export default VisualAdminToolbar;
