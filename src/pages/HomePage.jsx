import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveArea from '../components/InteractiveArea';
import Section from '../components/Section';
import InteractivePuzzleDisplay from '../components/InteractivePuzzleDisplay';

// --- PAGE-SPECIFIC ICONS ---
const StarIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const QuoteIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>);
const ChevronLeftIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRightIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>);
const CheckIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"></polyline></svg>);


// --- ENROLLMENT MODAL ---
const EnrollmentModal = ({ course, onClose }) => {
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = {
                action: 'submit_enrolment',
                student_name: e.target.student_name.value,
                parent_email: e.target.parent_email.value,
                phone: e.target.phone.value,
                course_name: course,
                student_type: e.target.student_type.value,
                country_timezone: e.target.country_timezone?.value || ''
            };
            const { postToApi } = await import('../utils/api.js');
            await postToApi('api_client_forms.php', formData);
            setSuccess(true);
            setTimeout(() => { onClose(); setSuccess(false); }, 2500);
        } catch (err) {
            alert('Error submitting: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: 20, backdropFilter: 'blur(4px)'
        }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{
                background: '#fff', borderRadius: 16, padding: '40px 36px',
                maxWidth: 480, width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                position: 'relative', animation: 'modalPop 0.25s ease'
            }}>
                <style>{`@keyframes modalPop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 16, right: 16, background: '#f1f3f5',
                    border: 'none', borderRadius: '50%', width: 32, height: 32,
                    cursor: 'pointer', fontSize: 18, lineHeight: '32px', textAlign: 'center', color: '#555'
                }}>×</button>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                        <h3 style={{ color: '#00C853', fontSize: 24, fontWeight: 800 }}>Enrollment Submitted!</h3>
                        <p style={{ color: '#555', marginTop: 8 }}>We'll contact you shortly to confirm your spot.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: 24 }}>
                            <p style={{ color: '#FF3D00', fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Enroll Now</p>
                            <h2 style={{ color: '#1A237E', fontSize: 22, fontWeight: 800, marginTop: 4 }}>{course}</h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <input
                                name="student_name" required placeholder="Student's Full Name"
                                style={inputStyle}
                            />
                            <input
                                name="parent_email" type="email" required placeholder="Parent's Email"
                                style={inputStyle}
                            />
                            <input
                                name="phone" type="tel" required placeholder="Phone Number (WhatsApp preferred)"
                                style={inputStyle}
                            />
                            <input
                                name="course_name" value={course} readOnly
                                style={{ ...inputStyle, background: '#f4f6ff', color: '#2962FF', fontWeight: 700 }}
                            />
                            <select name="student_type" required style={inputStyle}>
                                <option value="">Student Type</option>
                                <option value="indian">Indian Student</option>
                                <option value="international">International Student</option>
                            </select>
                            <input
                                name="country_timezone" placeholder="Country / Timezone (optional)"
                                style={inputStyle}
                            />
                            <button type="submit" disabled={submitting} style={{
                                background: submitting ? '#aaa' : 'linear-gradient(135deg, #FF3D00, #ff6b3d)',
                                color: '#fff', fontWeight: 800, fontSize: 16,
                                padding: '14px', borderRadius: 10, border: 'none',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                marginTop: 8, transition: 'transform 0.2s'
                            }}>
                                {submitting ? 'Submitting...' : '🚀 Submit Enrollment'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 15,
    border: '1.5px solid #e0e0e0', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Roboto, sans-serif', transition: 'border-color 0.2s'
};


// --- HOMEPAGE SECTION COMPONENTS ---

const sliderData = [
    { image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop', title: 'Become a Chess Champion', subtitle: 'Train with International Rated Players at Modern Knight Chess Academy.' },
    { image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2070&auto=format&fit=crop', title: 'Unlock Your Potential', subtitle: 'Comprehensive coaching for all ages and skill levels.' },
    { image: 'https://images.unsplash.com/photo-1610623378544-85234b115e5b?q=80&w=1974&auto=format&fit=crop', title: 'Join a Winning Community', subtitle: 'Learn, compete, and grow with fellow chess enthusiasts.' },
    { image: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2070&auto=format&fit=crop', title: 'Your First Move to Mastery', subtitle: 'Start your journey with a free demo class today.' },
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const nextSlide = () => setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[85vh] text-white flex items-center justify-center overflow-hidden">
            {sliderData.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundImage: `url('${slide.image}')` }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <div key={currentSlide} className="animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 leading-tight text-shadow-lg">
                            {sliderData[currentSlide].title}
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl mb-8 text-gray-200">
                            {sliderData[currentSlide].subtitle}
                        </p>
                    </div>
                </div>

                {/* Contact Form with Phone */}
                <div className="w-full max-w-md mx-auto md:mx-0">
                    <InteractiveArea className="w-full">
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const submitBtn = e.target.querySelector('button[type="submit"]');
                            const originalText = submitBtn.innerText;
                            try {
                                submitBtn.innerText = 'Sending...';
                                submitBtn.disabled = true;
                                setSubmitting(true);
                                const data = {
                                    action: 'submit_lead',
                                    name: e.target.name.value,
                                    email: e.target.email.value,
                                    phone: e.target.phone.value,
                                    message: e.target.message.value
                                };
                                const { postToApi } = await import('../utils/api.js');
                                await postToApi('api_client_forms.php', data);
                                alert('Thank you! Your inquiry has been sent.');
                                e.target.reset();
                            } catch (err) {
                                alert('Error sending inquiry: ' + err.message);
                            } finally {
                                submitBtn.innerText = originalText;
                                submitBtn.disabled = false;
                                setSubmitting(false);
                            }
                        }} className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-2xl space-y-4 border border-white/20">
                            <h3 className="text-2xl font-bold text-white text-center mb-4">Request a Free Demo</h3>
                            <div>
                                <label htmlFor="hero-name" className="sr-only">Name</label>
                                <input type="text" id="hero-name" name="name" required placeholder="Your Name" className="w-full p-3 rounded-md border-0 bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[var(--accent-red)] outline-none" />
                            </div>
                            <div>
                                <label htmlFor="hero-email" className="sr-only">Email</label>
                                <input type="email" id="hero-email" name="email" required placeholder="Your Email" className="w-full p-3 rounded-md border-0 bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[var(--accent-red)] outline-none" />
                            </div>
                            <div>
                                <label htmlFor="hero-phone" className="sr-only">Phone</label>
                                <input type="tel" id="hero-phone" name="phone" required placeholder="Your Phone Number" className="w-full p-3 rounded-md border-0 bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[var(--accent-red)] outline-none" />
                            </div>
                            <div>
                                <label htmlFor="hero-message" className="sr-only">Message</label>
                                <textarea id="hero-message" name="message" placeholder="Your Message (Optional)" rows="2" className="w-full p-3 rounded-md border-0 bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[var(--accent-red)] outline-none"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-[var(--accent-red)] text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-transform hover:scale-105">Send Inquiry</button>
                        </form>
                    </InteractiveArea>
                </div>
            </div>

            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><ChevronLeftIcon /></button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><ChevronRightIcon /></button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
                {sliderData.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`}
                        aria-label={`Go to slide ${index + 1}`} />
                ))}
            </div>
        </section>
    );
};


