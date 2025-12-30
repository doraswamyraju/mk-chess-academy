import React, { useState } from 'react';
import InteractiveArea from '../components/InteractiveArea'; // Assuming this is in src/components

// --- PAGE-SPECIFIC ICONS ---
const StarIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const BookOpenIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>);
const BrainCircuitIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a2.5 2.5 0 0 0-2.5 2.5v.75a2.5 2.5 0 0 0 5 0V4.5A2.5 2.5 0 0 0 12 2Z"/><path d="M4.5 9.5A2.5 2.5 0 0 0 7 12v0a2.5 2.5 0 0 0-2.5 2.5"/><path d="M19.5 9.5A2.5 2.5 0 0 1 17 12v0a2.5 2.5 0 0 1 2.5 2.5"/><path d="M12 12a2.5 2.5 0 0 0-2.5 2.5v.75a2.5 2.5 0 0 0 5 0V14.5A2.5 2.5 0 0 0 12 12Z"/><path d="M4.5 14.5v-5"/><path d="M19.5 14.5v-5"/><path d="M12 12V7.5"/><path d="M9.5 12H7.5"/><path d="M14.5 12H17"/><path d="M12 17.25V22"/><path d="M7 14.5a2.5 2.5 0 0 1-2.5-2.5"/><path d="M17 14.5a2.5 2.5 0 0 0 2.5-2.5"/></svg>);
const PlayCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>);
const GlobeIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>);
const UsersIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);

// --- PAGE-SPECIFIC DATA ---
const coach = {
    name: 'G Hema Chandra Mouli',
    titles: ['Senior National Arbiter', 'Chess in Schools Trainer', 'National Instructor', 'Arena Grand Master'],
    rating: 1864,
    image: 'https://placehold.co/800x800/1A237E/FFFFFF?text=G.H.C.+Mouli',
    bannerImage: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2070&auto=format&fit=crop',
    quote: "Every pawn is a potential queen. My mission is to unlock that potential in every student.",
    bio: {
        early: "From a young age, Hema Chandra was captivated by the infinite possibilities on the 64 squares. His journey began in local clubs in Rajahmundry, where his passion for strategy and competition quickly became apparent.",
        career: "Over a decade of competitive play saw him achieve numerous accolades in state and national tournaments. His transition to coaching was a natural evolution, driven by a desire to share his deep understanding of the game with the next generation.",
        ratings: "Consistently maintaining an International Rating above 1800, Hema Chandra's performance is a testament to his strategic prowess and dedication."
    },
    philosophy: {
        approach: "My teaching method is built on a foundation of strong fundamentals, tactical awareness, and creative problem-solving. I believe in a personalized approach, adapting to each student's learning style.",
        drills: "I emphasize 'Pattern Recognition Drills' to build intuitive decision-making and 'Endgame Simulation' to ensure students can convert advantages into victories.",
        focus: "Students can expect a supportive yet challenging environment. We will work not only on technical skills but also on the psychological aspects of competition, such as focus and resilience."
    },
    achievements: [
        { year: 2023, title: "Awarded 'Senior National Arbiter' title by AICF" },
        { year: 2022, title: "Certified as a 'Chess in Schools' Trainer" },
        { year: 2020, title: "Top 10 Finish, AP State Senior Championship" },
        { year: 2018, title: "Achieved FIDE 'National Instructor' title" },
    ],
    experience: {
        collaborations: "Has collaborated with several top chess academies across Andhra Pradesh and has served as an official arbiter in numerous FIDE-rated events.",
        international: "Coached students from over 15 countries through our online program, adapting to various cultural backgrounds and time zones.",
        languages: "English, Telugu"
    },
    successStories: [
        { name: "S.K. (U-14)", story: "Under Mouli sir's guidance, my rating increased by 300 points in one year, and I won my first district-level tournament." },
        { name: "Parent of Riya", story: "His patient and methodical teaching style has been perfect for my daughter. She not only plays better but also enjoys the game more than ever." }
    ],
    faq: [
        { q: "What is your primary focus for beginner students?", a: "For beginners, my focus is on building a strong love for the game. We start with fundamentals, basic tactics, and lots of fun, interactive exercises to keep them engaged." },
        { q: "How do you prepare students for tournaments?", a: "Tournament preparation involves analyzing opponents' games, mastering specific opening repertoires, and intensive psychological training to handle pressure." },
        { q: "What is a typical one-on-one session like?", a: "A session usually involves reviewing the student's recent games, working on a specific area of weakness (like tactics or endgames), and playing training games with immediate feedback." }
    ]
};

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


