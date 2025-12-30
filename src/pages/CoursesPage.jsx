import React from 'react';
import InteractiveArea from '../components/InteractiveArea'; // Assuming this is in src/components

// --- PAGE-SPECIFIC ICONS ---
const CheckCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>);
const DownloadCloudIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M8 17l4 4 4-4"/><path d="M12 12v9"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/></svg>);


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

// --- COURSES PAGE SECTION COMPONENTS ---
const CoursesHero = () => (
    <section className="relative text-white flex items-center justify-center text-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2070&auto=format&fit=crop')` }} />
        <div className="absolute inset-0 bg-[var(--dark-blue)] bg-opacity-70"></div>
        <div className="relative z-10 p-6 container mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">Courses & Programs</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">From your first move to your masterstroke, find the perfect program to unlock your potential. We offer a comprehensive range of chess coaching options for all ages and skill levels, both online and in-person, for students in India and across the globe.</p>
        </div>
    </section>
);

const CourseSelector = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Find Your Perfect Course</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-2 md:grid-cols-5 gap-4">
            <InteractiveArea className="w-full"><select className="w-full p-3 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"><option>By Level</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></InteractiveArea>
            <InteractiveArea className="w-full"><select className="w-full p-3 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"><option>By Age</option><option>Children</option><option>Teens</option><option>Adults</option></select></InteractiveArea>
            <InteractiveArea className="w-full"><select className="w-full p-3 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"><option>By Location</option><option>Online</option><option>In-Person</option></select></InteractiveArea>
            <InteractiveArea className="w-full"><select className="w-full p-3 rounded-md border border-gray-300 bg-white focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"><option>By Nationality</option><option>Indian</option><option>International</option></select></InteractiveArea>
            <InteractiveArea><button className="w-full bg-[var(--accent-red)] text-white font-bold p-3 rounded-md hover:bg-opacity-90 transition-colors">Filter Courses</button></InteractiveArea>
        </div>
    </Section>
);

const IndianStudentCourses = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-4">For Indian Students</h2>
        <p className="text-center text-[var(--text-light)] max-w-3xl mx-auto mb-12">Our curriculum is designed to build a strong foundation and prepare students for success in the vibrant Indian chess circuit.</p>
        <div className="grid md:grid-cols-3 gap-8">
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Beginners</h3><p className="text-[var(--text-light)]">Master the fundamentals, from piece movement to basic checkmates.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Intermediate</h3><p className="text-[var(--text-light)]">Dive into opening theory, middlegame strategy, and essential endgames.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Advanced</h3><p className="text-[var(--text-light)]">Refine your skills with advanced tactics and tournament preparation.</p></div></InteractiveArea>
        </div>
    </Section>
);

const ForeignStudentCourses = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-4">For Foreign Students</h2>
        <p className="text-center text-[var(--text-light)] max-w-3xl mx-auto mb-12">We proudly offer world-class coaching to a global community with features tailored for international learners.</p>
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"><h3 className="font-semibold text-lg text-[var(--primary-blue)]">Flexible Scheduling</h3></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"><h3 className="font-semibold text-lg text-[var(--primary-blue)]">Timezone Support</h3></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"><h3 className="font-semibold text-lg text-[var(--primary-blue)]">Recorded Sessions</h3></div></InteractiveArea>
        </div>
    </Section>
);

const ProgramTypes = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <div className="grid md:grid-cols-2 gap-12">
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-4">Online Programs</h2><p className="text-[var(--text-light)] mb-4">Learn from anywhere with our interactive online classes. We provide live sessions with our master coaches, access to a digital library of resources, and a vibrant online community.</p><a href="#" className="font-bold text-[var(--accent-red)] hover:underline">Learn More &rarr;</a></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-4">Offline Programs</h2><p className="text-[var(--text-light)] mb-4">Experience the benefits of in-person coaching at our state-of-the-art facility in Rajahmundry. Benefit from direct interaction, over-the-board practice, and a focused learning environment.</p><a href="#" className="font-bold text-[var(--accent-red)] hover:underline">Explore In-Person Classes &rarr;</a></div></InteractiveArea>
        </div>
    </Section>
);

