import React, { useState, useEffect } from 'react';
import { postToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCourse, setCurrentCourse] = useState({ id: null, title: '', level: '', features: '', is_active: 1 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/admin/login'); return; }

        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_courses', token });
            if (data.status === 'success') {
                setCourses(data.courses || []);
            } else if (data.status === 'unauthorized') {
                navigate('/admin/login');
            } else {
                setError(data.message || 'Failed to fetch courses');
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
            const action = currentCourse.id ? 'update_course' : 'add_course';
            const data = await postToApi('api_admin_dashboard.php', { action, token, course: currentCourse });
            if (data.status === 'success') {
                setIsEditing(false);
                setCurrentCourse({ id: null, title: '', level: '', features: '', is_active: 1 });
                fetchCourses();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Error saving course');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_course', token, id });
            if (data.status === 'success') {
                fetchCourses();
            }
        } catch (err) {
            alert('Error deleting course');
        }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage Courses</h2>
                {!isEditing && (
                    <button onClick={() => { setIsEditing(true); setCurrentCourse({ id: null, title: '', level: '', features: '', is_active: 1 }); }} className="bg-[var(--primary-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add New Course
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg mb-4 font-semibold text-gray-800">{currentCourse.id ? 'Edit Course' : 'Add New Course'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course Title</label>
                            <input type="text" required value={currentCourse.title} onChange={(e) => setCurrentCourse({...currentCourse, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Level Description</label>
                            <input type="text" required value={currentCourse.level} onChange={(e) => setCurrentCourse({...currentCourse, level: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Features (Comma separated)</label>
                            <textarea required value={currentCourse.features} onChange={(e) => setCurrentCourse({...currentCourse, features: e.target.value})} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="e.g., Fundamentals & Rules, Basic Tactics, Fun-based Learning"></textarea>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" checked={currentCourse.is_active} onChange={(e) => setCurrentCourse({...currentCourse, is_active: e.target.checked ? 1 : 0})} id="is_active" className="h-4 w-4 text-[var(--primary-blue)] border-gray-300 rounded" />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (Visible on Website)</label>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save Course</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <div key={course.id} className={`border rounded-lg p-6 shadow-sm ${course.is_active ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-300 opacity-75'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                                <div className="space-x-2">
                                    <button onClick={() => { setIsEditing(true); setCurrentCourse(course); }} className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1 rounded">Edit</button>
                                    <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded">Delete</button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">{course.level}</p>
                            <div className="mb-4">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Features:</span>
                                <ul className="mt-2 text-sm text-gray-600 list-disc pl-5 space-y-1">
                                    {(course.features || '').split(',').map((f, i) => <li key={i}>{f.trim()}</li>)}
                                </ul>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${course.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                    {course.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">No courses found. Click "Add New Course" to create one.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
