import React, { useState } from 'react';
import InteractiveArea from '../components/InteractiveArea'; // Assuming this is in src/components

// --- PAGE-SPECIFIC ICONS ---
const CheckCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const GlobeIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>);
const VideoIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>);
const DownloadCloudIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 17l4 4 4-4"/><path d="M12 12v9"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>);
const PlayCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>);

// --- PAGE-SPECIFIC DATA ---
const onlineTestimonials = [
    { name: "Anika S. (USA)", text: "The time zone support is fantastic. I can get top-tier coaching from India right from my home in California. The recorded sessions are a huge plus for revision!" },
    { name: "David L. (UK)", text: "I was skeptical about online chess coaching, but the interactive tools and real-time feedback are just as good as being there in person. My game has improved dramatically." },
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

// --- ONLINE COURSE PAGE SECTION COMPONENTS ---
const OnlineCourseHero = () => (
    <section className="relative text-white flex items-center justify-center text-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')` }} />
        <div className="absolute inset-0 bg-[var(--dark-blue)] bg-opacity-70"></div>
        <div className="relative z-10 p-6 container mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">Online Chess Courses</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">Master chess from anywhere in the world with our flexible, expert-led online programs, designed for all ages and skill levels.</p>
            <InteractiveArea><button className="bg-[var(--accent-red)] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-md text-lg transition duration-300 transform hover:scale-105 shadow-lg">Book a Free Trial</button></InteractiveArea>
        </div>
    </section>
);

const WhyChooseOnline = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Why Choose Our Online Coaching?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center"><CheckCircleIcon className="w-12 h-12 text-[var(--accent-red)] mb-4 mx-auto" /><h3 className="text-xl font-bold text-[var(--dark-blue)] mb-2">Ultimate Convenience</h3><p className="text-[var(--text-light)]">Learn from the comfort of your home, saving time and travel costs.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center"><GlobeIcon className="w-12 h-12 text-[var(--accent-red)] mb-4 mx-auto" /><h3 className="text-xl font-bold text-[var(--dark-blue)] mb-2">Global Access</h3><p className="text-[var(--text-light)]">Join our international community with full support for multiple time zones.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center"><VideoIcon className="w-12 h-12 text-[var(--accent-red)] mb-4 mx-auto" /><h3 className="text-xl font-bold text-[var(--dark-blue)] mb-2">Rich Digital Resources</h3><p className="text-[var(--text-light)]">Get access to recorded sessions, digital puzzles, and personalized feedback.</p></div></InteractiveArea>
        </div>
    </Section>
);

const CourseCategories = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Course Categories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:border-[var(--primary-blue)] border-b-4 border-transparent transition-all duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Beginner</h3><p className="text-sm text-[var(--text-light)]">Ages 5+, Adults</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:border-[var(--primary-blue)] border-b-4 border-transparent transition-all duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Intermediate</h3><p className="text-sm text-[var(--text-light)]">Kids, Teens, Adults</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:border-[var(--primary-blue)] border-b-4 border-transparent transition-all duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Advanced</h3><p className="text-sm text-[var(--text-light)]">Tournament Players</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:border-[var(--primary-blue)] border-b-4 border-transparent transition-all duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Competition Prep</h3><p className="text-sm text-[var(--text-light)]">Rated Players</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:border-[var(--primary-blue)] border-b-4 border-transparent transition-all duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Tactics Bootcamp</h3><p className="text-sm text-[var(--text-light)]">All Levels</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:border-[var(--primary-blue)] border-b-4 border-transparent transition-all duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Masterclasses</h3><p className="text-sm text-[var(--text-light)]">Advanced Players</p></div></InteractiveArea>
        </div>
    </Section>
);

const CurriculumStructure = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Curriculum Structure</h2>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-4">Sample Weekly Plan (Intermediate)</h3>
            <ul className="list-disc list-inside space-y-2 text-[var(--text-light)]">
                <li><strong>Monday:</strong> Opening Theory Deep Dive (e.g., Sicilian Defense)</li>
                <li><strong>Wednesday:</strong> Tactical Puzzles & Pattern Recognition</li>
                <li><strong>Friday:</strong> Live Sparring Session with Coach Analysis</li>
                <li><strong>Weekend:</strong> Personalized Homework & Game Review</li>
            </ul>
            <InteractiveArea className="mt-6 inline-block">
                <a href="#" className="flex items-center space-x-2 font-bold text-[var(--accent-red)] hover:underline">
                    <DownloadCloudIcon className="w-6 h-6"/>
                    <span>Download Full Syllabus (PDF)</span>
                </a>
            </InteractiveArea>
        </div>
    </Section>
);

const TechnologyTools = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Technology & Tools</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-4">Our Digital Classroom</h3>
                <p className="text-[var(--text-light)] mb-4">We use a combination of industry-leading tools to provide a seamless and interactive learning experience.</p>
                <ul className="space-y-2">
                    <li className="flex items-center"><strong className="w-28">Platforms:</strong> Zoom, Google Meet</li>
                    <li className="flex items-center"><strong className="w-28">Chess Apps:</strong> Lichess, Chess.com</li>
                    <li className="flex items-center"><strong className="w-28">Requirements:</strong> Stable Internet, PC/Laptop/Tablet</li>
                </ul>
            </div>
            <InteractiveArea onHoverType="queen" className="w-full">
                <div className="relative rounded-lg shadow-lg overflow-hidden group">
                    <img src="https://placehold.co/800x450/1A237E/FFFFFF?text=Live+Class+Demo" className="w-full"/>
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PlayCircleIcon className="w-20 h-20 text-white"/>
                    </div>
                </div>
            </InteractiveArea>
        </div>
    </Section>
);

