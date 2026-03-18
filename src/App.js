import React, { useState, useEffect } from 'react';

// Context and Global Components
import { CursorProvider } from './context/CursorContext';
import CustomCursor from './components/CustomCursor';
import Layout from './components/Layout';

// Import all the pages
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import AdmissionsPage from './pages/AdmissionsPage';
import BlogPage from './pages/BlogPage';
import CoachPage from './pages/CoachPage';
import ContactUsPage from './pages/ContactUsPage';
import CoursesPage from './pages/CoursesPage';
import OnlineCoursePage from './pages/OnlineCoursePage';
import TestimonialsPage from './pages/TestimonialsPage';
import SingleBlogPostPage from './pages/SingleBlogPostPage';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminResetPassword from './pages/admin/AdminResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLeads from './pages/admin/AdminLeads';
import AdminEnrolments from './pages/admin/AdminEnrolments';
import AdminCourses from './pages/admin/AdminCourses';
import AdminCoaches from './pages/admin/AdminCoaches';
import AdminBlog from './pages/admin/AdminBlog';
import AdminFAQ from './pages/admin/AdminFAQ';
import AdminGallery from './pages/admin/AdminGallery';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';

// --- THEME & STYLES ---
const StyleInjector = () => (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Merriweather:wght@400;700;900&display=swap');
        :root { 
            --primary-blue: #2962FF; 
            --accent-red: #FF3D00; 
            --dark-blue: #1A237E; 
            --light-bg: #F8F9FA; 
            --text-dark: #212529; 
            --text-light: #6c757d; 
            --white: #FFFFFF; 
            --success-green: #00C853;
        }
        body, html { 
            cursor: none; 
            font-family: 'Roboto', sans-serif; 
            background-color: var(--white); 
            scroll-behavior: smooth;
        }
        h1, h2, h3, h4, h5, h6 { 
            font-family: 'Merriweather', serif; 
        }
        .text-shadow-lg { text-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
        .hero-parallax { background-attachment: fixed; }
        .mask-image-lr { -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%); mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%); }
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-332px * 7)); } }
        .scrolling-wrapper { animation: scroll 40s linear infinite; will-change: transform; }
        @media (min-width: 768px) {
            @keyframes scroll-md { 0% { transform: translateX(0); } 100% { transform: translateX(calc(-432px * 7)); } }
            .scrolling-wrapper { animation-name: scroll-md; }
        }
    `}</style>
);

// Wrapper for the public site to maintain the old state-based routing behavior underneath
const PublicApp = () => {
    const [page, setPage] = useState('Home'); 

    useEffect(() => {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = 'https://i.postimg.cc/QKLnpVd3/favicon.png';
        document.head.appendChild(favicon);

        let chessboardCss = null;
        if (page === 'Blog') {
            chessboardCss = document.createElement('link');
            chessboardCss.rel = 'stylesheet';
            chessboardCss.href = 'https://unpkg.com/react-chessboard@4.3.0/dist/react-chessboard.css';
            document.head.appendChild(chessboardCss);
        }

        return () => { 
            if (document.head.contains(favicon)) {
                document.head.removeChild(favicon);
            }
            if (chessboardCss && document.head.contains(chessboardCss)) {
                document.head.removeChild(chessboardCss);
            }
        };
    }, [page]);

    const renderPage = () => {
        switch (page) {
            case 'Home': return <HomePage />;
            case 'About': return <AboutUsPage />;
            case 'Admissions': return <AdmissionsPage />;
            case 'Blog': return <BlogPage />;
            case 'Coaches': return <CoachPage />;
            case 'Contact': return <ContactUsPage />;
            case 'Courses': return <CoursesPage />;
            case 'Online Course': return <OnlineCoursePage />;
            case 'Testimonials': return <TestimonialsPage />;
            default: return <HomePage />;
        }
    };

    return (
        <Layout setPage={setPage} page={page}>
            {renderPage()}
        </Layout>
    );
};

// Protect admin routes
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <CursorProvider>
            <StyleInjector />
            <CustomCursor />
            <Router>
                <Routes>
                    {/* Admin Routes */}
                    <Route path="/login" element={<AdminLogin />} />
                    <Route path="/admin/reset-password" element={<AdminResetPassword />} />
                    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="leads" element={<AdminLeads />} />
                        <Route path="enrolments" element={<AdminEnrolments />} />
                        <Route path="courses" element={<AdminCourses />} />
                        <Route path="coaches" element={<AdminCoaches />} />
                        <Route path="blog" element={<AdminBlog />} />
                        <Route path="announcements" element={<AdminAnnouncements />} />
                        <Route path="faq" element={<AdminFAQ />} />
                        <Route path="gallery" element={<AdminGallery />} />
                        <Route path="testimonials" element={<AdminTestimonials />} />
                    </Route>
                    
                    {/* Public Single Blog Post Route */}
                    <Route path="/blog/:id" element={<SingleBlogPostPage />} />

                    {/* Public Site Catch-all (retains old state-based behavior) */}
                    <Route path="/*" element={<PublicApp />} />
                </Routes>
            </Router>
        </CursorProvider>
    );
}

export default App;
