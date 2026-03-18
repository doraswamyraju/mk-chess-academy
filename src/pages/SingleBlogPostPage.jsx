import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postToApi } from '../utils/api';
import InteractiveArea from '../components/InteractiveArea';

const SingleBlogPostPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postId = parseInt(id, 10);
                const data = await postToApi('api_public.php', { action: 'get_blog_post', id: postId });
                if (data.status === 'success') {
                    setPost(data.post);
                    document.title = `${data.post.title} | MKCA Blog`;
                } else {
                    setError(data.message || 'Post not found');
                }
            } catch (err) {
                setError('Failed to load the blog post.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#1e3a8a]"></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
                <h1 className="text-4xl font-bold text-[#1e3a8a] mb-4">Oops!</h1>
                <p className="text-xl text-gray-600 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
                <InteractiveArea>
                    <button onClick={() => navigate('/')} className="bg-[#bb2649] text-white px-8 py-3 rounded-md font-bold hover:bg-opacity-90 transition-colors">
                        Return to Homepage
                    </button>
                </InteractiveArea>
            </div>
        );
    }

    return (
        <main className="bg-gray-50 min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                
                <InteractiveArea className="w-fit mb-8">
                    <button onClick={() => navigate('/')} className="flex items-center text-[#1e3a8a] font-semibold hover:text-[#bb2649] transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Back to Academy
                    </button>
                </InteractiveArea>

                <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {post.image_url ? (
                        <div className="w-full h-[400px] sm:h-[500px] relative">
                            <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6 text-white">
                                <span className="bg-[#bb2649] px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm">
                                    {post.category}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-32 bg-gradient-to-r from-[#1e3a8a] to-[#2962FF] flex border-b items-end p-6">
                            <span className="bg-[#bb2649] text-white px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm">
                                {post.category}
                            </span>
                        </div>
                    )}
                    
                    <div className="p-8 sm:p-12">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1e3a8a] leading-tight mb-4">
                            {post.title}
                        </h1>
                        <p className="text-gray-500 text-sm mb-12 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            Published on {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        
                        <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>
                </article>

            </div>
        </main>
    );
};

export default SingleBlogPostPage;
