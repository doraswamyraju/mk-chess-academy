import React, { useState, useEffect } from 'react';
import { postToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState({ id: null, title: '', category: '', excerpt: '', image_url: '', is_published: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/login'); return; }

        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_blogs', token });
            if (data.status === 'success') {
                setPosts(data.blogs || []);
            } else if (data.status === 'unauthorized') {
                navigate('/login');
            } else {
                setError(data.message || 'Failed to fetch blog posts');
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
            const action = currentPost.id ? 'update_blog' : 'add_blog';
            const data = await postToApi('api_admin_dashboard.php', { action, token, blog: currentPost });
            if (data.status === 'success') {
                setIsEditing(false);
                setCurrentPost({ id: null, title: '', category: '', excerpt: '', image_url: '', is_published: 0 });
                fetchPosts();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Error saving blog post');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_blog', token, id });
            if (data.status === 'success') {
                fetchPosts();
            }
        } catch (err) {
            alert('Error deleting blog post');
        }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage Blog Posts</h2>
                {!isEditing && (
                    <button onClick={() => { setIsEditing(true); setCurrentPost({ id: null, title: '', category: '', excerpt: '', image_url: '', is_published: 0 }); }} className="bg-[var(--primary-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add New Post
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg mb-4 font-semibold text-gray-800">{currentPost.id ? 'Edit Post' : 'Add New Post'}</h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Post Title</label>
                            <input type="text" required value={currentPost.title} onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input type="text" required value={currentPost.category} onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                <input type="text" value={currentPost.image_url} onChange={(e) => setCurrentPost({...currentPost, image_url: e.target.value})} placeholder="https://..." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Short Excerpt</label>
                            <textarea required value={currentPost.excerpt} onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></textarea>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" checked={currentPost.is_published} onChange={(e) => setCurrentPost({...currentPost, is_published: e.target.checked ? 1 : 0})} id="is_published" className="h-4 w-4 text-[var(--primary-blue)] border-gray-300 rounded" />
                            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">Published (Visible on Website)</label>
                        </div>
                        <div className="flex gap-4">
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Save Post</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => (
                        <div key={post.id} className={`border rounded-lg overflow-hidden shadow-sm ${post.is_published ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-300 opacity-75'}`}>
                            {post.image_url && <img src={post.image_url} alt={post.title} className="w-full h-32 object-cover" />}
                            <div className="p-4">
                                <div className="text-xs font-semibold text-blue-600 mb-1">{post.category}</div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={post.title}>{post.title}</h3>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>
                                
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {post.is_published ? 'Published' : 'Draft'}
                                    </span>
                                    <div className="space-x-2">
                                        <button onClick={() => { setIsEditing(true); setCurrentPost(post); }} className="text-blue-600 hover:text-blue-900 text-sm">Edit</button>
                                        <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900 text-sm">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500">No posts found. Click "Add New Post" to create one.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminBlog;
