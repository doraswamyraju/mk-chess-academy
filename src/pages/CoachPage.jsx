import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveArea from '../components/InteractiveArea';

const CoachPage = () => {
    const [coaches, setCoaches] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const { postToApi } = await import('../utils/api.js');
                const data = await postToApi('api_public.php', { action: 'get_public_content' });
                if (data.status === 'success') {
                    setCoaches(data.coaches || []);
                }
            } catch (err) {
                console.error("Failed to fetch coaches", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCoaches();
    }, []);

    return (
        <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            {/* Hero Banner */}
            <section style={{
                background: 'linear-gradient(135deg, #1A237E 0%, #2962FF 100%)',
                padding: '80px 24px',
                textAlign: 'center',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <p style={{ color: '#FF3D00', fontWeight: 700, letterSpacing: 3, fontSize: 12, textTransform: 'uppercase', marginBottom: 12 }}>OUR TEAM</p>
                    <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 16px', textShadow: '2px 2px 10px rgba(0,0,0,0.2)' }}>Meet Our Coaches</h1>
                    <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', maxWidth: 560, margin: '0 auto' }}>
                        Led by certified, internationally-rated chess professionals dedicated to unlocking your full potential.
                    </p>
                </div>
            </section>

            {/* Coaches Grid */}
            <section style={{ padding: '72px 24px', maxWidth: 1100, margin: '0 auto' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <div style={{ width: 56, height: 56, border: '4px solid #1A237E', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : coaches.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px' }}>
                        <div style={{ fontSize: 64, marginBottom: 20 }}>♟</div>
                        <h2 style={{ color: '#1A237E', fontSize: 28, fontWeight: 800 }}>Coming Soon</h2>
                        <p style={{ color: '#6c757d', marginTop: 8, fontSize: 16 }}>Our instructor profiles are being prepared.</p>
                        <p style={{ marginTop: 16, color: '#f59e0b', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 20px', display: 'inline-block', fontSize: 14 }}>
                            ⚠️ If coaches were added in admin, make sure to set their status to <strong>Active</strong>.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 32 }}>
                        {coaches.map(coach => (
                            <InteractiveArea key={coach.id} onHoverType="queen" className="w-full h-full">
                                <div
                                    onClick={() => navigate(`/coaches/${coach.id}`)}
                                    style={{
                                        background: '#fff',
                                        borderRadius: 16,
                                        boxShadow: '0 6px 30px rgba(0,0,0,0.08)',
                                        padding: '36px 28px',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        borderBottom: '4px solid #2962FF',
                                        height: '100%',
                                        boxSizing: 'border-box'
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.15)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(0,0,0,0.08)'; }}
                                >
                                    {coach.image_url ? (
                                        <img
                                            src={coach.image_url}
                                            alt={coach.name}
                                            style={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', marginBottom: 20, border: '5px solid #e8edf8', display: 'block' }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: 140, height: 140, borderRadius: '50%', marginBottom: 20,
                                            background: 'linear-gradient(135deg, #1A237E, #2962FF)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 56, fontWeight: 900, color: '#fff', border: '5px solid #e8edf8'
                                        }}>
                                            {coach.name.charAt(0)}
                                        </div>
                                    )}
                                    <h2 style={{ color: '#1A237E', fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{coach.name}</h2>
                                    <p style={{ color: '#2962FF', fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{coach.role}</p>
                                    <p style={{
                                        color: '#555', fontSize: 14, lineHeight: 1.6, marginBottom: 20,
                                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                    }}>
                                        {coach.bio}
                                    </p>
                                    {/* Achievement badges */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
                                        {(coach.achievements || '').split(',').slice(0, 3).map((a, i) => a.trim() && (
                                            <span key={i} style={{ background: '#eff6ff', color: '#2962FF', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                                                {a.trim()}
                                            </span>
                                        ))}
                                    </div>
                                    <button style={{
                                        marginTop: 'auto',
                                        background: '#2962FF', color: '#fff',
                                        border: 'none', borderRadius: 30,
                                        padding: '10px 28px', fontWeight: 700, fontSize: 14,
                                        cursor: 'pointer', transition: 'background 0.2s'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#1A237E'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#2962FF'}
                                    >
                                        View Full Profile →
                                    </button>
                                </div>
                            </InteractiveArea>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default CoachPage;
