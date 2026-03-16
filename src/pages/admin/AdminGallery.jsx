import React, { useState, useEffect } from 'react';
import { postToApi, postFormDataToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentImage, setCurrentImage] = useState({ id: null, title: '', description: '', image_file: null, image_url: '', is_active: 1 });
    const navigate = useNavigate();

    useEffect(() => { fetchGallery(); }, []);

    const fetchGallery = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/login'); return; }
        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_gallery', token });
            if (data.status === 'success') { setImages(data.gallery || []); } 
            else if (data.status === 'unauthorized') { navigate('/login'); }
            else { setError(data.message || 'Failed to fetch gallery'); }
        } catch (err) { setError(err.message); } 
        finally { setLoading(false); }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const action = currentImage.id ? 'update_gallery' : 'add_gallery';
            
            const formData = new FormData();
            formData.append('action', action);
            formData.append('token', token);
            formData.append('title', currentImage.title);
            formData.append('description', currentImage.description);
            formData.append('is_active', currentImage.is_active ? 1 : 0);
            
            if (currentImage.id) {
                formData.append('id', currentImage.id);
                formData.append('existing_image', currentImage.image_url);
            }
            if (currentImage.image_file) {
                formData.append('image', currentImage.image_file);
            }

            const data = await postFormDataToApi('api_admin_dashboard.php', formData);
            if (data.status === 'success') {
                setIsEditing(false);
                setCurrentImage({ id: null, title: '', description: '', image_file: null, image_url: '', is_active: 1 });
                fetchGallery();
            } else { alert(data.message); }
        } catch (err) { alert('Error saving image'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_gallery', token, id });
            if (data.status === 'success') fetchGallery();
        } catch (err) { alert('Error deleting image'); }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage Gallery</h2>
                {!isEditing && (
                    <button onClick={() => { setIsEditing(true); setCurrentImage({ id: null, title: '', description: '', image_file: null, image_url: '', is_active: 1 }); }} className="bg-[var(--primary-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add New Image
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg mb-4 font-semibold text-gray-800">{currentImage.id ? 'Edit Image' : 'Add New Image'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image Title</label>
                                <input type="text" required value={currentImage.title} onChange={(e) => setCurrentImage({...currentImage, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Upload File</label>
                                <input type="file" accept="image/*" onChange={(e) => setCurrentImage({...currentImage, image_file: e.target.files[0]})} className="mt-1 block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700" />
                                {currentImage.image_url && !currentImage.image_file && <div className="mt-2 text-xs text-gray-500">Current image: <a href={currentImage.image_url} target="_blank" rel="noreferrer" className="text-blue-500 underline">View</a></div>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                            <textarea value={currentImage.description} onChange={(e) => setCurrentImage({...currentImage, description: e.target.value})} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border"></textarea>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" checked={currentImage.is_active} onChange={(e) => setCurrentImage({...currentImage, is_active: e.target.checked ? 1 : 0})} id="is_active" className="h-4 w-4 text-[var(--primary-blue)] rounded" />
                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (Visible in Gallery)</label>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save Image</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map(img => (
                        <div key={img.id} className={`border rounded-lg overflow-hidden shadow-sm ${img.is_active ? 'bg-white' : 'opacity-75'}`}>
                            {img.image_url && <img src={img.image_url} alt={img.title} className="w-full h-32 object-cover bg-gray-200" />}
                            <div className="p-3">
                                <h3 className="font-bold text-gray-900 text-sm truncate">{img.title}</h3>
                                {img.description && <p className="text-xs text-gray-500 mt-1 truncate">{img.description}</p>}
                                <div className="flex justify-between mt-3 text-sm">
                                    <button onClick={() => { setIsEditing(true); setCurrentImage(img); }} className="text-blue-600 font-medium">Edit</button>
                                    <button onClick={() => handleDelete(img.id)} className="text-red-600 font-medium">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {images.length === 0 && <div className="col-span-full text-center py-8 text-gray-500">No images found.</div>}
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
