import React, { useState } from 'react';
import InteractiveArea from '../components/InteractiveArea'; // Assuming this is in src/components

// --- PAGE-SPECIFIC ICONS ---
const TargetIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
const EyeIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>);
const HeartIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>);
const BuildingIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/></svg>);
const GlobeIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>);
const TrophyIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.87 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.13 18.75 17 20.24 17 22"/><path d="M9 12H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h1"/><path d="M15 12h5a2 2 0 0 1 2 2v2c0 1.1-.9 2-2 2h-1"/><path d="m9 12 1-9H14l1 9"/><path d="M12 12V3"/></svg>);

// --- PAGE-SPECIFIC DATA ---
const aboutData = {
    founders: [
        { name: 'G Hema Chandra Mouli', titles: ['Senior National Arbiter', 'Chess in Schools Trainer', 'National Instructor', 'Arena Grand Master'], rating: 1864, image: 'https://placehold.co/400x400/9ca3af/FFFFFF?text=G.H.C.+Mouli', message: "Our vision is to create not just strong players, but sharp minds. We believe chess is a tool for life-long learning and strategic thinking." },
        { name: 'G Karthik Gopal', titles: ['National Instructor', 'Arena Grand Master', 'FIDE Arbiter', 'Chess in Schools Trainer'], rating: 1987, image: 'https://placehold.co/400x400/a1a1aa/FFFFFF?text=G.K.+Gopal', message: "We founded this academy to build a community where passion for chess can flourish. Our goal is to provide the guidance we wished we had when we started." },
    ],
    timeline: [
        { year: 2022, event: "Academy Founded", description: "Modern Knight Chess Academy was established in Rajahmundry with a mission to nurture local talent." },
        { year: 2023, event: "Online Expansion", description: "Launched our international online coaching program, reaching students in over 15 countries." },
        { year: 2024, event: "First FIDE Rated Students", description: "Our first batch of dedicated students achieved their official FIDE ratings through our structured training." },
        { year: 2025, event: "State Championship Win", description: "Celebrated a major victory as our student won the State Under-12 Championship." },
    ],
    achievements: [
      { date: '20-Oct, 2024', name: 'Annanya Ch', event: 'AP STATE Under-9 Girls Chess Championship', result: '2nd place' },
      { date: '10-Feb, 2024', name: 'Sri Nikhila Y', event: '12th National Schools U-7 Girls Chess Championship', result: '4th place' },
      { date: '02-Feb, 2024', name: 'Annanya Ch', event: '37th National Under 9 Girls Chess Championship 2024', result: '6th place' },
    ],
};

// --- REUSABLE HELPER COMPONENTS ---
// These could also be moved to their own files in `src/components/` for wider use.
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

// --- ABOUT US PAGE SECTION COMPONENTS ---
const AboutHero = () => (
    <section className="relative text-white flex items-center justify-center text-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1610623378544-85234b115e5b?q=80&w=1974&auto=format&fit=crop')` }} />
        <div className="absolute inset-0 bg-[var(--dark-blue)] bg-opacity-70"></div>
        <div className="relative z-10 p-6 container mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">Our Story</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">Discover the passion, vision, and people behind Modern Knight Chess Academy.</p>
        </div>
    </section>
);

const InstituteOverview = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><TargetIcon className="w-12 h-12 text-[var(--accent-red)] mb-4 mx-auto" /><h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Our Mission</h3><p className="text-[var(--text-light)]">To provide world-class chess coaching that nurtures strategic thinking, builds character, and creates champions, both on and off the board.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><EyeIcon className="w-12 h-12 text-[var(--accent-red)] mb-4 mx-auto" /><h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Our Vision</h3><p className="text-[var(--text-light)]">To be a globally recognized center of chess excellence, empowering students from all backgrounds to achieve their full potential.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><HeartIcon className="w-12 h-12 text-[var(--accent-red)] mb-4 mx-auto" /><h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Core Values</h3><p className="text-[var(--text-light)]">Excellence, Integrity, Inclusiveness, Innovation, and Respect.</p></div></InteractiveArea>
        </div>
    </Section>
);

