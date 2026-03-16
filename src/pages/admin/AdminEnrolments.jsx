import React, { useState, useEffect } from 'react';
import { postToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminEnrolments = () => {
    const [enrolments, setEnrolments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            if (data.status === 'success') {
                fetchEnrolments(); // refresh
            }
        } catch (err) {
            alert('Error updating status');
        }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
            <h2 className="text-xl font-bold text-[var(--dark-blue)] mb-4">Student Enrolments</h2>
            
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Email</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type/Location</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {enrolments.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.student_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.parent_email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className="capitalize font-semibold">{item.student_type}</span>
                                                {item.country_timezone && <div className="text-xs text-gray-400">{item.country_timezone}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => updateStatus(item.id, e.target.value)}
                                                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[var(--primary-blue)] focus:border-[var(--primary-blue)] sm:text-sm rounded-md font-bold ${item.status === 'pending' ? 'text-yellow-600 bg-yellow-50' : item.status === 'approved' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {enrolments.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No enrolments found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEnrolments;
