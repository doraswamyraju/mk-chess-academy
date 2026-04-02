import React, { useState } from 'react';
import InteractiveArea from '../components/InteractiveArea'; // Assuming this is in src/components

// --- PAGE-SPECIFIC ICONS ---
const FileTextIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>);
const UserCheckIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>);
const DollarSignIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>);
const CheckCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);


// --- REUSABLE HELPER COMPONENTS ---
const Section = ({ children, bgColor = 'var(--white)', divider = null, dividerColor = 'var(--light-bg)' }) => (
    <section className="relative py-20" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-6 z-10 relative">{children}</div>
        {divider && <ShapeDivider type={divider} fillColor={dividerColor} />}
    </section>
);

const ShapeDivider = ({ type, fillColor }) => (
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ transform: type === 'waves' ? '' : 'rotate(180deg)' }}>
        {type === 'waves' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[100px]">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style={{ fill: fillColor }}></path>
            </svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[80px]">
                <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" style={{ fill: fillColor }}></path>
            </svg>
        )}
    </div>
);


// --- ADMISSIONS PAGE SECTION COMPONENTS ---
const AdmissionsHero = () => (
    <section className="relative text-white flex items-center justify-center text-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1974&auto=format&fit=crop')` }} />
        <div className="absolute inset-0 bg-[var(--dark-blue)] bg-opacity-70"></div>
        <div className="relative z-10 p-6 container mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">Admissions & Enrollment</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">Join our academy through a simple and inclusive process, open to all aspiring chess players.</p>
        </div>
    </section>
);

const AdmissionSteps = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-16">Your Path to Enrollment</h2>
        <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-8 left-0 w-full h-1 bg-gray-200 hidden md:block"></div>
            <div className="grid md:grid-cols-4 gap-8 text-center">
                {['Inquiry', 'Demo/Assessment', 'Registration', 'Payment & Allocation'].map((step, index) => (
                    <InteractiveArea key={step} className="w-full">
                        <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                            <div className="bg-[var(--accent-red)] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto text-3xl font-bold mb-4">{index + 1}</div>
                            <h3 className="text-xl font-bold text-[var(--dark-blue)]">{step}</h3>
                        </div>
                    </InteractiveArea>
                ))}
            </div>
        </div>
    </Section>
);

const Eligibility = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Eligibility & Prerequisites</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><UserCheckIcon className="w-12 h-12 text-[var(--primary-blue)] mb-4" /><h3 className="text-xl font-bold text-[var(--dark-blue)] mb-2">Age Groups</h3><p className="text-[var(--text-light)]">We welcome students from age 5 and above, with separate batches for children, teens, and adults.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><FileTextIcon className="w-12 h-12 text-[var(--primary-blue)] mb-4" /><h3 className="text-xl font-bold text-[var(--dark-blue)] mb-2">Skill Requirements</h3><p className="text-[var(--text-light)]">No prior experience is needed for our beginner courses. An assessment class helps place experienced players.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><CheckCircleIcon className="w-12 h-12 text-[var(--primary-blue)] mb-4" /><h3 className="text-xl font-bold text-[var(--dark-blue)] mb-2">Required Documents</h3><p className="text-[var(--text-light)]">A simple registration form and parent/guardian consent for minors are all that's required.</p></div></InteractiveArea>
        </div>
    </Section>
);

