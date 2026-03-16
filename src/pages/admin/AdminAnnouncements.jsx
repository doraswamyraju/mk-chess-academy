import React, { useState, useEffect } from 'react';
import { postToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminAnnouncements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAnn, setCurrentAnn] = useState({ id: null, title: '', message: '', is_active: 1 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/admin/login'); return; }

        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_announcements', token });
            if (data.status === 'success') {
                setAnnouncements(data.announcements || []);
            } else if (data.status === 'unauthorized') {
                navigate('/admin/login');
            } else {
                setError(data.message || 'Failed to fetch announcements');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const action = currentAnn.id ? 'update_announcement' : 'add_announcement';
            const data = await postToApi('api_admin_dashboard.php', { action, token, announcement: currentAnn });
            if (data.status === 'success') {
                setIsEditing(false);
                setCurrentAnn({ id: null, title: '', message: '', is_active: 1 });
                fetchAnnouncements();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Error saving announcement');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_announcement', token, id });
            if (data.status === 'success') {
                fetchAnnouncements();
            }
        } catch (err) {
            alert('Error deleting announcement');
        }
    };

    const deactivateAllBut = async (idToKeep) => {
        const token = localStorage.getItem('adminToken');
        const activeAnns = announcements.filter(a => a.is_active && a.id !== idToKeep);
        if(activeAnns.length > 0) {
           for(let ann of activeAnns) {
               await postToApi('api_admin_dashboard.php', { action: 'update_announcement', token, announcement: {...ann, is_active: 0} });
           }
        }
    }

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage Banner Announcements</h2>
                {!isEditing && (
                    <button onClick={() => { setIsEditing(true); setCurrentAnn({ id: null, title: '', message: '', is_active: 1 }); }} className="bg-[var(--accent-red)] hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Add New Announcement
                    </button>
                )}
            </div>
            
            <p className="text-sm text-gray-500 mb-6">Active announcements will display as a scrolling banner at the top of the website. (It is recommended to have only one active at a time).</p>

            {isEditing ? (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg mb-4 font-semibold text-gray-800">{currentAnn.id ? 'Edit Announcement' : 'Add New Announcement'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Banner Title (Internal use)</label>
                            <input type="text" required value={currentAnn.title} onChange={(e) => setCurrentAnn({...currentAnn, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Display Message (Public text)</label>
                            <textarea required value={currentAnn.message} onChange={(e) => setCurrentAnn({...currentAnn, message: e.target.value})} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-2 border" placeholder="e.g. Admissions now open for summer batch!"></textarea>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" checked={currentAnn.is_active} onChange={(e) => setCurrentAnn({...currentAnn, is_active: e.target.checked ? 1 : 0})} id="is_active" className="h-4 w-4 text-[var(--accent-red)] border-gray-300 rounded" />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (Displays on Website)</label>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" onClick={() => {if(currentAnn.is_active) deactivateAllBut(currentAnn.id)}} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save & Publish</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map(ann => (
                        <div key={ann.id} className={`border rounded-lg p-5 shadow-sm flex items-center justify-between ${ann.is_active ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900">
                                    {ann.title} 
                                    {ann.is_active && <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Active</span>}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{ann.message}</p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                                <button onClick={() => { setIsEditing(true); setCurrentAnn(ann); }} className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded text-sm font-medium">Edit</button>
                                <button onClick={() => handleDelete(ann.id)} className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded text-sm font-medium">Delete</button>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">No announcements found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncements;