const SpecializedCourses = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Specialized Courses & Events</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md h-full hover:shadow-xl transition-shadow duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Workshops & Bootcamps</h3><p className="text-sm text-[var(--text-light)] mt-2">Intensive short-term programs focused on specific skills.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md h-full hover:shadow-xl transition-shadow duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Tournament Preparation</h3><p className="text-sm text-[var(--text-light)] mt-2">Dedicated courses for competitive players aiming for the top.</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-6 rounded-lg shadow-md h-full hover:shadow-xl transition-shadow duration-300"><h3 className="font-bold text-xl text-[var(--primary-blue)]">Thematic Modules</h3><p className="text-sm text-[var(--text-light)] mt-2">Deep dives into endgames, tactics, and opening repertoires.</p></div></InteractiveArea>
        </div>
    </Section>
);

const SyllabusAndMethodology = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-6">Syllabus & Curriculum</h2>
                <p className="text-[var(--text-light)] mb-4">Our curriculum is carefully crafted to ensure steady progress. Each level has a detailed syllabus covering all aspects of the game.</p>
                <InteractiveArea><a href="#" className="flex items-center space-x-2 font-bold text-[var(--accent-red)] hover:underline"><DownloadCloudIcon className="w-6 h-6"/><span>Download Beginner Syllabus</span></a></InteractiveArea>
            </div>
            <div>
                <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-6">Teaching Methodology</h2>
                <ul className="list-disc list-inside space-y-2 text-[var(--text-light)]">
                    <li>Interactive live classes with Q&A sessions.</li>
                    <li>Personalized homework and game analysis.</li>
                    <li>Regular mock tournaments to build competitive skills.</li>
                    <li>Use of modern chess software for performance tracking.</li>
                </ul>
            </div>
        </div>
    </Section>
);

const FeesAndEnrollment = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-6">Fees & Payment</h2>
                <p className="text-[var(--text-light)] mb-4">We offer transparent and flexible payment options for all our courses. Special discounts are available for siblings and long-term commitments.</p>
                <p className="font-semibold">Payment Methods: UPI, Cards, Bank Transfer, PayPal (International)</p>
            </div>
            <div>
                <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-6">How to Enroll</h2>
                <ol className="list-decimal list-inside space-y-2 text-[var(--text-light)]">
                    <li>Choose your desired course and batch.</li>
                    <li>Fill out our simple online registration form.</li>
                    <li>Complete the payment through our secure gateway.</li>
                    <li>Receive your confirmation and get ready to play!</li>
                </ol>
            </div>
        </div>
    </Section>
);

const CourseTestimonials = () => (
    <Section bgColor="var(--light-bg)">
        <h2 className="text-4xl font-bold text-center text-[var(--dark-blue)] mb-12">Success Stories from Our Courses</h2>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl text-center">
            <p className="italic text-lg text-[var(--text-light)]">"The Advanced course completely changed how I approach tournaments. The psychological preparation was a game-changer!"</p>
            <p className="font-bold text-[var(--primary-blue)] mt-4">- A Former Student</p>
        </div>
    </Section>
);

const FinalCTA = () => (
    <Section bgColor="var(--dark-blue)">
        <div className="text-center text-white">
            <h2 className="text-4xl font-bold">Ready to Make Your Move?</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Your first step towards mastery is just a click away. Book a free demo class to experience our coaching firsthand.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                <InteractiveArea><button className="bg-[var(--accent-red)] text-white font-bold py-3 px-8 rounded-md text-lg transform hover:scale-105 transition-transform">Enroll Now</button></InteractiveArea>
                <InteractiveArea><button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-md text-lg hover:bg-white hover:text-[var(--dark-blue)] transition-colors">Book a Free Demo</button></InteractiveArea>
            </div>
        </div>
    </Section>
);

// --- MAIN COURSES PAGE COMPONENT ---
const CoursesPage = () => {
    return (
        <main>
            <CoursesHero />
            <CourseSelector />
            <IndianStudentCourses />
            <ForeignStudentCourses />
            <ProgramTypes />
            <SpecializedCourses />
            <SyllabusAndMethodology />
            <FeesAndEnrollment />
            <CourseTestimonials />
            <FinalCTA />
        </main>
    );
};

export default CoursesPage;