const RegistrationForms = () => {
    const [activeTab, setActiveTab] = useState('indian');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e, studentType) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData(e.target);
            const data = {
                action: 'submit_enrolment',
                student_name: formData.get('student_name'),
                parent_email: formData.get('parent_email'),
                phone: formData.get('phone') || '',
                course_name: formData.get('course_name') || '',
                student_type: studentType,
                country_timezone: formData.get('country_timezone') || ''
            };
            const { postToApi } = await import('../utils/api.js');
            await postToApi('api_client_forms.php', data);
            setSuccess(true);
            e.target.reset();
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            alert('Error submitting application: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = "w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none transition-shadow bg-white";

    return (
        <Section divider="slant" dividerColor="var(--light-bg)">
            <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-4">Enroll Now</h2>
            <p className="text-center text-[var(--text-light)] mb-12 max-w-2xl mx-auto">Fill out the form below and our team will get back to you within 24 hours to schedule your free demo class.</p>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <div className="flex border-b mb-8">
                    <button onClick={() => setActiveTab('indian')} className={`py-3 px-6 font-semibold transition-colors duration-300 ${activeTab === 'indian' ? 'border-b-2 border-[var(--accent-red)] text-[var(--accent-red)]' : 'text-gray-500 hover:text-[var(--accent-red)]'}`}>🇮🇳 For Indian Students</button>
                    <button onClick={() => setActiveTab('international')} className={`py-3 px-6 font-semibold transition-colors duration-300 ${activeTab === 'international' ? 'border-b-2 border-[var(--accent-red)] text-[var(--accent-red)]' : 'text-gray-500 hover:text-[var(--accent-red)]'}`}>🌍 For Foreign Students</button>
                </div>

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 text-center font-semibold">
                        ✅ Application submitted successfully! We will contact you within 24 hours.
                    </div>
                )}

                {activeTab === 'indian' ? (
                    <form onSubmit={(e) => handleSubmit(e, 'indian')} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student's Name *</label>
                                    <input type="text" name="student_name" required placeholder="Enter student's full name" className={inputClass} />
                                </div>
                            </InteractiveArea>
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student's Age *</label>
                                    <select name="student_age" required className={inputClass}>
                                        <option value="">Select Age Group</option>
                                        <option value="5-7">5 - 7 years</option>
                                        <option value="8-10">8 - 10 years</option>
                                        <option value="11-14">11 - 14 years</option>
                                        <option value="15-18">15 - 18 years</option>
                                        <option value="18+">18+ (Adult)</option>
                                    </select>
                                </div>
                            </InteractiveArea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent's / Guardian's Email *</label>
                                    <input type="email" name="parent_email" required placeholder="parent@email.com" className={inputClass} />
                                </div>
                            </InteractiveArea>
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp Number *</label>
                                    <input type="tel" name="phone" required placeholder="+91 98765 43210" className={inputClass} />
                                </div>
                            </InteractiveArea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Course</label>
                                    <select name="course_name" className={inputClass}>
                                        <option value="">Select a Course</option>
                                        <option value="Beginner">Beginner Course</option>
                                        <option value="Intermediate">Intermediate Course</option>
                                        <option value="Advanced">Advanced Course</option>
                                        <option value="Tournament Prep">Tournament Preparation</option>
                                        <option value="Private Coaching">Private 1-on-1 Coaching</option>
                                        <option value="Not Sure">Not Sure - Need Guidance</option>
                                    </select>
                                </div>
                            </InteractiveArea>
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Chess Experience</label>
                                    <select name="country_timezone" className={inputClass}>
                                        <option value="">Select Experience Level</option>
                                        <option value="Complete Beginner">Complete Beginner</option>
                                        <option value="Knows Basic Rules">Knows Basic Rules</option>
                                        <option value="Plays Regularly">Plays Regularly</option>
                                        <option value="Tournament Player">Tournament Player</option>
                                        <option value="Rated Player">FIDE/National Rated Player</option>
                                    </select>
                                </div>
                            </InteractiveArea>
                        </div>
                        <InteractiveArea className="w-full">
                            <button type="submit" disabled={submitting} className="w-full bg-[var(--accent-red)] text-white font-bold py-4 px-6 rounded-md hover:bg-opacity-90 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                {submitting ? 'Submitting...' : '🎯 Submit Enrollment Application'}
                            </button>
                        </InteractiveArea>
                    </form>
                ) : (
                    <form onSubmit={(e) => handleSubmit(e, 'international')} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student's Name *</label>
                                    <input type="text" name="student_name" required placeholder="Enter student's full name" className={inputClass} />
                                </div>
                            </InteractiveArea>
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Student's Age *</label>
                                    <select name="student_age" required className={inputClass}>
                                        <option value="">Select Age Group</option>
                                        <option value="5-7">5 - 7 years</option>
                                        <option value="8-10">8 - 10 years</option>
                                        <option value="11-14">11 - 14 years</option>
                                        <option value="15-18">15 - 18 years</option>
                                        <option value="18+">18+ (Adult)</option>
                                    </select>
                                </div>
                            </InteractiveArea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Parent's / Guardian's Email *</label>
                                    <input type="email" name="parent_email" required placeholder="parent@email.com" className={inputClass} />
                                </div>
                            </InteractiveArea>
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone / WhatsApp Number *</label>
                                    <input type="tel" name="phone" required placeholder="+1 234 567 8900" className={inputClass} />
                                </div>
                            </InteractiveArea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country & Time Zone *</label>
                                    <input type="text" name="country_timezone" required placeholder="e.g. USA - EST (UTC-5)" className={inputClass} />
                                </div>
                            </InteractiveArea>
                            <InteractiveArea className="w-full">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Course</label>
                                    <select name="course_name" className={inputClass}>
                                        <option value="">Select a Course</option>
                                        <option value="Beginner">Beginner Course</option>
                                        <option value="Intermediate">Intermediate Course</option>
                                        <option value="Advanced">Advanced Course</option>
                                        <option value="Tournament Prep">Tournament Preparation</option>
                                        <option value="Private Coaching">Private 1-on-1 Coaching</option>
                                        <option value="Not Sure">Not Sure - Need Guidance</option>
                                    </select>
                                </div>
                            </InteractiveArea>
                        </div>
                        <InteractiveArea className="w-full">
                            <button type="submit" disabled={submitting} className="w-full bg-[var(--accent-red)] text-white font-bold py-4 px-6 rounded-md hover:bg-opacity-90 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                {submitting ? 'Submitting...' : '🌍 Submit International Application'}
                            </button>
                        </InteractiveArea>
                    </form>
                )}
            </div>
        </Section>
    );
};

