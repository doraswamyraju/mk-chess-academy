import React, { useState, useEffect } from 'react';
import { postToApi, postFormDataToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminTestimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    
    // Using avatar_file to hold the File object
    const [currentTestimonial, setCurrentTestimonial] = useState({ 
        id: null, student_name: '', course_taken: '', review_text: '', 
        avatar_file: null, avatar_url: '', rating: 5, is_active: 1 
    });
    
    const navigate = useNavigate();

    useEffect(() => { fetchTestimonials(); }, []);

    const fetchTestimonials = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/login'); return; }
        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_testimonials', token });
            if (data.status === 'success') { setTestimonials(data.testimonials || []); } 
            else if (data.status === 'unauthorized') { navigate('/login'); }
            else { setError(data.message || 'Failed to fetch testimonials'); }
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const action = currentTestimonial.id ? 'update_testimonial' : 'add_testimonial';
            
            const formData = new FormData();
            formData.append('action', action);
            formData.append('token', token);
            formData.append('student_name', currentTestimonial.student_name);
            formData.append('course_taken', currentTestimonial.course_taken);
            formData.append('review_text', currentTestimonial.review_text);
            formData.append('rating', currentTestimonial.rating);
            formData.append('is_active', currentTestimonial.is_active ? 1 : 0);
            
            if (currentTestimonial.id) {
                formData.append('id', currentTestimonial.id);
                formData.append('existing_image', currentTestimonial.avatar_url);
            }
            if (currentTestimonial.avatar_file) {
                // Re-using the same image backend method which looks for 'image' field
                formData.append('image', currentTestimonial.avatar_file);
            }

            const data = await postFormDataToApi('api_admin_dashboard.php', formData);
            if (data.status === 'success') {
                setIsEditing(false);
                setCurrentTestimonial({ id: null, student_name: '', course_taken: '', review_text: '', avatar_file: null, avatar_url: '', rating: 5, is_active: 1 });
                fetchTestimonials();
            } else { alert(data.message); }
        } catch (err) { alert('Error saving testimonial'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this testimonial?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_testimonial', token, id });
            if (data.status === 'success') fetchTestimonials();
        } catch (err) { alert('Error deleting testimonial'); }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage Testimonials</h2>
                {!isEditing && (
                    <button onClick={() => { setIsEditing(true); setCurrentTestimonial({ id: null, student_name: '', course_taken: '', review_text: '', avatar_file: null, avatar_url: '', rating: 5, is_active: 1 }); }} className="bg-[var(--primary-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add New Testimonial
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg mb-4 font-semibold text-gray-800">{currentTestimonial.id ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                                <input type="text" required value={currentTestimonial.student_name} onChange={(e) => setCurrentTestimonial({...currentTestimonial, student_name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course Taken</label>
                                <input type="text" value={currentTestimonial.course_taken} onChange={(e) => setCurrentTestimonial({...currentTestimonial, course_taken: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Review Text</label>
                            <textarea required value={currentTestimonial.review_text} onChange={(e) => setCurrentTestimonial({...currentTestimonial, review_text: e.target.value})} rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border"></textarea>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Upload Avatar Image (Student Photo)</label>
                                <input type="file" accept="image/*" onChange={(e) => setCurrentTestimonial({...currentTestimonial, avatar_file: e.target.files[0]})} className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700" />
                                {currentTestimonial.avatar_url && !currentTestimonial.avatar_file && <div className="mt-2 text-xs text-gray-500">Current avatar: <a href={currentTestimonial.avatar_url} target="_blank" rel="noreferrer" className="text-blue-500 underline">View</a></div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rating (1 to 5)</label>
                                <input type="number" min="1" max="5" required value={currentTestimonial.rating} onChange={(e) => setCurrentTestimonial({...currentTestimonial, rating: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border" />
                            </div>
                        </div>
                        
                        <div className="flex items-center mt-6">
                            <input type="checkbox" checked={currentTestimonial.is_active} onChange={(e) => setCurrentTestimonial({...currentTestimonial, is_active: e.target.checked ? 1 : 0})} id="is_active" className="h-4 w-4 text-[var(--primary-blue)] rounded" />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (Visible)</label>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save Testimonial</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map(test => (
                        <div key={test.id} className={`border p-5 rounded-lg shadow-sm flex flex-col justify-between ${test.is_active ? 'bg-white' : 'bg-gray-100 opacity-75'}`}>
                            <div>
                                <div className="flex items-center mb-4">
                                    {test.avatar_url ? (
                                        <img src={test.avatar_url} alt={test.student_name} className="w-12 h-12 rounded-full object-cover mr-4" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mr-4">
                                            {test.student_name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-gray-900">{test.student_name}</h4>
                                        <span className="text-xs text-gray-500">{test.course_taken}</span>
                                    </div>
                                </div>
                                <div className="text-yellow-400 text-sm mb-2">
                                    {'★'.repeat(test.rating)}{'☆'.repeat(5 - test.rating)}
                                </div>
                                <p className="text-gray-600 text-sm italic line-clamp-4">"{test.review_text}"</p>
                            </div>
                            <div className="flex justify-start space-x-4 mt-4 pt-4 border-t border-gray-100">
                                <button onClick={() => { setIsEditing(true); setCurrentTestimonial(test); }} className="text-blue-600 font-medium text-sm">Edit</button>
                                <button onClick={() => handleDelete(test.id)} className="text-red-600 font-medium text-sm">Delete</button>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && <div className="col-span-full py-8 text-center text-gray-500">No testimonials found.</div>}
                </div>
            )}
        </div>
    );
};

export default AdminTestimonials;
