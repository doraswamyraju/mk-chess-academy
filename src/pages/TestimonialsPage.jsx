import React from 'react';
import InteractiveArea from '../components/InteractiveArea'; // Assuming this is in src/components

// --- PAGE-SPECIFIC ICONS ---
const StarIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const PlayCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>);
const UsersIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
const MedalIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="m13 12 5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="m12 14-1 4 3-2-2 3-1-4"/></svg>);
const GlobeIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>);

// --- PAGE-SPECIFIC DATA ---
const studentTestimonialsData = [
    { name: "Srinivasarao R.", photo: "https://placehold.co/100x100/E3F2FD/1A237E?text=SR", rating: 5, text: "Very good chess academy... My son is improving his game very well." },
    { name: "Lokesh", photo: "https://placehold.co/100x100/E3F2FD/1A237E?text=L", rating: 5, text: "Best chess academy in Rajahmundry. They will teach from basics to advanced." },
    { name: "MOHAN", photo: "https://placehold.co/100x100/E3F2FD/1A237E?text=M", rating: 5, text: "Good coaching and good environment to learn chess. My children are very interested to go." },
    { name: "Prasad G", photo: "https://placehold.co/100x100/E3F2FD/1A237E?text=PG", rating: 5, text: "Excellent coaching for all age groups. Both coaches are FIDE rated players." },
];
const alumni = { name: "Annanya Ch", image: "https://placehold.co/400x400/FF3D00/FFFFFF?text=Annanya", story: "Annanya joined us as a beginner with a spark of talent. Through our advanced tournament track, she honed her skills, developing a formidable tactical style. Today, she is a state champion and one of the highest-rated U-9 players in the country, a testament to her hard work and our proven training methods." };
const timeline = [
    { year: 2024, event: "State U-9 Championship", description: "Annanya Ch secures 2nd place with 6/7 points." },
    { year: 2024, event: "National Schools U-7", description: "Sri Nikhila Y achieves 4th place with 6.5/9 points." },
    { year: 2023, event: "Online Program Launch", description: "Expanded our coaching to students in over 15 countries." },
    { year: 2022, event: "Academy Founded", description: "Modern Knight Chess Academy opens its doors in Rajahmundry." },
];
const galleryImages = [
    'https://placehold.co/600x400/1A237E/FFFFFF?text=Trophy+Ceremony+2024',
    'https://placehold.co/600x400/2962FF/FFFFFF?text=Online+Class+with+USA',
    'https://placehold.co/600x400/FF3D00/FFFFFF?text=Intense+Match',
    'https://placehold.co/600x400/424242/FFFFFF?text=Team+Photo',
];
const tournaments = [
    { student: 'Annanya Ch', event: 'AP STATE Under-9 Girls', rank: '2nd', date: '20-Oct, 2024' },
    { student: 'Sri Nikhila Y', event: '12th National Schools U-7', rank: '4th', date: '10-Feb, 2024' },
    { student: 'Annanya Ch', event: '37th National U-9 Girls', rank: '6th', date: '02-Feb, 2024' },
];

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

// --- TESTIMONIALS PAGE SECTION COMPONENTS ---
const TestimonialsHero = () => (
    <section className="relative text-white flex items-center justify-center text-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2070&auto=format&fit=crop')` }} />
        <div className="absolute inset-0 bg-[var(--dark-blue)] bg-opacity-70"></div>
        <div className="relative z-10 p-6 container mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">Success Stories</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">Our greatest achievements are the accomplishments of our students. Explore the impact of our coaching in India and abroad.</p>
        </div>
    </section>
);

const StarRating = ({ rating }) => (<div className="flex mb-4">{[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>)}</div>);

