import React, { useState, useEffect } from 'react';
import { postToApi, postFormDataToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminCoaches = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    // Complex Form Data State
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        image: null,
        existing_image: '',
        is_active: 1,
        // JSON mapped fields
        quote: '',
        bioEarly: '',
        bioCareer: '',
        bioRatings: '',
        philApproach: '',
        philDrills: '',
        philFocus: '',
        expCollab: '',
        expIntl: '',
        expLang: '',
        achievementsList: '', // comma separated or text
        bannerImage: '' // text URL
    });

    useEffect(() => {
        fetchCoaches();
    }, []);

    const fetchCoaches = async () => {
        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_coaches' });
            if (data.status === 'success') {
                setCoaches(data.coaches || []);
            } else {
                setError(data.message || 'Failed to fetch coaches');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (coach) => {
        let bioJson = {};
        let achJson = {};
        try { bioJson = JSON.parse(coach.bio); } catch(e) {}
        try { achJson = JSON.parse(coach.achievements); } catch(e) {}

        setFormData({
            name: coach.name || '',
            role: coach.role || '',
            image: null,
            existing_image: coach.image_url || '',
            is_active: parseInt(coach.is_active),
            quote: achJson.quote || '',
            bannerImage: achJson.bannerImage || '',
            bioEarly: bioJson.early || '',
            bioCareer: bioJson.career || '',
            bioRatings: bioJson.ratings || '',
            philApproach: achJson.philApproach || '',
            philDrills: achJson.philDrills || '',
            philFocus: achJson.philFocus || '',
            expCollab: achJson.expCollab || '',
            expIntl: achJson.expIntl || '',
            expLang: achJson.expLang || '',
            achievementsList: achJson.achievementsList || ''
        });
        setEditingId(coach.id);
        setIsAdding(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this coach?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_coach', token, id });
            if (data.status === 'success') fetchCoaches();
            else alert(data.message || 'Failed to delete coach');
        } catch (err) {
            alert('Error deleting coach');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        
        // Pack data into JSON strings
        const packagedBio = JSON.stringify({
            early: formData.bioEarly,
            career: formData.bioCareer,
            ratings: formData.bioRatings
        });

        const packagedAchievements = JSON.stringify({
            quote: formData.quote,
            bannerImage: formData.bannerImage,
            philApproach: formData.philApproach,
            philDrills: formData.philDrills,
            philFocus: formData.philFocus,
            expCollab: formData.expCollab,
            expIntl: formData.expIntl,
            expLang: formData.expLang,
            achievementsList: formData.achievementsList
        });

        const submitData = new FormData();
        submitData.append('action', editingId ? 'update_coach' : 'add_coach');
        submitData.append('token', token);
        
        // Match the PHP structure for $data['coach']
        submitData.append('coach[name]', formData.name);
        submitData.append('coach[role]', formData.role);
        submitData.append('coach[bio]', packagedBio);
        submitData.append('coach[achievements]', packagedAchievements);
        submitData.append('coach[is_active]', formData.is_active);
        
        if (editingId) {
            submitData.append('coach[id]', editingId);
            submitData.append('coach[existing_image]', formData.existing_image);
        }
        if (formData.image) {
            submitData.append('image', formData.image);
        }

        try {
            const data = await postFormDataToApi('api_admin_dashboard.php', submitData);
            if (data.status === 'success') {
                setEditingId(null);
                setIsAdding(false);
                fetchCoaches();
            } else {
                alert(data.message || 'Error saving coach');
            }
        } catch (err) {
            alert('Error connecting to server');
        }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    const renderFormInfo = () => (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg p-8 max-w-4xl w-full shadow-2xl relative my-8">
                <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                <h3 className="text-2xl font-bold mb-6 text-[#1A237E]">{editingId ? 'Edit Coach' : 'Add New Coach'}</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h4 className="font-bold border-b pb-2">Basic Info</h4>
                            <div><label className="block text-sm font-medium">Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full border rounded p-2" /></div>
                            <div><label className="block text-sm font-medium">Titles (Comma separated)</label><input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="mt-1 w-full border rounded p-2" /></div>
                            <div><label className="block text-sm font-medium">Quote</label><textarea required value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="mt-1 w-full border rounded p-2" rows="2"></textarea></div>
                            <div>
                                <label className="block text-sm font-medium">Profile Image</label>
                                <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="mt-1 w-full" />
                                {formData.existing_image && <img src={formData.existing_image} alt="Current" className="mt-2 h-20 rounded" />}
                            </div>
                            <div><label className="block text-sm font-medium">Banner Image URL</label><input type="text" value={formData.bannerImage} onChange={e => setFormData({...formData, bannerImage: e.target.value})} className="mt-1 w-full border rounded p-2 text-sm text-gray-500" placeholder="https://unsplash.com/..."/></div>
                            <div><label className="block text-sm font-medium">Active Status</label><select value={formData.is_active} onChange={e => setFormData({...formData, is_active: parseInt(e.target.value)})} className="mt-1 w-full border rounded p-2"><option value={1}>Active</option><option value={0}>Inactive</option></select></div>
                        </div>

                        {/* Biography */}
                        <div className="space-y-4">
                            <h4 className="font-bold border-b pb-2">Biography</h4>
                            <div><label className="block text-sm font-medium">Early Journey</label><textarea value={formData.bioEarly} onChange={e => setFormData({...formData, bioEarly: e.target.value})} className="mt-1 w-full border rounded p-2" rows="3"></textarea></div>
                            <div><label className="block text-sm font-medium">Career Highlights</label><textarea value={formData.bioCareer} onChange={e => setFormData({...formData, bioCareer: e.target.value})} className="mt-1 w-full border rounded p-2" rows="3"></textarea></div>
                            <div><label className="block text-sm font-medium">Ratings/Titles Details</label><textarea value={formData.bioRatings} onChange={e => setFormData({...formData, bioRatings: e.target.value})} className="mt-1 w-full border rounded p-2" rows="3"></textarea></div>
                        </div>

                        {/* Philosophy & Experience */}
                        <div className="space-y-4">
                            <h4 className="font-bold border-b pb-2">Philosophy</h4>
                            <div><label className="block text-sm font-medium">Teaching Approach</label><textarea value={formData.philApproach} onChange={e => setFormData({...formData, philApproach: e.target.value})} className="mt-1 w-full border rounded p-2" rows="2"></textarea></div>
                            <div><label className="block text-sm font-medium">Signature Drills</label><textarea value={formData.philDrills} onChange={e => setFormData({...formData, philDrills: e.target.value})} className="mt-1 w-full border rounded p-2" rows="2"></textarea></div>
                            <div><label className="block text-sm font-medium">Student Focus</label><textarea value={formData.philFocus} onChange={e => setFormData({...formData, philFocus: e.target.value})} className="mt-1 w-full border rounded p-2" rows="2"></textarea></div>
                        </div>
                        
                        <div className="space-y-4">
                            <h4 className="font-bold border-b pb-2">Experience & Achievements</h4>
                            <div><label className="block text-sm font-medium">Institutes & Collabs</label><textarea value={formData.expCollab} onChange={e => setFormData({...formData, expCollab: e.target.value})} className="mt-1 w-full border rounded p-2" rows="2"></textarea></div>
                            <div><label className="block text-sm font-medium">International Exposure</label><textarea value={formData.expIntl} onChange={e => setFormData({...formData, expIntl: e.target.value})} className="mt-1 w-full border rounded p-2" rows="2"></textarea></div>
                            <div><label className="block text-sm font-medium">Languages (Comma separated)</label><input type="text" value={formData.expLang} onChange={e => setFormData({...formData, expLang: e.target.value})} className="mt-1 w-full border rounded p-2" /></div>
                            <div><label className="block text-sm font-medium">Bullet Point Achievements (One per line)</label><textarea value={formData.achievementsList} onChange={e => setFormData({...formData, achievementsList: e.target.value})} className="mt-1 w-full border rounded p-2" rows="3"></textarea></div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t">
                        <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg mr-4 font-bold">Cancel</button>
                        <button type="submit" className="bg-[#1A237E] text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-opacity-90">{editingId ? 'Save Changes' : 'Add Coach'}</button>
                    </div>
                </form>
            </div>
        </div>
    );

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage Coaches</h2>
                <button onClick={() => { 
                    setFormData({name: '', role: '', image: null, existing_image: '', is_active: 1, quote: '', bioEarly: '', bioCareer: '', bioRatings: '', philApproach: '', philDrills: '', philFocus: '', expCollab: '', expIntl: '', expLang: '', achievementsList: '', bannerImage: ''}); 
                    setIsAdding(true); 
                }} className="bg-[#1e3a8a] text-white px-4 py-2 rounded-md font-bold text-sm">+ Add Coach</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coaches.map(coach => (
                    <div key={coach.id} className="border rounded-lg p-6 flex flex-col md:flex-row gap-6 shadow-sm">
                        {coach.image_url ? (
                            <img src={coach.image_url} alt={coach.name} className="w-24 h-24 object-cover rounded-full border-4 border-gray-100 mx-auto md:mx-0" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto md:mx-0 flex items-center justify-center font-bold text-gray-400">No Img</div>
                        )}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-bold text-[#1e3a8a] mb-1">{coach.name}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-1">{coach.role}</p>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${parseInt(coach.is_active) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {parseInt(coach.is_active) ? 'Active' : 'Hidden'}
                            </span>
                            <div className="mt-4 flex justify-center md:justify-start space-x-4">
                                <button onClick={() => handleEdit(coach)} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit Options</button>
                                <button onClick={() => handleDelete(coach.id)} className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(isAdding || editingId) && renderFormInfo()}
        </div>
    );
};

export default AdminCoaches;