const FoundersSection = ({ founders }) => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Founders & Master Coaches</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {founders.map(founder => (
                <div key={founder.name} className="flex flex-col items-center text-center">
                    <InteractiveArea onHoverType="queen" className="w-full">
                        <img src={founder.image} alt={founder.name} className="rounded-full shadow-2xl w-48 h-48 md:w-64 md:h-64 object-cover mx-auto ring-8 ring-white transition-all duration-300 hover:ring-[var(--primary-blue)] hover:scale-105" />
                    </InteractiveArea>
                    <div className="mt-6">
                        <h3 className="text-3xl font-bold text-[var(--dark-blue)]">{founder.name}</h3>
                        <div className="flex flex-wrap justify-center gap-2 my-3">
                            {founder.titles.map(title => (<span key={title} className="bg-blue-100 text-[var(--primary-blue)] text-xs font-semibold px-3 py-1 rounded-full">{title}</span>))}
                        </div>
                        <p className="italic text-[var(--text-light)] border-l-4 border-[var(--accent-red)] pl-4 mt-4">{founder.message}</p>
                    </div>
                </div>
            ))}
        </div>
    </Section>
);

const JourneyTimeline = ({ timeline }) => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-16">Our Journey</h2>
        <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gray-200 rounded-full"></div>
            {timeline.map((item, index) => (
                <div key={index} className={`flex items-center w-full mb-8 ${index % 2 === 0 ? 'flex-row-reverse text-right' : 'text-left'}`}>
                    <div className="w-1/2"></div>
                    <div className="w-1/2 px-4">
                        <InteractiveArea className="w-full">
                            <div className={`p-6 rounded-lg shadow-lg bg-white transform transition-transform duration-300 ${index % 2 === 0 ? 'hover:-translate-x-2' : 'hover:translate-x-2'}`}>
                                <div className="text-2xl font-black text-[var(--accent-red)]">{item.year}</div>
                                <h3 className="text-xl font-bold text-[var(--dark-blue)] mt-1">{item.event}</h3>
                                <p className="text-sm text-[var(--text-light)] mt-2">{item.description}</p>
                            </div>
                        </InteractiveArea>
                    </div>
                     <div className="absolute left-1/2 -translate-x-1/2 bg-[var(--primary-blue)] w-6 h-6 rounded-full ring-8 ring-white"></div>
                </div>
            ))}
        </div>
    </Section>
);

const InstituteApproach = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">The Institute's Approach</h2>
        <div className="max-w-4xl mx-auto space-y-8">
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Innovative Coaching</h3><p className="text-[var(--text-light)] mt-2">We blend traditional wisdom with modern technology, using interactive tools to make learning effective and fun.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Holistic Development</h3><p className="text-[var(--text-light)] mt-2">Our focus extends beyond the board to build critical thinking, discipline, and sportsmanship in every student.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Global & Inclusive</h3><p className="text-[var(--text-light)] mt-2">We welcome students of all ages and nationalities, fostering a diverse community united by a love for chess.</p></div></InteractiveArea>
        </div>
    </Section>
);

