import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InteractiveArea from '../../components/InteractiveArea';
import { postToApi } from '../../utils/api';

const AdminResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extract token from URL query params (e.g. ?token=abc)
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        document.title = "Set New Password | Modern Knight Chess Academy";
        if (!token) {
            setError("Invalid or missing reset token.");
        }
    }, [token]);

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsLoading(true);

        try {
            const data = await postToApi('api_admin_dashboard.php', {
                action: 'reset_password',
                token,
                password
            });

            if (data.status === 'success') {
                setMessage('Your password has been successfully reset! Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || 'Failed to reset password.');
            }
        } catch (err) {
            setError('Error connecting to server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--dark-blue)]">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <InteractiveArea onHoverType="knight" className="max-w-md w-full relative z-10 px-4 sm:px-0">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-2xl shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <img 
                            src="https://i.postimg.cc/MMfFM1x5/logo.png" 
                            alt="Modern Knight Chess Academy Logo" 
                            className="h-20 object-contain mb-4 drop-shadow-lg bg-white/50 backdrop-blur-sm p-2 rounded-xl"
                        />
                        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
                            Create New Password
                        </h2>
                    </div>

                    {!token ? (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4 text-center">
                            <p className="text-sm text-red-100 font-medium">Invalid or missing reset token. Please check your email link again.</p>
                            <button onClick={() => navigate('/login')} className="mt-4 text-blue-200 hover:text-white underline">Back to Login</button>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleReset}>
                            {error && (
                                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-red-100 font-medium text-center">{error}</p>
                                </div>
                            )}
                            {message && (
                                <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-green-100 font-medium text-center">{message}</p>
                                </div>
                            )}
                            
                            <div className="space-y-4">
                                <div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full px-4 py-4 bg-white/10 border border-white/20 placeholder-blue-200 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bb2649] transition-all"
                                        placeholder="New Password"
                                        minLength="6"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full px-4 py-4 bg-white/10 border border-white/20 placeholder-blue-200 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bb2649] transition-all"
                                        placeholder="Confirm New Password"
                                        minLength="6"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !!message}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#bb2649] to-red-600 hover:from-red-600 focus:outline-none disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </InteractiveArea>
        </div>
    );
};

export default AdminResetPassword;