// --- COACH PAGE SECTION COMPONENTS ---
const CoachHero = ({ coach }) => (
    <section className="relative text-white flex items-center justify-center text-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-parallax" style={{ backgroundImage: `url('${coach.bannerImage}')` }} />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 p-6 container mx-auto">
            <div className="grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-2">
                    <InteractiveArea onHoverType="queen" className="w-full">
                        <img src={coach.image} alt={coach.name} className="rounded-full shadow-2xl w-full max-w-sm mx-auto ring-8 ring-white/20 transition-all duration-300 hover:ring-white/40 hover:scale-105" />
                    </InteractiveArea>
                </div>
                <div className="md:col-span-3 text-center md:text-left">
                    <h1 className="text-5xl md:text-6xl font-black">{coach.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 my-4">
                        {coach.titles.map(title => (
                            <span key={title} className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full">{title}</span>
                        ))}
                    </div>
                    <blockquote className="mt-6 text-xl italic text-gray-300 border-l-4 border-[var(--accent-red)] pl-4">
                        "{coach.quote}"
                    </blockquote>
                </div>
            </div>
        </div>
    </section>
);

const Biography = ({ bio }) => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Biography</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
             <InteractiveArea className="w-full">
                <div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Early Journey</h3>
                    <p className="text-[var(--text-light)]">{bio.early}</p>
                </div>
            </InteractiveArea>
            <InteractiveArea className="w-full">
                <div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Career Highlights</h3>
                    <p className="text-[var(--text-light)]">{bio.career}</p>
                </div>
            </InteractiveArea>
            <InteractiveArea className="w-full">
                <div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                    <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Titles & Rankings</h3>
                    <p className="text-[var(--text-light)]">{bio.ratings}</p>
                </div>
            </InteractiveArea>
        </div>
    </Section>
);

const CoachingPhilosophy = ({ philosophy }) => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Coaching Philosophy</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><BookOpenIcon className="w-12 h-12 text-[var(--accent-red)] mb-4" /><h3 className="text-xl font-bold text-[var(--dark-blue)] mb-2">Teaching Approach</h3><p className="text-[var(--text-light)]">{philosophy.approach}</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><BrainCircuitIcon className="w-12 h-12 text-[var(--accent-red)] mb-4" /><h3 className="text-xl font-bold text-[var(--dark-blue)] mb-2">Signature Drills</h3><p className="text-[var(--text-light)]">{philosophy.drills}</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><StarIcon className="w-12 h-12 text-[var(--accent-red)] mb-4" /><h3 className="text-xl font-bold text-[var(--dark-blue)] mb-2">Student Focus</h3><p className="text-[var(--text-light)]">{philosophy.focus}</p></div></InteractiveArea>
        </div>
    </Section>
);

const Achievements = ({ achievements }) => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Achievements & Accolades</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {achievements.map((item, index) => (
                <InteractiveArea key={index} className="w-full">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 transform transition-all duration-300 hover:shadow-xl hover:scale-105">
                        <div className="bg-[var(--accent-red)] text-white font-black text-2xl p-4 rounded-md">{item.year}</div>
                        <div>
                            <h3 className="text-lg font-bold text-[var(--dark-blue)]">{item.title}</h3>
                        </div>
                    </div>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const SampleGames = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Sample Games & Analyses</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <InteractiveArea onHoverType="queen" className="w-full"><div className="bg-white rounded-lg shadow-lg p-6 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><img src="https://placehold.co/600x400/1A237E/FFFFFF?text=Interactive+Game+Board" className="w-full rounded-md mb-4"/><h3 className="text-xl font-bold">Mouli vs. IM (2021)</h3><p className="text-[var(--text-light)]">A decisive victory showcasing tactical brilliance.</p></div></InteractiveArea>
            <InteractiveArea onHoverType="queen" className="w-full"><div className="bg-white rounded-lg shadow-lg p-6 text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><img src="https://placehold.co/600x400/2962FF/FFFFFF?text=Video+Analysis" className="w-full rounded-md mb-4"/><h3 className="text-xl font-bold">Endgame Masterclass</h3><p className="text-[var(--text-light)]">In-depth video analysis of a complex rook endgame.</p></div></InteractiveArea>
        </div>
    </Section>
);

const CoachingExperience = ({ experience }) => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Coaching Experience</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <InteractiveArea className="w-full"><div className="bg-gray-50 p-6 rounded-lg shadow-md h-full transform transition-all duration-300 hover:shadow-xl hover:scale-105"><UsersIcon className="w-8 h-8 text-[var(--primary-blue)] mb-3"/><h3 className="text-xl font-bold mb-2">Institutes & Collaborations</h3><p className="text-[var(--text-light)]">{experience.collaborations}</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-gray-50 p-6 rounded-lg shadow-md h-full transform transition-all duration-300 hover:shadow-xl hover:scale-105"><GlobeIcon className="w-8 h-8 text-[var(--primary-blue)] mb-3"/><h3 className="text-xl font-bold mb-2">International Exposure</h3><p className="text-[var(--text-light)]">{experience.international}</p><p className="mt-2 font-semibold">Languages: {experience.languages}</p></div></InteractiveArea>
        </div>
    </Section>
);

const SuccessStories = ({ stories }) => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Success Stories</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {stories.map(item => (
                <InteractiveArea key={item.name} className="w-full"><div className="bg-white p-6 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><p className="italic text-[var(--text-light)]">"{item.story}"</p><p className="text-right mt-4 font-bold text-[var(--primary-blue)]">- {item.name}</p></div></InteractiveArea>
            ))}
        </div>
    </Section>
);