const SchedulesAndBatches = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Schedules & Batch Timings</h2>
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b-2 border-[var(--dark-blue)]">
                        <th className="p-3">Level</th><th className="p-3">Start Date</th><th className="p-3">Timings (IST)</th><th className="p-3"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b hover:bg-gray-50"><td className="p-3 font-semibold">Beginner</td><td className="p-3">August 1st, 2025</td><td className="p-3">Mon & Wed, 6-7 PM</td><td className="p-3 text-right"><InteractiveArea><button className="bg-[var(--primary-blue)] text-white px-4 py-1 rounded-md text-sm hover:bg-opacity-90 transition-transform hover:scale-105">Enroll</button></InteractiveArea></td></tr>
                    <tr className="border-b hover:bg-gray-50"><td className="p-3 font-semibold">Intermediate</td><td className="p-3">August 2nd, 2025</td><td className="p-3">Tue & Thu, 7-8:30 PM</td><td className="p-3 text-right"><InteractiveArea><button className="bg-[var(--primary-blue)] text-white px-4 py-1 rounded-md text-sm hover:bg-opacity-90 transition-transform hover:scale-105">Enroll</button></InteractiveArea></td></tr>
                    <tr className="hover:bg-gray-50"><td className="p-3 font-semibold">Advanced</td><td className="p-3">August 5th, 2025</td><td className="p-3">Fri & Sat, 8-9:30 PM</td><td className="p-3 text-right"><InteractiveArea><button className="bg-[var(--primary-blue)] text-white px-4 py-1 rounded-md text-sm hover:bg-opacity-90 transition-transform hover:scale-105">Enroll</button></InteractiveArea></td></tr>
                </tbody>
            </table>
        </div>
    </Section>
);

const EnrollmentAndPayment = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Enrollment & Payment</h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div>
                <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-4">How to Enroll</h3>
                <ol className="list-decimal list-inside space-y-2 text-[var(--text-light)]">
                    <li>Fill out the online registration form.</li>
                    <li>Schedule your free trial and assessment class.</li>
                    <li>Receive your batch assignment and curriculum details.</li>
                    <li>Complete the payment via our secure portal.</li>
                </ol>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-4">Fee Structure</h3>
                <p className="text-[var(--text-light)]">We offer competitive pricing for both Indian and International students. Please contact us for a detailed fee structure.</p>
                <p className="font-semibold mt-4">Accepted Payment Methods:</p>
                <p className="text-[var(--text-light)]">Credit/Debit Cards, UPI, Digital Wallets, Bank Transfer.</p>
            </div>
        </div>
    </Section>
);

const StudentSupport = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Student Support</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md h-full transform hover:-translate-y-1 transition-transform"><h3 className="font-bold text-xl text-[var(--primary-blue)]">New Student Orientation</h3><p className="text-sm text-[var(--text-light)]">A dedicated onboarding session to familiarize you with our platform and coaches.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md h-full transform hover:-translate-y-1 transition-transform"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Technical Assistance</h3><p className="text-sm text-[var(--text-light)]">Our support team is available to help with any platform queries or troubleshooting.</p></div></InteractiveArea>
        </div>
    </Section>
);

const OnlineTestimonials = ({ testimonials }) => (
    <Section bgColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Online Student Success</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map(item => (
                <InteractiveArea key={item.name} className="w-full">
                    <div className="bg-white p-6 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                        <p className="italic text-[var(--text-light)]">"{item.text}"</p>
                        <p className="text-right mt-4 font-bold text-[var(--primary-blue)]">- {item.name}</p>
                    </div>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const FinalCTA = () => (
    <Section bgColor="var(--dark-blue)">
        <div className="text-center text-white">
            <h2 className="text-4xl font-bold">Ready to Make Your Move?</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Join hundreds of students from around the world who have transformed their game with our online coaching. Your first step towards mastery is just a click away.</p>
            <InteractiveArea><button className="mt-8 bg-[var(--accent-red)] text-white font-bold py-4 px-10 rounded-lg text-xl transform hover:scale-105 transition-transform shadow-lg">Book Your Free Trial Class Now</button></InteractiveArea>
        </div>
    </Section>
);


// --- MAIN ONLINE COURSE PAGE COMPONENT ---
const OnlineCoursePage = () => {
    return (
        <main>
            <OnlineCourseHero />
            <WhyChooseOnline />
            <CourseCategories />
            <CurriculumStructure />
            <TechnologyTools />
            <SchedulesAndBatches />
            <EnrollmentAndPayment />
            <StudentSupport />
            <OnlineTestimonials testimonials={onlineTestimonials} />
            <FinalCTA />
        </main>
    );
};

export default OnlineCoursePage;
