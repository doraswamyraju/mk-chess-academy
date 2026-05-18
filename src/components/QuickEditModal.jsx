// src/components/QuickEditModal.jsx
import React, { useState, useEffect } from 'react';
import { postToApi, postFormDataToApi } from '../utils/api';

const QuickEditModal = ({ activeModal, onClose }) => {
    const { type, action, data } = activeModal; // type: faq, coach, testimonial, etc. action: add, update
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    // State form fields depending on the active entity
    const [fields, setFields] = useState({});
    const [imageFile, setImageFile] = useState(null);

    // Initialize fields based on incoming edit data or defaults
    useEffect(() => {
        if (action === 'update' && data) {
            setFields({ ...data });
        } else {
            // Default blank fields for adding new entries
            const defaults = {};
            if (type === 'faq') {
                defaults.question = ''; defaults.answer = ''; defaults.display_order = 0; defaults.is_active = 1;
            } else if (type === 'coach') {
                defaults.name = ''; defaults.role = ''; defaults.bio = ''; defaults.achievements = ''; defaults.is_active = 1;
            } else if (type === 'testimonial') {
                defaults.student_name = ''; defaults.course_taken = ''; defaults.review_text = ''; defaults.rating = 5; defaults.is_active = 1;
            } else if (type === 'blog') {
                defaults.title = ''; defaults.category = ''; defaults.excerpt = ''; defaults.content = ''; defaults.is_published = 1;
            } else if (type === 'announcement') {
                defaults.title = ''; defaults.message = ''; defaults.is_active = 1;
            } else if (type === 'course') {
                defaults.title = ''; defaults.level = ''; defaults.features = ''; defaults.is_active = 1;
            } else if (type === 'gallery') {
                defaults.title = ''; defaults.description = ''; defaults.is_active = 1;
            } else if (type === 'puzzle') {
                defaults.title = ''; defaults.fen = ''; defaults.solution = '[]'; defaults.difficulty = 'Easy'; defaults.theme = 'Tactics'; defaults.hint = ''; defaults.is_weekly = 0; defaults.is_active = 1;
            }
            setFields(defaults);
        }
        setError('');
        setImageFile(null);
    }, [type, action, data]);

    const handleFieldChange = (key, val) => {
        setFields(prev => ({ ...prev, [key]: val }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const token = localStorage.getItem('adminToken');
        if (!token) {
            setError('Admin session has expired. Please log in again.');
            setSubmitting(false);
            return;
        }

        try {
            // Map the entity type to the exact action expected by api_admin_dashboard.php
            const apiAction = `${action}_${type}`;
            
            // Check if this type supports/requires FormData for image uploads
            const hasImageUpload = ['blog', 'coach', 'testimonial', 'gallery'].includes(type);

            let res;
            if (hasImageUpload) {
                const formData = new FormData();
                formData.append('action', apiAction);
                formData.append('token', token);
                
                if (action === 'update' && fields.id) {
                    formData.append('id', fields.id);
                }

                // Add flat fields mapping for dynamic structures in api_admin_dashboard.php
                Object.keys(fields).forEach(key => {
                    if (key !== 'id' && key !== 'image_url' && key !== 'avatar_url') {
                        formData.append(key, fields[key]);
                    }
                });

                // Attach file or existing image path fallback
                if (imageFile) {
                    formData.append('image', imageFile);
                } else {
                    const existingImg = fields.image_url || fields.avatar_url || '';
                    formData.append('existing_image', existingImg);
                }

                res = await postFormDataToApi('api_admin_dashboard.php', formData);
            } else {
                // Non-image upload standard JSON API call
                const payload = {
                    action: apiAction,
                    token
                };

                if (action === 'update' && fields.id) {
                    payload.id = fields.id;
                }

                // Sub-payload structure expected by api_admin_dashboard.php
                // E.g. { course: { ... } } or { faq: { ... } } or { puzzle: { ... } }
                if (['course', 'faq', 'puzzle', 'announcement'].includes(type)) {
                    payload[type] = { ...fields };
                } else {
                    Object.assign(payload, fields);
                }

                res = await postToApi('api_admin_dashboard.php', payload);
            }

            if (res.status === 'success') {
                // Broadcast success so dynamic page contents reload reactively
                window.dispatchEvent(new CustomEvent('admin-content-updated', {
                    detail: { type, action, fields }
                }));
                onClose();
            } else {
                setError(res.message || 'Error occurred while saving.');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err.message || 'Server connection error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderFormFields = () => {
        switch (type) {
            case 'faq':
                return (
                    <>
                        <div className="qe-field">
                            <label>Question</label>
                            <input type="text" required value={fields.question || ''} onChange={e => handleFieldChange('question', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Answer</label>
                            <textarea required rows="4" value={fields.answer || ''} onChange={e => handleFieldChange('answer', e.target.value)} />
                        </div>
                        <div className="qe-field inline">
                            <label>Display Order (Priority)</label>
                            <input type="number" value={fields.display_order ?? 0} onChange={e => handleFieldChange('display_order', parseInt(e.target.value, 10))} />
                        </div>
                        <div className="qe-checkbox">
                            <input type="checkbox" id="faq_active" checked={!!fields.is_active} onChange={e => handleFieldChange('is_active', e.target.checked ? 1 : 0)} />
                            <label htmlFor="faq_active">Is Active (Visible)</label>
                        </div>
                    </>
                );
            case 'announcement':
                return (
                    <>
                        <div className="qe-field">
                            <label>Announcement Title</label>
                            <input type="text" required value={fields.title || ''} onChange={e => handleFieldChange('title', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Ticker Message</label>
                            <textarea required rows="3" value={fields.message || ''} onChange={e => handleFieldChange('message', e.target.value)} placeholder="Type a bold update statement..." />
                        </div>
                        <div className="qe-checkbox">
                            <input type="checkbox" id="ann_active" checked={!!fields.is_active} onChange={e => handleFieldChange('is_active', e.target.checked ? 1 : 0)} />
                            <label htmlFor="ann_active">Is Active (Visible)</label>
                        </div>
                    </>
                );
            case 'course':
                return (
                    <>
                        <div className="qe-field">
                            <label>Course Title</label>
                            <input type="text" required value={fields.title || ''} onChange={e => handleFieldChange('title', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Target Level / Age Group</label>
                            <input type="text" required value={fields.level || ''} onChange={e => handleFieldChange('level', e.target.value)} placeholder="e.g. Beginners (Ages 5-7)" />
                        </div>
                        <div className="qe-field">
                            <label>Course Features (Comma Separated)</label>
                            <textarea rows="3" required value={fields.features || ''} onChange={e => handleFieldChange('features', e.target.value)} placeholder="Interactive lessons, Advanced tactics, mock tournaments" />
                        </div>
                        <div className="qe-checkbox">
                            <input type="checkbox" id="course_active" checked={!!fields.is_active} onChange={e => handleFieldChange('is_active', e.target.checked ? 1 : 0)} />
                            <label htmlFor="course_active">Is Active (Visible)</label>
                        </div>
                    </>
                );
            case 'coach':
                return (
                    <>
                        <div className="qe-field">
                            <label>Name</label>
                            <input type="text" required value={fields.name || ''} onChange={e => handleFieldChange('name', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Role / Title</label>
                            <input type="text" required value={fields.role || ''} onChange={e => handleFieldChange('role', e.target.value)} placeholder="e.g. Certified Trainer" />
                        </div>
                        <div className="qe-field">
                            <label>Bio (Brief Description)</label>
                            <textarea rows="4" required value={fields.bio || ''} onChange={e => handleFieldChange('bio', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Achievements (Comma Separated)</label>
                            <input type="text" value={fields.achievements || ''} onChange={e => handleFieldChange('achievements', e.target.value)} placeholder="Rated Player, 5+ Yrs Exp, FIDE Arbitre" />
                        </div>
                        <div className="qe-field">
                            <label>Profile Image (Upload)</label>
                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                            {(fields.image_url || fields.existing_image) && !imageFile && (
                                <p className="qe-help">Current image: <a href={fields.image_url || fields.existing_image} target="_blank" rel="noreferrer" className="qe-link">View Thumbnail</a></p>
                            )}
                        </div>
                        <div className="qe-checkbox">
                            <input type="checkbox" id="coach_active" checked={!!fields.is_active} onChange={e => handleFieldChange('is_active', e.target.checked ? 1 : 0)} />
                            <label htmlFor="coach_active">Is Active (Visible)</label>
                        </div>
                    </>
                );
            case 'testimonial':
                return (
                    <>
                        <div className="qe-field">
                            <label>Student's Name</label>
                            <input type="text" required value={fields.student_name || ''} onChange={e => handleFieldChange('student_name', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Course / Achievements Taken</label>
                            <input type="text" required value={fields.course_taken || ''} onChange={e => handleFieldChange('course_taken', e.target.value)} placeholder="e.g. Intermediate Program" />
                        </div>
                        <div className="qe-field">
                            <label>Rating (1-5 Stars)</label>
                            <select value={fields.rating ?? 5} onChange={e => handleFieldChange('rating', parseInt(e.target.value, 10))}>
                                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                                <option value={2}>⭐⭐ (2 Stars)</option>
                                <option value={1}>⭐ (1 Star)</option>
                            </select>
                        </div>
                        <div className="qe-field">
                            <label>Review Text</label>
                            <textarea rows="4" required value={fields.review_text || ''} onChange={e => handleFieldChange('review_text', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Student Photo / Avatar (Upload)</label>
                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                            {(fields.avatar_url || fields.existing_image) && !imageFile && (
                                <p className="qe-help">Current image: <a href={fields.avatar_url || fields.existing_image} target="_blank" rel="noreferrer" className="qe-link">View Thumbnail</a></p>
                            )}
                        </div>
                        <div className="qe-checkbox">
                            <input type="checkbox" id="testi_active" checked={!!fields.is_active} onChange={e => handleFieldChange('is_active', e.target.checked ? 1 : 0)} />
                            <label htmlFor="testi_active">Is Active (Visible)</label>
                        </div>
                    </>
                );
            case 'blog':
                return (
                    <>
                        <div className="qe-field">
                            <label>Article Title</label>
                            <input type="text" required value={fields.title || ''} onChange={e => handleFieldChange('title', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Category</label>
                            <input type="text" required value={fields.category || ''} onChange={e => handleFieldChange('category', e.target.value)} placeholder="e.g. Openings, Tactics" />
                        </div>
                        <div className="qe-field">
                            <label>Short Excerpt Summary</label>
                            <textarea rows="2" required value={fields.excerpt || ''} onChange={e => handleFieldChange('excerpt', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Full Content (Markdown/HTML supported)</label>
                            <textarea rows="8" style={{ fontFamily: 'monospace', fontSize: 13 }} required value={fields.content || ''} onChange={e => handleFieldChange('content', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Featured Image (Upload)</label>
                            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                            {(fields.image_url || fields.existing_image) && !imageFile && (
                                <p className="qe-help">Current image: <a href={fields.image_url || fields.existing_image} target="_blank" rel="noreferrer" className="qe-link">View Thumbnail</a></p>
                            )}
                        </div>
                        <div className="qe-checkbox">
                            <input type="checkbox" id="blog_active" checked={!!fields.is_published} onChange={e => handleFieldChange('is_published', e.target.checked ? 1 : 0)} />
                            <label htmlFor="blog_active">Is Published (Visible)</label>
                        </div>
                    </>
                );
            case 'gallery':
                return (
                    <>
                        <div className="qe-field">
                            <label>Title</label>
                            <input type="text" required value={fields.title || ''} onChange={e => handleFieldChange('title', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Description</label>
                            <textarea rows="2" value={fields.description || ''} onChange={e => handleFieldChange('description', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>Gallery Image (Upload)</label>
                            <input type="file" accept="image/*" required={action === 'add'} onChange={e => setImageFile(e.target.files[0])} />
                            {(fields.image_url || fields.existing_image) && !imageFile && (
                                <p className="qe-help">Current image: <a href={fields.image_url || fields.existing_image} target="_blank" rel="noreferrer" className="qe-link">View Thumbnail</a></p>
                            )}
                        </div>
                        <div className="qe-checkbox">
                            <input type="checkbox" id="gallery_active" checked={!!fields.is_active} onChange={e => handleFieldChange('is_active', e.target.checked ? 1 : 0)} />
                            <label htmlFor="gallery_active">Is Active (Visible)</label>
                        </div>
                    </>
                );
            case 'puzzle':
                return (
                    <>
                        <div className="qe-field">
                            <label>Puzzle Title</label>
                            <input type="text" required value={fields.title || ''} onChange={e => handleFieldChange('title', e.target.value)} />
                        </div>
                        <div className="qe-field">
                            <label>FEN String (Starting Position)</label>
                            <input type="text" required value={fields.fen || ''} onChange={e => handleFieldChange('fen', e.target.value)} placeholder="r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq -..." />
                        </div>
                        <div className="qe-field">
                            <label>Solution Sequence (JSON array, e.g. ["e2e4", "e7e5"])</label>
                            <input type="text" required value={fields.solution || ''} onChange={e => handleFieldChange('solution', e.target.value)} placeholder='["e2e4", "e7e5"]' />
                        </div>
                        <div className="grid-2">
                            <div className="qe-field">
                                <label>Difficulty</label>
                                <select value={fields.difficulty || 'Easy'} onChange={e => handleFieldChange('difficulty', e.target.value)}>
                                    <option value="Easy">Easy</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="qe-field">
                                <label>Theme</label>
                                <select value={fields.theme || 'Tactics'} onChange={e => handleFieldChange('theme', e.target.value)}>
                                    <option value="Tactics">Tactics</option>
                                    <option value="Opening">Opening</option>
                                    <option value="Endgame">Endgame</option>
                                    <option value="Defense">Defense</option>
                                </select>
                            </div>
                        </div>
                        <div className="qe-field">
                            <label>Hint (Optional)</label>
                            <input type="text" value={fields.hint || ''} onChange={e => handleFieldChange('hint', e.target.value)} />
                        </div>
                        <div className="qe-checkbox">
                            <input type="checkbox" id="puzzle_weekly" checked={!!fields.is_weekly} onChange={e => handleFieldChange('is_weekly', e.target.checked ? 1 : 0)} />
                            <label htmlFor="puzzle_weekly">Is Weekly Puzzle (Highlight on Home)</label>
                        </div>
                        <div className="qe-checkbox">
                            <input type="checkbox" id="puzzle_active" checked={!!fields.is_active} onChange={e => handleFieldChange('is_active', e.target.checked ? 1 : 0)} />
                            <label htmlFor="puzzle_active">Is Active (Visible)</label>
                        </div>
                    </>
                );
            default:
                return <p>Unsupported Type</p>;
        }
    };

    return (
        <div className="qe-modal-backdrop">
            {/* STYLES SPECIFIC TO QUICK EDIT MODAL */}
            <style>{`
                .qe-modal-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 11000;
                    padding: 20px;
                    animation: qeFadeIn 0.25s ease-out;
                }
                .qe-modal-container {
                    background: #11131e;
                    border: 2px solid rgba(201, 168, 76, 0.45);
                    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65), 0 0 20px rgba(201, 168, 76, 0.15);
                    border-radius: 16px;
                    width: 100%;
                    max-width: 580px;
                    max-height: 90vh;
                    overflow-y: auto;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    animation: qeModalPop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .qe-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .qe-header h3 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 800;
                    font-family: 'Merriweather', serif;
                    color: #c9a84c;
                    text-transform: capitalize;
                }
                .qe-close-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: none;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #a0aec0;
                    transition: all 0.2s;
                }
                .qe-close-btn:hover {
                    background: rgba(187, 38, 73, 0.2);
                    color: #bb2649;
                }
                .qe-body {
                    padding: 24px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .qe-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .qe-field.inline {
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
                .qe-field label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #a0aec0;
                    letter-spacing: 0.5px;
                }
                .qe-field input[type="text"],
                .qe-field input[type="number"],
                .qe-field select,
                .qe-field textarea {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1.5px solid rgba(255, 255, 255, 0.15);
                    border-radius: 8px;
                    padding: 10px 14px;
                    font-size: 14px;
                    color: #fff;
                    outline: none;
                    font-family: 'Roboto', sans-serif;
                    transition: all 0.2s;
                }
                .qe-field input[type="text"]:focus,
                .qe-field input[type="number"]:focus,
                .qe-field select:focus,
                .qe-field textarea:focus {
                    border-color: #c9a84c;
                    background: rgba(255, 255, 255, 0.08);
                    box-shadow: 0 0 8px rgba(201, 168, 76, 0.2);
                }
                .qe-field input[type="file"] {
                    font-size: 13px;
                    color: #a0aec0;
                }
                .qe-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-top: 6px;
                    cursor: pointer;
                }
                .qe-checkbox input {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    accent-color: #bb2649;
                }
                .qe-checkbox label {
                    font-size: 14px;
                    font-weight: 600;
                    color: #e2e8f0;
                    cursor: pointer;
                }
                .qe-footer {
                    padding: 18px 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }
                .qe-btn {
                    padding: 10px 24px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .qe-btn-cancel {
                    background: transparent;
                    color: #a0aec0;
                    border: 1px solid rgba(255,255,255,0.15);
                }
                .qe-btn-cancel:hover {
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                }
                .qe-btn-submit {
                    background: linear-gradient(135deg, #bb2649, #e53e3e);
                    color: #fff;
                    border: none;
                }
                .qe-btn-submit:hover {
                    opacity: 0.95;
                    transform: translateY(-1px);
                    box-shadow: 0 5px 15px rgba(187, 38, 73, 0.4);
                }
                .qe-btn-submit:disabled {
                    background: #2d3748;
                    color: #718096;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                .qe-error {
                    background: rgba(229, 62, 62, 0.15);
                    border: 1.5px solid #e53e3e;
                    color: #fed7d7;
                    border-radius: 8px;
                    padding: 12px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    text-align: center;
                }
                .qe-help {
                    margin: 4px 0 0;
                    font-size: 11px;
                    color: #718096;
                }
                .qe-link {
                    color: #c9a84c;
                    text-decoration: underline;
                }
                .grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }
                @keyframes qeFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes qeModalPop {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>

            <div className="qe-modal-container">
                <div className="qe-header">
                    <h3>{action} {type}</h3>
                    <button className="qe-close-btn" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="qe-body">
                        {error && <div className="qe-error">{error}</div>}
                        {renderFormFields()}
                    </div>

                    <div className="qe-footer">
                        <button type="button" className="qe-btn qe-btn-cancel" onClick={onClose} disabled={submitting}>
                            Cancel
                        </button>
                        <button type="submit" className="qe-btn qe-btn-submit" disabled={submitting}>
                            {submitting ? 'Saving Changes...' : 'Save and Publish'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuickEditModal;
