import React, { useState, useEffect } from 'react';
import { postToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ leads: 0, enrolments: 0, courses: 0, blogs: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin/login');
                return;
            }

            try {
                const data = await postToApi('api_admin_dashboard.php', {
                    action: 'get_stats',
                    token: token
                });
                
                if (data.status === 'success') {
                    setStats(data.stats);
                } else if (data.status === 'unauthorized') {
                    localStorage.removeItem('adminToken');
                    navigate('/admin/login');
                }
            } catch (err) {
                console.error("Failed to load stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [navigate]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-blue)]"></div></div>;
    }

    const statCards = [
        { name: 'Total New Leads', value: stats.leads, onClick: () => navigate('/admin/leads'), color: 'bg-blue-500' },
        { name: 'Pending Enrolments', value: stats.enrolments, onClick: () => navigate('/admin/enrolments'), color: 'bg-green-500' },
        { name: 'Active Courses', value: stats.courses, onClick: () => navigate('/admin/courses'), color: 'bg-purple-500' },
        { name: 'Published Blogs', value: stats.blogs, onClick: () => navigate('/admin/blog'), color: 'bg-yellow-500' },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back, Admin!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div 
                        key={stat.name} 
                        onClick={stat.onClick}
                        className="bg-white overflow-hidden shadow rounded-lg cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg border-l-4"
                        style={{ borderLeftColor: stat.color.replace('bg-', '') }} // simple color mapping trick not fully accurate but okay for demo placeholder
                    >
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                        <dd className="space-y-1">
                                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm">
                                <span className="font-medium text-[var(--primary-blue)] hover:text-blue-500">View all</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-8 bg-white shadow rounded-lg p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex space-x-4">
                    <button onClick={() => navigate('/admin/blog')} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--primary-blue)] hover:bg-opacity-90">
                        Write New Blog Post
                    </button>
                    <button onClick={() => navigate('/admin/courses')} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--accent-red)] hover:bg-opacity-90">
                        Add Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
