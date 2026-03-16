import React, { useState, useEffect } from 'react';
import { postToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminFAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFaq, setCurrentFaq] = useState({ id: null, question: '', answer: '', display_order: 0, is_active: 1 });
    const navigate = useNavigate();

    useEffect(() => { fetchFaqs(); }, []);

    const fetchFaqs = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/login'); return; }
        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_faqs', token });
            if (data.status === 'success') { setFaqs(data.faqs || []); } 
            else if (data.status === 'unauthorized') { navigate('/login'); }
            else { setError(data.message || 'Failed to fetch FAQs'); }
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const action = currentFaq.id ? 'update_faq' : 'add_faq';
            const data = await postToApi('api_admin_dashboard.php', { action, token, faq: currentFaq });
            if (data.status === 'success') {
                setIsEditing(false);
                setCurrentFaq({ id: null, question: '', answer: '', display_order: 0, is_active: 1 });
                fetchFaqs();
            } else { alert(data.message); }
        } catch (err) { alert('Error saving FAQ'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this FAQ?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_faq', token, id });
            if (data.status === 'success') fetchFaqs();
        } catch (err) { alert('Error deleting FAQ'); }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage FAQs</h2>
                {!isEditing && (
                    <button onClick={() => { setIsEditing(true); setCurrentFaq({ id: null, question: '', answer: '', display_order: faqs.length, is_active: 1 }); }} className="bg-[var(--primary-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add New FAQ
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg mb-4 font-semibold text-gray-800">{currentFaq.id ? 'Edit FAQ' : 'Add New FAQ'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Question</label>
                            <input type="text" required value={currentFaq.question} onChange={(e) => setCurrentFaq({...currentFaq, question: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Answer</label>
                            <textarea required value={currentFaq.answer} onChange={(e) => setCurrentFaq({...currentFaq, answer: e.target.value})} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border"></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Display Order</label>
                                <input type="number" required value={currentFaq.display_order} onChange={(e) => setCurrentFaq({...currentFaq, display_order: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border" />
                            </div>
                            <div className="flex items-center mt-6">
                                <input type="checkbox" checked={currentFaq.is_active} onChange={(e) => setCurrentFaq({...currentFaq, is_active: e.target.checked ? 1 : 0})} id="is_active" className="h-4 w-4 text-[var(--primary-blue)] rounded" />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (Visible)</label>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save FAQ</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {faqs.map(faq => (
                        <div key={faq.id} className={`border p-4 rounded-lg flex justify-between items-start ${faq.is_active ? 'bg-white' : 'bg-gray-100 opacity-75'}`}>
                            <div>
                                <h4 className="text-lg font-bold text-gray-900 mb-1">{faq.question}</h4>
                                <p className="text-gray-600 text-sm whitespace-pre-wrap">{faq.answer}</p>
                                <span className="text-xs text-gray-400 mt-2 block">Order: {faq.display_order}</span>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0 ml-4">
                                <button onClick={() => { setIsEditing(true); setCurrentFaq(faq); }} className="text-blue-600 hover:text-blue-900 font-medium">Edit</button>
                                <button onClick={() => handleDelete(faq.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                            </div>
                        </div>
                    ))}
                    {faqs.length === 0 && <div className="text-center py-8 text-gray-500">No FAQs found.</div>}
                </div>
            )}
        </div>
    );
};

export default AdminFAQ;
