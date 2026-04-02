import React, { useState, useEffect } from 'react';
import { postToApi } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const AdminPuzzles = () => {
    const [puzzles, setPuzzles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [aiCode, setAiCode] = useState('');
    const [aiStatus, setAiStatus] = useState('');
    const [currentPuzzle, setCurrentPuzzle] = useState({
        id: null,
        title: '',
        fen: '',
        solution: '[]',
        difficulty: 'Easy',
        theme: 'Tactics',
        hint: '',
        is_weekly: 0,
        is_active: 1
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchPuzzles();
    }, []);

    const fetchPuzzles = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) { navigate('/login'); return; }

        try {
            setLoading(true);
            const data = await postToApi('api_admin_dashboard.php', { action: 'get_puzzles', token });
            if (data.status === 'success') {
                setPuzzles(data.puzzles || []);
            } else if (data.status === 'unauthorized') {
                navigate('/login');
            } else {
                setError(data.message || 'Failed to fetch puzzles');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAiImport = () => {
        try {
            const data = JSON.parse(aiCode);
            setCurrentPuzzle({
                ...currentPuzzle,
                title: data.title || '',
                fen: data.fen || '',
                solution: Array.isArray(data.solution) ? JSON.stringify(data.solution) : (data.solution || '[]'),
                difficulty: data.difficulty || 'Easy',
                theme: data.theme || 'Tactics',
                hint: data.hint || ''
            });
            setAiStatus('Import successful! Form updated.');
            setTimeout(() => setAiStatus(''), 3000);
        } catch (e) {
            setAiStatus('Error: Invalid JSON format. Make sure it follows the correct structure.');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        try {
            const action = currentPuzzle.id ? 'update_puzzle' : 'add_puzzle';
            
            const data = await postToApi('api_admin_dashboard.php', {
                action,
                token,
                puzzle: currentPuzzle
            });

            if (data.status === 'success') {
                setIsEditing(false);
                setCurrentPuzzle({ id: null, title: '', fen: '', solution: '[]', difficulty: 'Easy', theme: 'Tactics', hint: '', is_weekly: 0, is_active: 1 });
                setAiCode('');
                fetchPuzzles();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert('Error saving puzzle');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this puzzle?')) return;
        const token = localStorage.getItem('adminToken');
        try {
            const data = await postToApi('api_admin_dashboard.php', { action: 'delete_puzzle', token, id });
            if (data.status === 'success') {
                fetchPuzzles();
            }
        } catch (err) {
            alert('Error deleting puzzle');
        }
    };

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 p-8">{error}</div>;

    return (
        <div className="bg-white shadow rounded-lg px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Manage Interactive Puzzles</h2>
                {!isEditing && (
                    <button onClick={() => { setIsEditing(true); setCurrentPuzzle({ id: null, title: '', fen: '', solution: '[]', difficulty: 'Easy', theme: 'Tactics', hint: '', is_weekly: 0, is_active: 1 }); }} className="bg-[var(--primary-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Add New Puzzle
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="mb-8 space-y-6">
                    {/* AI Import Section */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <label className="block text-sm font-semibold text-blue-800 mb-2">Import from AI (ChatGPT JSON)</label>
                        <div className="flex gap-2">
                            <textarea 
                                value={aiCode} 
                                onChange={(e) => setAiCode(e.target.value)}
                                className="flex-1 p-2 text-xs font-mono rounded border border-blue-200" 
                                rows="3" 
                                placeholder='Paste JSON here: { "title": "...", "fen": "...", "solution": [...], ... }'
                            ></textarea>
                            <button 
                                type="button"
                                onClick={handleAiImport}
                                className="bg-blue-600 self-start text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >Import Contents</button>
                        </div>
                        {aiStatus && <p className={`mt-1 text-xs ${aiStatus.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{aiStatus}</p>}
                    </div>

                    <form onSubmit={handleSave} className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">{currentPuzzle.id ? 'Edit Puzzle' : 'New Puzzle Details'}</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Puzzle Title</label>
                                <input type="text" required value={currentPuzzle.title} onChange={(e) => setCurrentPuzzle({...currentPuzzle, title: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                                <select value={currentPuzzle.difficulty} onChange={(e) => setCurrentPuzzle({...currentPuzzle, difficulty: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                                    <option value="Easy">Easy</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">FEN Position</label>
                            <input type="text" required value={currentPuzzle.fen} onChange={(e) => setCurrentPuzzle({...currentPuzzle, fen: e.target.value})} placeholder="e.g. r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border font-mono" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Theme</label>
                                <input type="text" value={currentPuzzle.theme} onChange={(e) => setCurrentPuzzle({...currentPuzzle, theme: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Solution (JSON Array of moves)</label>
                                <input type="text" required value={currentPuzzle.solution} onChange={(e) => setCurrentPuzzle({...currentPuzzle, solution: e.target.value})} placeholder='["Nxe5"]' className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border font-mono" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hint</label>
                            <textarea value={currentPuzzle.hint} onChange={(e) => setCurrentPuzzle({...currentPuzzle, hint: e.target.value})} rows="2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"></textarea>
                        </div>

                        <div className="flex gap-6">
                            <div className="flex items-center">
                                <input type="checkbox" checked={currentPuzzle.is_weekly === 1} onChange={(e) => setCurrentPuzzle({...currentPuzzle, is_weekly: e.target.checked ? 1 : 0})} id="is_weekly" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <label htmlFor="is_weekly" className="ml-2 block text-sm text-gray-900 font-bold text-blue-700">Set as Puzzle of the Week</label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" checked={currentPuzzle.is_active === 1} onChange={(e) => setCurrentPuzzle({...currentPuzzle, is_active: e.target.checked ? 1 : 0})} id="is_active" className="h-4 w-4 text-green-600 border-gray-300 rounded" />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Active (Visible on Site)</label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-sm">Save Puzzle</button>
                            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded">Cancel</button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Theme</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FEN</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {puzzles.map((puzzle) => (
                                <tr key={puzzle.id} className={puzzle.is_weekly === 1 ? 'bg-blue-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{puzzle.title}</div>
                                        <div className="text-xs text-gray-500">{puzzle.theme}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            puzzle.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                                            puzzle.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {puzzle.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-xs font-mono text-gray-400 truncate max-w-xs" title={puzzle.fen}>{puzzle.fen}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            {puzzle.is_weekly === 1 && <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-black px-2 py-0.5 rounded-full w-fit">Weekly Featured</span>}
                                            <span className={`px-2 py-0.5 inline-flex text-[10px] leading-5 font-semibold rounded-full w-fit ${puzzle.is_active === 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {puzzle.is_active === 1 ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => { setIsEditing(true); setCurrentPuzzle(puzzle); }} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(puzzle.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {puzzles.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No puzzles found. Click "Add New Puzzle" to get started.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPuzzles;
