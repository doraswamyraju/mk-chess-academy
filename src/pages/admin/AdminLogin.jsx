import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveArea from '../../components/InteractiveArea';
import { postToApi } from '../../utils/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const navigate = useNavigate();

    // Ensure favicon is present on the login screen, and update document title
    useEffect(() => {
        document.title = isForgotPassword ? "Forgot Password | Modern Knight Chess Academy" : "Admin Login | Modern Knight Chess Academy";
        let favicon = document.querySelector("link[rel~='icon']");
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.href = 'https://i.postimg.cc/QKLnpVd3/favicon.png';
    }, [isForgotPassword]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const data = await postToApi('api_admin_dashboard.php', {
                action: 'login',
                email,
                password
            });

            if (data.status === 'success') {
                localStorage.setItem('adminToken', data.token); // Store simple token
                navigate('/admin');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Error connecting to server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const data = await postToApi('api_admin_dashboard.php', {
                action: 'forgot_password',
                email
            });

            if (data.status === 'success') {
                setMessage('A password reset link has been sent to your email address.');
            } else {
                setError(data.message || 'Error processing request.');
            }
        } catch (err) {
            setError('Error connecting to server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--dark-blue)]">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
            
            <InteractiveArea onHoverType="knight" className="max-w-md w-full relative z-10 px-4 sm:px-0">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 rounded-2xl shadow-2xl transition-all duration-500">
                    
                    <div className="flex flex-col items-center mb-8">
                        <img 
                            src="https://i.postimg.cc/MMfFM1x5/logo.png" 
                            alt="Modern Knight Chess Academy Logo" 
                            className="h-20 object-contain mb-4 drop-shadow-lg bg-white/50 backdrop-blur-sm p-2 rounded-xl"
                        />
                        <h2 className="text-center text-3xl font-extrabold text-white tracking-tight">
                            {isForgotPassword ? "Reset Password" : "Admin Portal"}
                        </h2>
                        <p className="mt-2 text-center text-sm text-blue-200">
                            {isForgotPassword ? "Enter your email to receive a secure reset link" : "Secure access to MKCA Dashboard"}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={isForgotPassword ? handleForgotPassword : handleLogin}>
                        {error && (
                            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 mb-4 transform transition-all">
                                <p className="text-sm text-red-100 font-medium text-center">{error}</p>
                            </div>
                        )}
                        {message && (
                            <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/50 rounded-lg p-4 mb-4 transform transition-all">
                                <p className="text-sm text-green-100 font-medium text-center">{message}</p>
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="sr-only">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-4 bg-white/10 border border-white/20 placeholder-blue-200 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bb2649] focus:border-transparent transition-all sm:text-sm shadow-inner"
                                    placeholder="Admin Email Address"
                                />
                            </div>
                            {!isForgotPassword && (
                                <div>
                                    <label htmlFor="password" className="sr-only">Password</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full px-4 py-4 bg-white/10 border border-white/20 placeholder-blue-200 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bb2649] focus:border-transparent transition-all sm:text-sm shadow-inner"
                                        placeholder="Password"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#bb2649] to-red-600 hover:from-red-600 hover:to-[#bb2649] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--dark-blue)] focus:ring-[#bb2649] transition-all duration-300 shadow-lg transform hover:-translate-y-1 overflow-hidden"
                            >
                                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>{isForgotPassword ? "Sending..." : "Authenticating..."}</span>
                                    </div>
                                ) : (isForgotPassword ? "Send Reset Link" : "Sign In Securely")}
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-6 flex flex-col space-y-4 text-center">
                        <button 
                            type="button"
                            onClick={() => { setIsForgotPassword(!isForgotPassword); setError(''); setMessage(''); }}
                            className="text-sm font-medium text-blue-200 hover:text-white transition-colors"
                        >
                            {isForgotPassword ? "Remembered your password? Login" : "Forgot Password?"}
                        </button>
                        <a href="/" className="text-sm font-medium text-blue-400 hover:text-white transition-colors flex items-center justify-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                            <span>Back to website</span>
                        </a>
                    </div>
                </div>
            </InteractiveArea>
        </div>
    );
};

export default AdminLogin;
