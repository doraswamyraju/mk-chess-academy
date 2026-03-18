import React, { useState, useEffect } from 'react';
import { postToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingLead, setEditingLead] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/login'); return; }

        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_leads', token });
            if (data.status === 'success') {
                setLeads(data.leads || []);
            } else if (data.status === 'unauthorized') {
                navigate('/login');
            } else {
                setError(data.message || 'Failed to fetch leads');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'update_lead_status', token, id, status: newStatus });
            if (data.status === 'success') fetchLeads();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this lead?")) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_lead', token, id });
            if (data.status === 'success') fetchLeads();
            else alert(data.message || 'Failed to delete');
        } catch (err) { alert('Error deleting lead'); }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'update_lead', token, ...editingLead });
            if (data.status === 'success') {
                setEditingLead(null);
                fetchLeads();
            } else alert(data.message || 'Update failed');
        } catch (err) { alert('Error updating lead'); }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6 relative">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Leads</h2>
            
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {leads.map((lead) => (
                                        <tr key={lead.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                                                <div className="text-sm text-gray-500"><a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">{lead.email}</a></div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={lead.message}>{lead.message}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                    className={`mt-1 block pl-3 pr-8 py-1 text-xs font-bold border-gray-300 focus:outline-none rounded-full ${lead.status === 'new' ? 'bg-red-100 text-red-800' : lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}
                                                >
                                                    <option value="new">New</option>
                                                    <option value="contacted">Contacted</option>
                                                    <option value="resolved">Resolved</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <button onClick={() => setEditingLead(lead)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {leads.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No leads found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingLead && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Edit Lead</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input type="text" value={editingLead.name} onChange={e => setEditingLead({...editingLead, name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" value={editingLead.email} onChange={e => setEditingLead({...editingLead, email: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea rows="4" value={editingLead.message} onChange={e => setEditingLead({...editingLead, message: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select value={editingLead.status} onChange={e => setEditingLead({...editingLead, status: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="resolved">Resolved</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setEditingLead(null)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLeads;