const FeesAndScholarships = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-6">Fee Structure</h2>
                <p className="text-[var(--text-light)] mb-4">We offer clear and competitive pricing. For a detailed breakdown of fees for each course in INR and USD, please download our fee chart.</p>
                <InteractiveArea><a href="#" className="font-bold text-[var(--accent-red)] hover:underline flex items-center space-x-2"><DollarSignIcon className="w-5 h-5"/><span>Download Fee Chart</span></a></InteractiveArea>
            </div>
            <div>
                <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-6">Scholarships</h2>
                <p className="text-[var(--text-light)] mb-4">We are committed to nurturing talent. We offer merit-based scholarships for highly-rated players and financial aid for deserving students. Contact our admissions team to learn more about the eligibility and application process.</p>
            </div>
        </div>
    </Section>
);

const Policies = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Important Policies</h2>
        <div className="flex flex-wrap justify-center gap-4">
            <InteractiveArea><a href="#" className="bg-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-[var(--primary-blue)] hover:bg-gray-50 hover:-translate-y-1">Admission Terms</a></InteractiveArea>
            <InteractiveArea><a href="#" className="bg-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-[var(--primary-blue)] hover:bg-gray-50 hover:-translate-y-1">Refund Policy</a></InteractiveArea>
            <InteractiveArea><a href="#" className="bg-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-[var(--primary-blue)] hover:bg-gray-50 hover:-translate-y-1">Code of Conduct</a></InteractiveArea>
        </div>
    </Section>
);

const SupportAndInquiry = () => (
     <Section bgColor="var(--light-bg)">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-[var(--dark-blue)] mb-4">Need Help?</h3>
                <p className="text-[var(--text-light)] mb-6">Our admissions counselors are ready to assist you. Request a callback for a personalized consultation.</p>
                <InteractiveArea>
                    <a href="#" className="inline-block bg-[var(--primary-blue)] text-white font-bold py-3 px-8 rounded-lg text-lg transform hover:scale-105 transition-transform">
                        Request a Callback
                    </a>
                </InteractiveArea>
            </div>
            <div className="text-center">
                <h3 className="text-3xl font-bold text-[var(--dark-blue)] mb-4">Live Chat</h3>
                <p className="text-[var(--text-light)] mb-6">For quick questions, connect with us via our live chat during office hours.</p>
                <InteractiveArea>
                    <a href="#" className="inline-block bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg transform hover:scale-105 transition-transform">
                        Chat on WhatsApp
                    </a>
                </InteractiveArea>
            </div>
        </div>
    </Section>
);

const FinalCTA = () => (
    <Section bgColor="var(--dark-blue)">
        <div className="text-center text-white">
            <h2 className="text-4xl font-bold">Your Next Move is Clear</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Take the first step towards becoming a chess champion. Apply now or book a free demo to experience our unique coaching style.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <InteractiveArea><button className="bg-[var(--accent-red)] text-white font-bold py-3 px-8 rounded-md text-lg transform hover:scale-105 transition-transform">Apply Now</button></InteractiveArea>
                <InteractiveArea><button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-white hover:text-[var(--dark-blue)] transition-colors">Book a Free Demo</button></InteractiveArea>
            </div>
        </div>
    </Section>
);


// --- MAIN ADMISSIONS PAGE COMPONENT ---
const AdmissionsPage = () => {
    return (
        <main>
            <AdmissionsHero />
            <AdmissionSteps />
            <Eligibility />
            <RegistrationForms />
            <FeesAndScholarships />
            <SupportAndInquiry />
            <Policies />
            <FinalCTA />
        </main>
    );
};

export default AdmissionsPage;
