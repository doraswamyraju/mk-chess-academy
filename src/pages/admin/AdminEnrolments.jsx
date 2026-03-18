import React, { useState, useEffect } from 'react';
import { postToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminEnrolments = () => {
    const [enrolments, setEnrolments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingEnrolment, setEditingEnrolment] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchEnrolments();
    }, []);

    const fetchEnrolments = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/login'); return; }

        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_enrolments', token });
            if (data.status === 'success') {
                setEnrolments(data.enrolments || []);
            } else if (data.status === 'unauthorized') {
                navigate('/login');
            } else {
                setError(data.message || 'Failed to fetch enrolments');
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
            const data = await postToApi('api_admin_dashboard.php', { action: 'update_enrolment_status', token, id, status: newStatus });
            if (data.status === 'success') fetchEnrolments();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this enrolment?")) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_enrolment', token, id });
            if (data.status === 'success') fetchEnrolments();
            else alert(data.message || 'Failed to delete');
        } catch (err) { alert('Error deleting enrolment'); }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'update_enrolment', token, ...editingEnrolment });
            if (data.status === 'success') {
                setEditingEnrolment(null);
                fetchEnrolments();
            } else alert(data.message || 'Update failed');
        } catch (err) { alert('Error updating enrolment'); }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6 relative">
            <h2 className="text-xl font-bold text-[var(--dark-blue)] mb-4">Student Enrolments</h2>
            
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type/Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {enrolments.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.student_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><a href={`mailto:${item.parent_email}`} className="text-blue-600 hover:underline">{item.parent_email}</a></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="capitalize font-semibold">{item.student_type}</span>
                                                {item.country_timezone && <div className="text-xs text-gray-400">{item.country_timezone}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => updateStatus(item.id, e.target.value)}
                                                    className={`mt-1 block pl-3 pr-8 py-1 text-xs font-bold border-gray-300 focus:outline-none rounded-full ${item.status === 'pending' ? 'text-yellow-800 bg-yellow-100' : item.status === 'approved' ? 'text-green-800 bg-green-100' : 'text-red-800 bg-red-100'}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <button onClick={() => setEditingEnrolment(item)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {enrolments.length === 0 && (
                                        <tr><td colSpan="6" className="px-6 py-4 text-center text-gray-500">No enrolments found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editingEnrolment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Edit Enrolment</h3>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                                <input type="text" value={editingEnrolment.student_name} onChange={e => setEditingEnrolment({...editingEnrolment, student_name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Parent Email</label>
                                <input type="email" value={editingEnrolment.parent_email} onChange={e => setEditingEnrolment({...editingEnrolment, parent_email: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Student Type</label>
                                    <select value={editingEnrolment.student_type} onChange={e => setEditingEnrolment({...editingEnrolment, student_type: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                        <option value="indian">Indian</option>
                                        <option value="international">International</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location/Timezone</label>
                                    <input type="text" value={editingEnrolment.country_timezone || ''} onChange={e => setEditingEnrolment({...editingEnrolment, country_timezone: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select value={editingEnrolment.status} onChange={e => setEditingEnrolment({...editingEnrolment, status: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setEditingEnrolment(null)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[var(--primary-blue)] text-white rounded-md hover:bg-blue-700">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEnrolments;