// --- COACHES SECTION (clickable cards) ---
const InstituteSnapshot = ({ coaches }) => {
    const navigate = useNavigate();
    return (
        <Section bgColor="var(--white)" divider="slant" dividerColor="var(--light-bg)">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[var(--dark-blue)]">Meet Our Master Instructors</h2>
                <p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">Led by a team of certified and decorated chess professionals dedicated to elevating your game.</p>
            </div>
            <div className="flex flex-wrap -mx-4 justify-center items-stretch gap-y-8">
                {coaches && coaches.length > 0 ? coaches.map(coach => (
                    <div key={coach.id} className="w-full md:w-1/2 lg:w-1/3 px-4">
                        <InteractiveArea onHoverType="queen" className="w-full h-full">
                            <div
                                onClick={() => navigate(`/coaches/${coach.id}`)}
                                className="bg-gray-50 rounded-xl shadow-lg p-8 text-center h-full border-b-4 border-[var(--primary-blue)] flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                            >
                                {coach.image_url ? (
                                    <img src={coach.image_url} alt={coach.name} className="w-36 h-36 rounded-full mx-auto mb-4 ring-4 ring-[var(--primary-blue)] p-1 object-cover" />
                                ) : (
                                    <div className="w-36 h-36 rounded-full mx-auto mb-4 ring-4 ring-[var(--primary-blue)] p-1 bg-[var(--dark-blue)] flex items-center justify-center text-white font-black text-4xl">{coach.name.charAt(0)}</div>
                                )}
                                <h3 className="text-2xl font-bold text-[var(--dark-blue)] font-sans">{coach.name}</h3>
                                <p className="font-bold text-lg text-[var(--primary-blue)]">{coach.role}</p>
                                <p className="text-sm text-gray-600 mt-2 mb-4 line-clamp-3">{coach.bio}</p>
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    {(coach.achievements || '').split(',').map((feat, i) => feat.trim() && (
                                        <span key={i} className="bg-blue-100 text-[var(--primary-blue)] text-xs font-semibold px-3 py-1 rounded-full">{feat.trim()}</span>
                                    ))}
                                </div>
                                <button className="mt-6 bg-[var(--primary-blue)] text-white text-sm font-bold py-2 px-5 rounded-full hover:bg-opacity-90 transition-colors">
                                    View Full Profile →
                                </button>
                            </div>
                        </InteractiveArea>
                    </div>
                )) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-3">Instructor profiles coming soon.</p>
                        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 inline-block">
                            ⚠️ If you've added a coach in the admin panel, make sure to set their status to <strong>Active</strong> (not Hidden).
                        </p>
                    </div>
                )}
            </div>
        </Section>
    );
};