const TestimonialsGrid = ({ testimonials }) => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Student & Parent Testimonials</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {testimonials.map((item, index) => (
                <InteractiveArea key={index} className="w-full">
                    <div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col sm:flex-row items-center gap-6">
                        <img src={item.photo} alt={item.name} className="w-24 h-24 rounded-full flex-shrink-0 ring-4 ring-[var(--primary-blue)] p-1"/>
                        <div className="text-center sm:text-left">
                            <StarRating rating={item.rating} />
                            <p className="italic text-[var(--text-light)]">"{item.text}"</p>
                            <p className="font-bold text-[var(--dark-blue)] mt-4">- {item.name}</p>
                        </div>
                    </div>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const AlumniSpotlight = ({ alumni }) => (
     <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Alumni Success Spotlight</h2>
        <InteractiveArea onHoverType="queen" className="w-full">
            <div className="max-w-4xl mx-auto bg-white text-gray-800 rounded-lg shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12 transform transition-all duration-300 hover:shadow-blue-200 hover:scale-[1.02]">
                <img src={alumni.image} alt={alumni.name} className="w-48 h-48 rounded-full flex-shrink-0 ring-4 ring-[var(--accent-red)] p-1"/>
                <div>
                    <h3 className="text-3xl font-bold text-[var(--dark-blue)]">{alumni.name}</h3>
                    <p className="text-lg text-[var(--text-light)] leading-relaxed mt-4">{alumni.story}</p>
                </div>
            </div>
        </InteractiveArea>
    </Section>
);

const AchievementsTimeline = ({ timeline }) => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-16">Achievements Timeline</h2>
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

const VideoTestimonials = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Video Testimonials & Interviews</h2>
        <div className="grid md:grid-cols-2 gap-8">
            <InteractiveArea onHoverType="queen" className="w-full">
                <div className="relative rounded-lg shadow-lg overflow-hidden group">
                    <img src="https://placehold.co/800x450/1A237E/FFFFFF?text=Parent+Interview" className="w-full"/>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><PlayCircleIcon className="w-20 h-20 text-white"/></div>
                </div>
            </InteractiveArea>
            <InteractiveArea onHoverType="queen" className="w-full">
                 <div className="relative rounded-lg shadow-lg overflow-hidden group">
                    <img src="https://placehold.co/800x450/2962FF/FFFFFF?text=Student+Experience" className="w-full"/>
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"><PlayCircleIcon className="w-20 h-20 text-white"/></div>
                </div>
            </InteractiveArea>
        </div>
    </Section>
);

const PhotoGallery = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Photo & Media Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((src, index) => (
                <InteractiveArea key={index} className="w-full">
                    <div className="rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <img src={src} alt={`Gallery Image ${index + 1}`} className="w-full h-full object-cover"/>
                    </div>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const NotableTournaments = ({ tournaments }) => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Notable Tournament Results</h2>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b-2 border-[var(--dark-blue)]">
                        <th className="p-3">Student</th><th className="p-3">Event</th><th className="p-3">Rank</th><th className="p-3">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50 transition-colors duration-200">
                            <td className="p-3 font-semibold">{item.student}</td>
                            <td className="p-3">{item.event}</td>
                            <td className="p-3 font-bold text-[var(--accent-red)]">{item.rank}</td>
                            <td className="p-3">{item.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Section>
);

const ImpactInNumbers = () => (
    <Section>
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Our Impact in Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300"><UsersIcon className="w-10 h-10 text-[var(--accent-red)] mx-auto mb-3"/><p className="text-5xl font-black text-[var(--dark-blue)]">500+</p><p className="text-[var(--text-light)]">Students Coached</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300"><MedalIcon className="w-10 h-10 text-[var(--accent-red)] mx-auto mb-3"/><p className="text-5xl font-black text-[var(--dark-blue)]">25+</p><p className="text-[var(--text-light)]">National/State Medals</p></div></InteractiveArea>
            <InteractiveArea className="w-full col-span-2 md:col-span-1"><div className="bg-white p-6 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform duration-300"><GlobeIcon className="w-10 h-10 text-[var(--accent-red)] mx-auto mb-3"/><p className="text-5xl font-black text-[var(--dark-blue)]">15+</p><p className="text-[var(--text-light)]">Countries Represented</p></div></InteractiveArea>
        </div>
    </Section>
);

const FinalCTA = () => (
    <Section bgColor="var(--dark-blue)">
        <div className="text-center text-white">
            <h2 className="text-4xl font-bold">Ready to Start Your Success Story?</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Join a community of champions and start your own journey with us. We also encourage our alumni and parents to share their experiences.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <InteractiveArea><button className="bg-[var(--accent-red)] text-white font-bold py-3 px-8 rounded-md text-lg transform hover:scale-105 transition-transform">Enroll Now</button></InteractiveArea>
                <InteractiveArea><button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-white hover:text-[var(--dark-blue)] transition-colors">Share Your Story</button></InteractiveArea>
            </div>
        </div>
    </Section>
);

// --- MAIN TESTIMONIALS PAGE COMPONENT ---
const TestimonialsPage = () => {
    return (
        <main>
            <TestimonialsHero />
            <TestimonialsGrid testimonials={studentTestimonialsData} />
            <AlumniSpotlight alumni={alumni} />
            <AchievementsTimeline timeline={timeline} />
            <VideoTestimonials />
            <PhotoGallery />
            <NotableTournaments tournaments={tournaments} />
            <ImpactInNumbers />
            <FinalCTA />
        </main>
    );
};

export default TestimonialsPage;
