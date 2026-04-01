import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InteractiveArea from '../components/InteractiveArea';

const CoachProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [coach, setCoach] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoach = async () => {
            try {
                const { postToApi } = await import('../utils/api.js');
                const data = await postToApi('api_public.php', { action: 'get_public_content' });
                if (data.status === 'success') {
                    const found = (data.coaches || []).find(c => String(c.id) === String(id));
                    setCoach(found || null);
                }
            } catch (err) {
                console.error('Failed to fetch coach', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCoach();
    }, [id]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
                <div style={{ width: 64, height: 64, border: '4px solid #1A237E', borderTop: '4px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!coach) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', textAlign: 'center', padding: 24 }}>
                <h1 style={{ fontSize: 36, fontWeight: 900, color: '#1A237E', marginBottom: 16 }}>Coach Not Found</h1>
                <p style={{ color: '#6c757d', marginBottom: 32 }}>This coach profile doesn't exist or is not yet active.</p>
                <button onClick={() => navigate('/')} style={{ background: '#FF3D00', color: '#fff', fontWeight: 700, padding: '12px 32px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 16 }}>
                    ← Back to Home
                </button>
            </div>
        );
    }

    const achievements = (coach.achievements || '').split(',').map(a => a.trim()).filter(Boolean);
    const bio = coach.bio || '';

    return (
        <main style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #1A237E 0%, #2962FF 100%)',
                color: '#fff',
                padding: '80px 24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
                        {coach.image_url ? (
                            <img
                                src={coach.image_url}
                                alt={coach.name}
                                style={{ width: 200, height: 200, borderRadius: '50%', objectFit: 'cover', border: '6px solid rgba(255,255,255,0.4)', display: 'block', margin: '0 auto' }}
                            />
                        ) : (
                            <div style={{ width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, fontWeight: 900, border: '6px solid rgba(255,255,255,0.4)', margin: '0 auto' }}>
                                {coach.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div style={{ flex: 1, minWidth: 260 }}>
                        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 20, cursor: 'pointer', marginBottom: 20, fontSize: 14, fontWeight: 600 }}>
                            ← Back
                        </button>
                        <h1 style={{ fontSize: 48, fontWeight: 900, margin: 0, textShadow: '1px 2px 8px rgba(0,0,0,0.2)' }}>{coach.name}</h1>
                        <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', margin: '8px 0 20px', fontWeight: 600 }}>{coach.role}</p>
                        {achievements.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {achievements.slice(0, 4).map((a, i) => (
                                    <span key={i} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                                        🏆 {a}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Bio Section */}
            {bio && (
                <section style={{ padding: '60px 24px', background: '#fff' }}>
                    <div style={{ maxWidth: 800, margin: '0 auto' }}>
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1A237E', marginBottom: 20 }}>About</h2>
                        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#444', whiteSpace: 'pre-wrap' }}>{bio}</p>
                    </div>
                </section>
            )}

            {/* Achievements Section */}
            {achievements.length > 0 && (
                <section style={{ padding: '60px 24px', background: '#f8f9fa' }}>
                    <div style={{ maxWidth: 900, margin: '0 auto' }}>
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1A237E', marginBottom: 32, textAlign: 'center' }}>Achievements & Titles</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                            {achievements.map((ach, i) => (
                                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 14, borderLeft: '4px solid #2962FF' }}>
                                    <span style={{ fontSize: 28 }}>🥇</span>
                                    <span style={{ fontWeight: 600, color: '#1A237E', fontSize: 15 }}>{ach}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section style={{ padding: '60px 24px', background: 'linear-gradient(135deg, #1A237E 0%, #2962FF 100%)', textAlign: 'center' }}>
                <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Ready to Train with {coach.name}?</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 32 }}>Book a free demo session and start your chess journey today.</p>
                <InteractiveArea>
                    <button
                        onClick={() => navigate('/')}
                        style={{ background: '#FF3D00', color: '#fff', fontWeight: 800, fontSize: 18, padding: '16px 48px', borderRadius: 10, border: 'none', cursor: 'pointer', transform: 'scale(1)', transition: 'transform 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Request a Free Demo →
                    </button>
                </InteractiveArea>
            </section>
        </main>
    );
};

export default CoachProfilePage;