// --- PREMIUM DARK COURSES SECTION ---
const courseIcons = ['♟', '⚡', '♛'];
const courseAccents = ['#c9a84c', '#c9a84c', '#c9a84c'];

const CoursesSection = ({ courses }) => {
    const [enrollModal, setEnrollModal] = useState(null);

    return (
        <>
            {enrollModal && <EnrollmentModal course={enrollModal} onClose={() => setEnrollModal(null)} />}
            <section style={{ background: '#111827', padding: '80px 0', position: 'relative' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 60 }}>
                        <p style={{ color: '#c9a84c', fontWeight: 700, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>OUR PROGRAMS</p>
                        <h2 style={{ color: '#fff', fontSize: 48, fontWeight: 900, margin: 0, lineHeight: 1.1 }}>
                            Structured for <span style={{ color: '#c9a84c' }}>Every Level</span>
                        </h2>
                        <p style={{ color: '#9ca3af', fontSize: 18, marginTop: 16, maxWidth: 600, margin: '16px auto 0' }}>
                            Age-appropriate programs designed to challenge and inspire — from first-time players to future champions.
                        </p>
                    </div>

                    {/* Course Cards */}
                    {courses && courses.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 28, alignItems: 'stretch' }}>
                            {courses.map((course, idx) => {
                                const isMiddle = courses.length >= 3 && idx === Math.floor(courses.length / 2);
                                const features = (course.features || '').split(',').map(f => f.trim()).filter(Boolean);
                                return (
                                    <div key={course.id} style={{
                                        background: isMiddle ? '#1f2937' : '#1a2032',
                                        border: isMiddle ? '2px solid #c9a84c' : '1px solid #2d3748',
                                        borderRadius: 20,
                                        padding: '36px 28px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        boxShadow: isMiddle ? '0 20px 60px rgba(201,168,76,0.2)' : 'none',
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.4)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isMiddle ? '0 20px 60px rgba(201,168,76,0.2)' : 'none'; }}
                                    >
                                        {isMiddle && (
                                            <div style={{
                                                position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                                                background: '#c9a84c', color: '#111', fontWeight: 800, fontSize: 12,
                                                padding: '4px 18px', borderRadius: 20, letterSpacing: 1, whiteSpace: 'nowrap'
                                            }}>
                                                MOST POPULAR
                                            </div>
                                        )}
                                        {/* Icon */}
                                        <div style={{
                                            width: 52, height: 52, borderRadius: 14, background: 'rgba(201,168,76,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 26, marginBottom: 20, border: '1px solid rgba(201,168,76,0.3)'
                                        }}>
                                            {courseIcons[idx % courseIcons.length]}
                                        </div>
                                        <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{course.title}</h3>
                                        <p style={{ color: '#c9a84c', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{course.level}</p>
                                        {/* Features */}
                                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {features.map((feat, i) => (
                                                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: '#d1d5db', fontSize: 14 }}>
                                                    <span style={{ color: '#c9a84c', marginTop: 1, flexShrink: 0 }}>✓</span>
                                                    <span>{feat}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {/* CTA */}
                                        <button
                                            onClick={() => setEnrollModal(course.title)}
                                            style={{
                                                marginTop: 32,
                                                background: isMiddle ? '#c9a84c' : 'transparent',
                                                color: isMiddle ? '#111' : '#fff',
                                                border: isMiddle ? 'none' : '1.5px solid #4b5563',
                                                fontWeight: 800, fontSize: 15,
                                                padding: '14px', borderRadius: 12, cursor: 'pointer',
                                                transition: 'all 0.2s', width: '100%'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#c9a84c'; e.currentTarget.style.color = '#111'; e.currentTarget.style.border = 'none'; }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = isMiddle ? '#c9a84c' : 'transparent';
                                                e.currentTarget.style.color = isMiddle ? '#111' : '#fff';
                                                e.currentTarget.style.border = isMiddle ? 'none' : '1.5px solid #4b5563';
                                            }}
                                        >
                                            Get Started
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
                            {/* Fallback placeholder cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px,1fr))', gap: 28 }}>
                                {[
                                    { title: 'Little Knights', level: 'Ages 5–7', features: ['Interactive lessons', 'Fun puzzles & stories', '1-on-1 or small groups', 'Weekly progress reports'] },
                                    { title: 'Rising Stars', level: 'Ages 8–12', features: ['Rated tournament prep', 'Advanced tactics training', 'Game analysis sessions', 'Monthly mock tournaments'], popular: true },
                                    { title: 'Elite Champions', level: 'Ages 10–15', features: ['1-on-1 master coaching', 'Custom opening repertoire', 'State & national prep', 'Performance analytics'] }
                                ].map((c, idx) => (
                                    <div key={idx} style={{
                                        background: c.popular ? '#1f2937' : '#1a2032',
                                        border: c.popular ? '2px solid #c9a84c' : '1px solid #2d3748',
                                        borderRadius: 20, padding: '36px 28px', position: 'relative',
                                        display: 'flex', flexDirection: 'column',
                                        boxShadow: c.popular ? '0 20px 60px rgba(201,168,76,0.2)' : 'none'
                                    }}>
                                        {c.popular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#c9a84c', color: '#111', fontWeight: 800, fontSize: 12, padding: '4px 18px', borderRadius: 20, whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                                        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(201,168,76,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 20, border: '1px solid rgba(201,168,76,0.3)' }}>{courseIcons[idx]}</div>
                                        <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 6px' }}>{c.title}</h3>
                                        <p style={{ color: '#c9a84c', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{c.level}</p>
                                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                            {c.features.map((f, i) => <li key={i} style={{ display: 'flex', gap: 10, color: '#d1d5db', fontSize: 14 }}><span style={{ color: '#c9a84c' }}>✓</span>{f}</li>)}
                                        </ul>
                                        <button onClick={() => setEnrollModal(c.title)} style={{ marginTop: 32, background: c.popular ? '#c9a84c' : 'transparent', color: c.popular ? '#111' : '#fff', border: c.popular ? 'none' : '1.5px solid #4b5563', fontWeight: 800, fontSize: 15, padding: 14, borderRadius: 12, cursor: 'pointer', width: '100%' }}>
                                            Get Started
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};


const GallerySection = ({ announcements, images }) => {
    const displayImages = images.length > 0 ? images : [];

    return (
        <Section bgColor="var(--white)" divider="slant" dividerColor="var(--light-bg)">
            <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">Glimpses of Glory</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">A snapshot of our students' proudest moments and victories.</p></div>

            {announcements && announcements.length > 0 && (
                <div className="max-w-4xl mx-auto mb-12">
                    <InteractiveArea className="w-full">
                        <a href={announcements[0].link || "#"} target={announcements[0].link ? "_blank" : "_self"} rel="noreferrer" className="block w-full bg-gradient-to-r from-[var(--dark-blue)] to-[var(--primary-blue)] rounded-xl shadow-2xl p-8 relative overflow-hidden group transform transition duration-500 hover:scale-[1.02]">
                            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-700 ease-in-out"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                                <div>
                                    <h3 className="text-sm font-bold tracking-wider text-[var(--accent-red)] uppercase mb-2">📢 Featured Announcement</h3>
                                    <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed">{announcements[0].message}</p>
                                </div>
                            </div>
                        </a>
                    </InteractiveArea>
                </div>
            )}

            {displayImages.length > 0 ? (
                <div className="relative w-full overflow-hidden mask-image-lr">
                    <div className="flex scrolling-wrapper">
                        {[...displayImages, ...displayImages].map((img, index) => (
                            <div key={`${img.id}-${index}`} className="flex-shrink-0 w-[300px] md:w-[400px] mx-4 relative group">
                                <img src={img.image_url} className="w-full h-64 object-cover rounded-lg shadow-xl" alt={img.title} />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="text-center p-4">
                                        <h4 className="text-white font-bold text-xl">{img.title}</h4>
                                        {img.description && <p className="text-gray-200 mt-2 text-sm">{img.description}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">No gallery images available yet.</div>
            )}
        </Section>
    );
};

const StarRating = ({ rating }) => (<div className="flex justify-center mb-4">{[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-6 h-6 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}</div>);

const googleReviews = [
    { name: "Rahul S.", rating: 5, text: "Excellent coaching! My son improved his game drastically within 3 months." },
    { name: "Priya M.", rating: 5, text: "The coaches are highly professional and patient. The environment is perfect for learning." },
    { name: "Anita Rao", rating: 5, text: "MK Chess Academy is the best in the region. Their structured curriculum really helps." },
    { name: "Vikram K.", rating: 5, text: "Great online classes and flexible timings. Highly recommended for aspiring players!" }
];

const GoogleReviews = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">What Our Students Say</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">Direct feedback from our students and parents on Google.</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {googleReviews.map((review, index) => (
                <InteractiveArea key={index} className="w-full h-full">
                    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col text-center transform hover:-translate-y-2 transition-transform duration-300">
                        <QuoteIcon className="w-8 h-8 mx-auto mb-4 text-gray-200" />
                        <p className="text-[var(--text-light)] italic flex-grow">"{review.text}"</p>
                        <div className="mt-6">
                            <StarRating rating={review.rating} />
                            <p className="font-bold text-[var(--primary-blue)]">- {review.name}</p>
                        </div>
                    </div>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const TestimonialsSection = ({ testimonials }) => (
    <Section bgColor="var(--white)" divider="slant" dividerColor="var(--light-bg)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">A Champion's Journey</h2></div>
        {testimonials.length === 0 ? (
            <div className="text-center text-gray-500 py-8">More champions coming soon...</div>
        ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {testimonials.map(item => (
                    <InteractiveArea key={item.id} onHoverType="queen" className="w-full">
                        <div className="bg-[var(--dark-blue)] text-white rounded-lg shadow-2xl p-8 flex flex-col h-full transform transition duration-300 hover:scale-[1.02]">
                            <div className="flex items-center gap-6 mb-6">
                                {item.avatar_url ? (
                                    <img src={item.avatar_url} alt={item.student_name} className="w-20 h-20 rounded-full flex-shrink-0 ring-4 ring-[var(--accent-red)] p-1 object-cover" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full flex-shrink-0 ring-4 ring-[var(--accent-red)] p-1 bg-white text-[var(--dark-blue)] flex items-center justify-center font-bold text-2xl">
                                        {item.student_name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-bold text-xl text-white">{item.student_name}</h4>
                                    <span className="text-sm text-gray-300">{item.course_taken}</span>
                                    <div className="mt-2 text-yellow-400 text-sm">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</div>
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-lg italic text-gray-300 leading-relaxed relative">
                                    <span className="text-4xl text-[var(--accent-red)] absolute -left-4 -top-4 opacity-50">"</span>
                                    {item.review_text}
                                    <span className="text-4xl text-[var(--accent-red)] absolute -bottom-8 opacity-50">"</span>
                                </p>
                            </div>
                        </div>
                    </InteractiveArea>
                ))}
            </div>
        )}
    </Section>
);

const ContactSection = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">Get In Touch</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">Have questions? We'd love to hear from you. Reach out and start your chess journey today.</p></div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-xl">
            <div>
                <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-4">Contact Information</h3>
                <p className="text-[var(--text-light)] mb-6">Fill out the form, or use the details below to contact us directly.</p>
                <div className="space-y-4 text-[var(--text-dark)]">
                    <p><strong>Address:</strong> Manasa Hospital Rd, opposite to Coastal Bommireddy Srinivas Hospital, Danavai Peta, Rajamahendravaram, AP 533103</p>
                    <p><strong>Phone:</strong> +91-6281250967, +91-9885302468</p>
                    <p><strong>Email:</strong> modernknightchessacademy@gmail.com</p>
                </div>
            </div>
            <form onSubmit={async (e) => {
                e.preventDefault();
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerText;
                try {
                    submitBtn.innerText = 'Sending...';
                    submitBtn.disabled = true;
                    const data = {
                        action: 'submit_lead',
                        name: e.target.name.value,
                        email: e.target.email.value,
                        phone: e.target.phone.value,
                        message: e.target.message.value
                    };
                    const { postToApi } = await import('../utils/api.js');
                    await postToApi('api_client_forms.php', data);
                    alert('Thank you! Your message has been sent.');
                    e.target.reset();
                } catch (err) {
                    alert('Error sending message: ' + err.message);
                } finally {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }
            }} className="space-y-4">
                <InteractiveArea className="w-full"><input type="text" name="name" required placeholder="Your Name" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none" /></InteractiveArea>
                <InteractiveArea className="w-full"><input type="email" name="email" required placeholder="Your Email" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none" /></InteractiveArea>
                <InteractiveArea className="w-full"><input type="tel" name="phone" required placeholder="Your Phone Number" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none" /></InteractiveArea>
                <InteractiveArea className="w-full"><textarea name="message" required placeholder="Your Message" rows="4" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"></textarea></InteractiveArea>
                <InteractiveArea><button type="submit" className="w-full bg-[var(--accent-red)] text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors">Send Message</button></InteractiveArea>
            </form>
        </div>
    </Section>
);

const BlogSection = ({ blogs }) => {
    const navigate = useNavigate();
    return (
        <Section bgColor="var(--white)" divider="slant" dividerColor="var(--light-bg)">
            <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">From Our Blog</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">Insights, strategies, and news from the world of chess.</p></div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {blogs.length === 0 ? (
                    <div className="col-span-3 text-center text-gray-500 py-8">No articles published yet. Check back soon!</div>
                ) : (
                    blogs.map(post => (
                        <InteractiveArea key={post.id} className="w-full h-full">
                            <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                                {post.image_url ? (
                                    <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover bg-gray-200" />
                                ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-[var(--dark-blue)] to-[var(--primary-blue)] flex items-center justify-center border-b">
                                        <span className="text-white/60 font-medium tracking-widest uppercase text-4xl">♟</span>
                                    </div>
                                )}
                                <div className="p-6 flex flex-col flex-grow">
                                    <p className="text-sm font-semibold text-[var(--accent-red)] mb-2">{post.category}</p>
                                    <h3 className="text-xl font-bold text-[var(--dark-blue)] mb-3 flex-grow">{post.title}</h3>
                                    <p className="text-[var(--text-light)] mb-4">{post.excerpt}</p>
                                    <button
                                        onClick={() => {
                                            // Extract numeric ID from composite params like "3-slug"
                                            const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                                            navigate(`/blog/${post.id}-${slug}`);
                                        }}
                                        className="text-left font-bold text-[var(--primary-blue)] hover:underline mt-auto"
                                    >Read More &rarr;</button>
                                </div>
                            </div>
                        </InteractiveArea>
                    ))
                )}
            </div>
        </Section>
    );
};

const FAQ = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const toggleFAQ = index => { setOpenIndex(openIndex === index ? null : index); };
    return (
        <Section bgColor="var(--light-bg)">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-12"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">Frequently Asked Questions</h2></div>
                <div className="space-y-4">
                    {faqs.length === 0 ? (
                        <div className="text-center text-gray-500">More updates coming soon!</div>
                    ) : (
                        faqs.map((faq, index) => (
                            <InteractiveArea key={faq.id} className="w-full">
                                <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                                    <button onClick={() => toggleFAQ(index)} className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg text-[var(--dark-blue)]">
                                        <span>{faq.question}</span>
                                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-[var(--primary-blue)]">
                                            <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>+</span>
                                        </div>
                                    </button>
                                    <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <p className="px-5 pb-5 text-[var(--text-light)] whitespace-pre-wrap">{faq.answer}</p>
                                    </div>
                                </div>
                            </InteractiveArea>
                        ))
                    )}
                </div>
            </div>
        </Section>
    );
};


// --- MAIN HOMEPAGE COMPONENT ---
const HomePage = ({ setPage }) => {
    const [publicData, setPublicData] = useState({
        announcements: [],
        blogs: [],
        faqs: [],
        gallery: [],
        testimonials: [],
        courses: [],
        coaches: []
    });

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const { postToApi } = await import('../utils/api.js');
                const data = await postToApi('api_public.php', { action: 'get_public_content' });
                if (data.status === 'success') {
                    setPublicData({
                        announcements: data.announcements || [],
                        blogs: data.blogs || [],
                        faqs: data.faqs || [],
                        gallery: data.gallery || [],
                        testimonials: data.testimonials || [],
                        courses: data.courses || [],
                        coaches: data.coaches || [],
                        puzzles: data.puzzles || []
                    });
                }
            } catch (err) {
                console.error("Failed to fetch public content", err);
            }
        };
        fetchPublicData();
    }, []);

    return (
        <main>
            {publicData.announcements && publicData.announcements.length > 0 && (
                <div className="w-full bg-[var(--accent-red)] text-white overflow-hidden py-3 shadow-md relative z-40 flex overflow-x-auto no-scrollbar">
                    <div className="whitespace-nowrap animate-pulse flex items-center min-w-[max-content] px-4">
                        {publicData.announcements.map((ann, idx) => (
                            <span key={idx} className="mr-8 flex items-center">
                                <span className="font-bold tracking-wide uppercase mr-2 text-yellow-300">📢 Update:</span>
                                <a href={ann.link || "#"} className="hover:underline text-white font-medium">{ann.message}</a>
                                {idx < publicData.announcements.length - 1 && <span className="mx-8 text-black opacity-30">|</span>}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <HeroSection />
            <InstituteSnapshot coaches={publicData.coaches} />
            <CoursesSection courses={publicData.courses} />
            <GallerySection announcements={publicData.announcements} images={publicData.gallery} />
            <GoogleReviews />
            <TestimonialsSection testimonials={publicData.testimonials} />
            
            {/* Puzzle of the Week Section */}
            {publicData.puzzles && publicData.puzzles.length > 0 && (
                <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-4">Puzzle of the Week</h2>
                            <p className="text-gray-600">Challenge yourself with our weekly tactical puzzle! Can you find the best continuation?</p>
                        </div>
                        <InteractivePuzzleDisplay 
                            puzzle={publicData.puzzles.find(p => p.is_weekly === 1) || publicData.puzzles[0]} 
                            isWeekly={true} 
                        />
                        <div className="text-center mt-8">
                            <button 
                                onClick={() => setPage && setPage('Blog')}
                                className="inline-block bg-[var(--primary-blue)] text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 cursor-pointer"
                            >
                                View Puzzle Archive →
                            </button>
                        </div>
                    </div>
                </Section>
            )}

            <ContactSection />
            <BlogSection blogs={publicData.blogs} />
            <FAQ faqs={publicData.faqs} />
        </main>
    );
};

export default HomePage;