const AchievementsAndRecognitions = ({ achievements }) => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Achievements and Recognitions</h2>
        <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {achievements.map((item, index) => (
                    <InteractiveArea key={index} className="w-full">
                        <div className="bg-white p-6 rounded-lg shadow-lg h-full text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <TrophyIcon className="w-10 h-10 text-[var(--accent-red)] mx-auto mb-3"/>
                            <p className="text-sm text-[var(--text-light)]">{item.date}</p>
                            <h3 className="text-lg font-bold text-[var(--dark-blue)]">{item.name}</h3>
                            <p className="text-md text-[var(--text-light)]">{item.event}</p>
                            <p className="text-xl font-bold text-[var(--primary-blue)] mt-2">{item.result}</p>
                        </div>
                    </InteractiveArea>
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-8 items-center">
                <InteractiveArea className="w-full max-w-xs"><div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><img src="https://placehold.co/100x60/1A237E/FFFFFF?text=FIDE" alt="FIDE Logo" /><p>FIDE Affiliated</p></div></InteractiveArea>
                <InteractiveArea className="w-full max-w-xs"><div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><img src="https://placehold.co/100x60/2962FF/FFFFFF?text=AICF" alt="AICF Logo" /><p>AICF Recognized</p></div></InteractiveArea>
            </div>
        </div>
    </Section>
);

const TheTeam = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Our Extended Team</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><img src="https://placehold.co/80x80/FF3D00/FFFFFF?text=GM" alt="Guest Master" className="rounded-full"/><p>Regular masterclasses with visiting Grandmasters and International Masters.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 hover:bg-gray-50 transition-colors"><img src="https://placehold.co/80x80/1A237E/FFFFFF?text=Staff" alt="Support Staff" className="rounded-full"/><p>A dedicated support team to ensure a smooth learning experience for all students.</p></div></InteractiveArea>
        </div>
    </Section>
);

const FacilitiesSection = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Facilities & Infrastructure</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <InteractiveArea className="w-full">
                <div className="bg-white rounded-lg shadow-lg p-8 h-full transform hover:-translate-y-2 transition-transform duration-300">
                    <BuildingIcon className="w-10 h-10 text-[var(--accent-red)] mb-4"/>
                    <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-2">Offline Center</h3>
                    <p className="text-[var(--text-light)]">Our state-of-the-art facility in Rajahmundry provides the perfect environment for focused, in-person learning with top-quality equipment.</p>
                    <img src="https://placehold.co/600x400/2962FF/FFFFFF?text=Offline+Center" alt="Offline Center" className="mt-4 rounded-md"/>
                </div>
            </InteractiveArea>
            <InteractiveArea className="w-full">
                <div className="bg-white rounded-lg shadow-lg p-8 h-full transform hover:-translate-y-2 transition-transform duration-300">
                    <GlobeIcon className="w-10 h-10 text-[var(--accent-red)] mb-4"/>
                    <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-2">Online Infrastructure</h3>
                    <p className="text-[var(--text-light)]">We leverage leading digital platforms like Zoom and Lichess to deliver a seamless, interactive, and effective online coaching experience globally.</p>
                    <img src="https://placehold.co/600x400/1A237E/FFFFFF?text=Online+Class" alt="Online Class" className="mt-4 rounded-md"/>
                </div>
            </InteractiveArea>
        </div>
    </Section>
);

const CommunityOutreach = () => (
    <Section bgColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Community & Outreach</h2>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl text-center transform hover:scale-105 transition-transform duration-300">
            <HeartIcon className="w-12 h-12 text-[var(--accent-red)] mx-auto mb-4"/>
            <p className="text-lg text-[var(--text-light)]">We are committed to giving back to the community by hosting free workshops and introductory chess programs in local schools to spread the love for this beautiful game.</p>
        </div>
    </Section>
);

const FinalCTA = () => (
    <Section bgColor="var(--dark-blue)">
        <div className="text-center text-white">
            <h2 className="text-4xl font-bold">Join Our Community of Thinkers</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Become a part of our growing family. Whether you are a beginner or a seasoned player, your journey to mastery starts here.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <InteractiveArea><button className="bg-[var(--accent-red)] text-white font-bold py-3 px-8 rounded-md text-lg transform hover:scale-105 transition-transform">View Courses</button></InteractiveArea>
                <InteractiveArea><button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-white hover:text-[var(--dark-blue)] transition-colors">Contact Us</button></InteractiveArea>
            </div>
        </div>
    </Section>
);

// --- MAIN ABOUT US PAGE COMPONENT ---
const AboutUsPage = () => {
    return (
        <main>
            <AboutHero />
            <InstituteOverview />
            <FoundersSection founders={aboutData.founders} />
            <JourneyTimeline timeline={aboutData.timeline} />
            <InstituteApproach />
            <AchievementsAndRecognitions achievements={aboutData.achievements} />
            <TheTeam />
            <FacilitiesSection />
            <CommunityOutreach />
            <FinalCTA />
        </main>
    );
};

export default AboutUsPage;