const Multimedia = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Multimedia Gallery</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <InteractiveArea onHoverType="queen" className="w-full"><div className="relative rounded-lg shadow-lg overflow-hidden group"><img src="https://placehold.co/800x450/1A237E/FFFFFF?text=Video+Introduction" className="w-full"/><div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircleIcon className="w-20 h-20 text-white"/></div></div></InteractiveArea>
            <InteractiveArea onHoverType="queen" className="w-full"><div className="relative rounded-lg shadow-lg overflow-hidden group"><img src="https://placehold.co/800x450/2962FF/FFFFFF?text=Lesson+Snippet" className="w-full"/><div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircleIcon className="w-20 h-20 text-white"/></div></div></InteractiveArea>
        </div>
    </Section>
);

const Booking = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-[var(--dark-blue)]">Ready to Elevate Your Game?</h2>
            <p className="text-[var(--text-light)] mt-4 text-lg">Book a one-on-one session with me and let's start working towards your chess goals together.</p>
            <InteractiveArea><button className="mt-8 bg-[var(--accent-red)] text-white font-bold py-4 px-10 rounded-lg text-xl transform hover:scale-105 transition-transform">Book a Session</button></InteractiveArea>
        </div>
    </Section>
);

const FAQ = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState(null);
    const toggleFAQ = index => { setOpenIndex(openIndex === index ? null : index); };
    return (
        <Section divider="slant" dividerColor="var(--light-bg)">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-12"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">Coach FAQs</h2></div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <InteractiveArea key={index} className="w-full">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                                <button onClick={() => toggleFAQ(index)} className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg text-[var(--dark-blue)]">
                                    <span>{faq.q}</span>
                                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-[var(--primary-blue)]"><span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>+</span></div>
                                </button>
                                <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}><p className="px-5 pb-5 text-[var(--text-light)]">{faq.a}</p></div>
                            </div>
                        </InteractiveArea>
                    ))}
                </div>
            </div>
        </Section>
    );
};

const ContactAndSocial = () => (
    <Section bgColor="var(--light-bg)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">Contact & Social Profiles</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">Connect with me directly for inquiries or follow my chess journey online.</p></div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
            <form className="space-y-4">
                <InteractiveArea className="w-full"><input type="text" placeholder="Your Name" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none transition-shadow" /></InteractiveArea>
                <InteractiveArea className="w-full"><input type="email" placeholder="Your Email" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none transition-shadow" /></InteractiveArea>
                <InteractiveArea className="w-full"><textarea placeholder="Your Message" rows="5" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none transition-shadow"></textarea></InteractiveArea>
                <InteractiveArea><button type="submit" className="w-full bg-[var(--accent-red)] text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors">Send Inquiry</button></InteractiveArea>
            </form>
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-[var(--dark-blue)]">Follow Me</h3>
                <InteractiveArea className="block"><a href="#" className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300"><span className="font-bold text-[var(--primary-blue)]">FIDE Profile</span></a></InteractiveArea>
                <InteractiveArea className="block"><a href="#" className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300"><span className="font-bold text-[var(--primary-blue)]">Chess.com</span></a></InteractiveArea>
                <InteractiveArea className="block"><a href="#" className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300"><span className="font-bold text-[var(--primary-blue)]">YouTube Channel</span></a></InteractiveArea>
            </div>
        </div>
    </Section>
);


// --- MAIN COACH PAGE COMPONENT ---
const CoachPage = () => {
    return (
        <main>
            <CoachHero coach={coach} />
            <Biography bio={coach.bio} />
            <CoachingPhilosophy philosophy={coach.philosophy} />
            <Achievements achievements={coach.achievements} />
            <SampleGames />
            <CoachingExperience experience={coach.experience} />
            <SuccessStories stories={coach.successStories} />
            <Multimedia />
            <Booking />
            <FAQ faqs={coach.faq} />
            <ContactAndSocial />
        </main>
    );
};

export default CoachPage;
