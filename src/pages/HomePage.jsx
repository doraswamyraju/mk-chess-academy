import React, { useState, useEffect } from 'react';
import InteractiveArea from '../components/InteractiveArea';

// --- PAGE-SPECIFIC ICONS ---
const StarIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
const QuoteIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>);
const ChevronLeftIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRightIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"></polyline></svg>);


// --- PAGE-SPECIFIC DATA ---
const founders = [
    { name: 'G Hema Chandra Mouli', titles: ['Senior National Arbiter', 'Chess in Schools Trainer', 'National Instructor', 'Arena Grand Master'], rating: 1987, image: 'https://placehold.co/400x400/9ca3af/FFFFFF?text=G.H.C.+Mouli' },
    { name: 'G Karthik Gopal', titles: ['National Instructor', 'Arena Grand Master', 'FIDE Arbiter', 'Chess in Schools Trainer'], rating: 1864, image: 'https://placehold.co/400x400/a1a1aa/FFFFFF?text=G.K.+Gopal' },
];
// ... (rest of the page data remains the same)
const achievementImages = [
    'https://placehold.co/800x500/1A237E/FFFFFF?text=State+Championship+Winner',
    'https://placehold.co/800x500/2962FF/FFFFFF?text=National+Tournament+Participants',
    'https://placehold.co/800x500/FF3D00/FFFFFF?text=Trophy+Ceremony',
    'https://placehold.co/800x500/424242/FFFFFF?text=Team+Event+Glory',
    'https://placehold.co/800x500/1E88E5/FFFFFF?text=Junior+Cup+2024',
    'https://placehold.co/800x500/D81B60/FFFFFF?text=Online+Blitz+Winner',
    'https://placehold.co/800x500/004D40/FFFFFF?text=International+Exposure',
];
const googleReviews = [
    { name: "Srinivasarao R.", rating: 5, text: "Very good chess academy... My son is improving his game very well... Individual attention to each and every student... Very good coaching by Karthik sir and Mouli sir..." },
    { name: "Lokesh", rating: 5, text: "Best chess academy in Rajahmundry. They will teach from basics to advanced. Both the coaches are very friendly." },
    { name: "MOHAN", rating: 5, text: "Good coaching and good environment to learn chess. My children are very interested to go to the academy." },
    { name: "Prasad G", rating: 5, text: "Excellent coaching for all age groups. Both coaches are FIDE rated players. I strongly recommend this academy." },
];
const testimonials = [
    { name: "Parent of Annanya Ch", image: "https://placehold.co/150x150/E3F2FD/1A237E?text=Parent", text: "The focused training and tournament preparation at Modern Knight have been instrumental in our daughter's success. The coaches don't just teach moves; they build confidence and strategic thinking. We've seen tremendous growth in her game and her personality since she joined. We couldn't be happier with our decision." },
];
const courses = [
    { title: "Beginner's Gambit", level: "For new players", features: ["Fundamentals & Rules", "Basic Tactics", "Opening Principles", "Fun-based Learning"] },
    { title: "Intermediate Strategy", level: "For rated players < 1400", features: ["Positional Play", "Advanced Tactics", "Middlegame Planning", "Endgame Techniques"] },
    { title: "Advanced Mastery", level: "For rated players > 1400", features: ["In-depth Opening Theory", "Complex Calculations", "Tournament Psychology", "Personalized Coaching"] },
];
const blogPosts = [
    { image: 'https://placehold.co/600x400/FF3D00/FFFFFF?text=Strategy', category: 'Strategy', title: 'The Power of the Pawn', excerpt: 'Discover why the humble pawn is one of the most powerful pieces on the board and how to leverage its strength.' },
    { image: 'https://placehold.co/600x400/2962FF/FFFFFF?text=History', category: 'History', title: 'The Immortal Game: A Look Back', excerpt: 'Revisit one of the most famous chess games ever played, a masterpiece of romantic-era attacking chess.' },
    { image: 'https://placehold.co/600x400/1A237E/FFFFFF?text=News', category: 'Academy News', title: 'Our Student Wins State U-12 Title!', excerpt: 'We are proud to announce that our student has secured the first place in the recent state-level championship.' },
];
const faqs = [
    { q: "What is the minimum age to join?", a: "We welcome students from the age of 5. Our curriculum is tailored to different age groups and skill levels, ensuring a suitable learning environment for everyone." },
    { q: "Do I need any prior chess experience?", a: "Not at all! We have batches for absolute beginners as well as for advanced players. We will assess your level and place you in the appropriate group." },
    { q: "What are the timings for the classes?", a: "We offer flexible timings, including weekday evenings and weekend batches, for both online and offline classes. Please contact us for the detailed schedule." },
];


// --- REUSABLE HELPER COMPONENTS ---
const Section = ({ children, bgColor = 'var(--white)', divider = null, dividerColor = 'var(--light-bg)' }) => (
    <section className="relative py-16 md:py-20" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-4 sm:px-6 z-10 relative">{children}</div>
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


// --- HOMEPAGE SECTION COMPONENTS ---

const sliderData = [
    { image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=2071&auto=format&fit=crop', title: 'Become a Chess Champion', subtitle: 'Train with International Rated Players at Modern Knight Chess Academy.' },
    { image: 'https://images.unsplash.com/photo-1580541832626-2a7131ee809f?q=80&w=2070&auto=format&fit=crop', title: 'Unlock Your Potential', subtitle: 'Comprehensive coaching for all ages and skill levels.' },
    { image: 'https://images.unsplash.com/photo-1610623378544-85234b115e5b?q=80&w=1974&auto=format&fit=crop', title: 'Join a Winning Community', subtitle: 'Learn, compete, and grow with fellow chess enthusiasts.' },
    { image: 'https://images.unsplash.com/photo-1542744095-291d1f67b221?q=80&w=2070&auto=format&fit=crop', title: 'Your First Move to Mastery', subtitle: 'Start your journey with a free demo class today.' },
];

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[85vh] text-white flex items-center justify-center overflow-hidden">
            {/* Background Slider */}
            {sliderData.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundImage: `url('${slide.image}')` }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
            
            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-8 items-center">
                {/* Text Content */}
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

                {/* Contact Form */}
                <div className="w-full max-w-md mx-auto md:mx-0">
                    <InteractiveArea className="w-full">
                        <form className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-lg shadow-2xl space-y-4 border border-white/20">
                            <h3 className="text-2xl font-bold text-white text-center mb-4">Request a Free Demo</h3>
                            <div>
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input type="text" id="name" placeholder="Your Name" className="w-full p-3 rounded-md border-0 bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[var(--accent-red)] outline-none" />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input type="email" id="email" placeholder="Your Email" className="w-full p-3 rounded-md border-0 bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[var(--accent-red)] outline-none" />
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea id="message" placeholder="Your Message (Optional)" rows="3" className="w-full p-3 rounded-md border-0 bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-[var(--accent-red)] outline-none"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-[var(--accent-red)] text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-transform hover:scale-105">Send Inquiry</button>
                        </form>
                    </InteractiveArea>
                </div>
            </div>

            {/* Slider Navigation */}
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><ChevronLeftIcon /></button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors"><ChevronRightIcon /></button>

            {/* Slider Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
                {sliderData.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};


const InstituteSnapshot = () => (
    <Section bgColor="var(--white)" divider="slant" dividerColor="var(--light-bg)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">Meet Our Master Founders</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">Led by a team of certified and decorated chess professionals dedicated to elevating your game.</p></div>
        <div className="flex flex-wrap -mx-4 justify-center items-stretch gap-y-8">
            {founders.map(founder => (
                 <div key={founder.name} className="w-full md:w-1/2 px-4">
                    <InteractiveArea onHoverType="queen" className="w-full h-full">
                        <div className="bg-gray-50 rounded-lg shadow-lg p-8 text-center h-full border-b-4 border-[var(--primary-blue)] flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <img src={founder.image} alt={founder.name} className="w-32 h-32 rounded-full mx-auto mb-4 ring-4 ring-[var(--primary-blue)] p-1" />
                            <h3 className="text-2xl font-bold text-[var(--dark-blue)] font-sans">{founder.name}</h3>
                            <p className="font-bold text-lg text-[var(--primary-blue)]">Int'l Rating: {founder.rating}</p>
                            <div className="flex flex-wrap justify-center gap-2 mt-4">{founder.titles.map(title => (<span key={title} className="bg-blue-100 text-[var(--primary-blue)] text-xs font-semibold px-3 py-1 rounded-full">{title}</span>))}</div>
                        </div>
                    </InteractiveArea>
                </div>
            ))}
        </div>
    </Section>
);

const CoursesSection = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">Our Courses</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">Structured programs designed to take your skills to the next level, from beginner to advanced.</p></div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {courses.map(course => (
                <InteractiveArea key={course.title} className="w-full h-full">
                    <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300 border-b-4 border-[var(--accent-red)]">
                        <h3 className="text-2xl font-bold text-center text-[var(--dark-blue)]">{course.title}</h3>
                        <p className="text-center text-[var(--text-light)] mb-6">{course.level}</p>
                        <ul className="space-y-3 text-[var(--text-dark)] flex-grow">{course.features.map(feature => <li key={feature} className="flex items-center"><StarIcon className="w-5 h-5 mr-3 text-[var(--accent-red)]"/><span>{feature}</span></li>)}</ul>
                        <button className="mt-8 bg-[var(--primary-blue)] text-white font-bold py-2 px-6 rounded-md w-full hover:bg-opacity-90 transition-colors">Learn More</button>
                    </div>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const GallerySection = () => (
    <Section bgColor="var(--white)" divider="slant" dividerColor="var(--light-bg)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">Glimpses of Glory</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">A snapshot of our students' proudest moments and victories.</p></div>
        <div className="relative w-full overflow-hidden mask-image-lr">
            <div className="flex scrolling-wrapper">
                {[...achievementImages, ...achievementImages].map((src, index) => (
                    <div key={index} className="flex-shrink-0 w-[300px] md:w-[400px] mx-4">
                        <img src={src} className="w-full h-full object-cover rounded-lg shadow-xl" alt={`Achievement ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    </Section>
);

const StarRating = ({ rating }) => (<div className="flex justify-center mb-4">{[...Array(5)].map((_, i) => <StarIcon key={i} className={`w-6 h-6 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}/>)}</div>);

const GoogleReviews = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">What Our Students Say</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">Direct feedback from our students and parents on Google.</p></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {googleReviews.map((review, index) => (
                <InteractiveArea key={index} className="w-full h-full">
                    <div className="bg-white rounded-lg shadow-lg p-6 h-full flex flex-col text-center transform hover:-translate-y-2 transition-transform duration-300">
                        <QuoteIcon className="w-8 h-8 mx-auto mb-4 text-gray-200"/>
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

const TestimonialsSection = () => (
    <Section bgColor="var(--white)" divider="slant" dividerColor="var(--light-bg)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">A Champion's Journey</h2></div>
        {testimonials.map(item => (
            <InteractiveArea key={item.name} onHoverType="queen" className="w-full">
                <div className="max-w-4xl mx-auto bg-[var(--dark-blue)] text-white rounded-lg shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <img src={item.image} alt={item.name} className="w-40 h-40 rounded-full flex-shrink-0 ring-4 ring-[var(--accent-red)] p-1"/>
                    <div>
                        <p className="text-xl italic text-gray-300 leading-relaxed">"{item.text}"</p>
                        <p className="text-right mt-4 font-bold text-lg text-white">- {item.name}</p>
                    </div>
                </div>
            </InteractiveArea>
        ))}
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
                    <p><strong>Email:</strong> karthikgopal04@gmail.com</p>
                </div>
            </div>
            <form className="space-y-4">
                <InteractiveArea className="w-full"><input type="text" placeholder="Your Name" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none" /></InteractiveArea>
                <InteractiveArea className="w-full"><input type="email" placeholder="Your Email" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none" /></InteractiveArea>
                <InteractiveArea className="w-full"><textarea placeholder="Your Message" rows="5" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none"></textarea></InteractiveArea>
                <InteractiveArea><button type="submit" className="w-full bg-[var(--accent-red)] text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors">Send Message</button></InteractiveArea>
            </form>
        </div>
    </Section>
);

const BlogSection = () => (
    <Section bgColor="var(--white)" divider="slant" dividerColor="var(--light-bg)">
        <div className="text-center mb-16"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">From Our Blog</h2><p className="text-[var(--text-light)] mt-4 max-w-3xl mx-auto text-lg">Insights, strategies, and news from the world of chess.</p></div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
                <InteractiveArea key={post.title} className="w-full h-full">
                    <div className="bg-gray-50 rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                        <div className="p-6 flex flex-col flex-grow">
                            <p className="text-sm font-semibold text-[var(--accent-red)] mb-2">{post.category}</p>
                            <h3 className="text-xl font-bold text-[var(--dark-blue)] mb-3 flex-grow">{post.title}</h3>
                            <p className="text-[var(--text-light)] mb-4">{post.excerpt}</p>
                            <a href="#" className="font-bold text-[var(--primary-blue)] hover:underline mt-auto">Read More &rarr;</a>
                        </div>
                    </div>
                </InteractiveArea>
            ))}
        </div>
    </Section>
);

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const toggleFAQ = index => { setOpenIndex(openIndex === index ? null : index); };
    return (
        <Section bgColor="var(--light-bg)">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-12"><h2 className="text-4xl font-bold text-[var(--dark-blue)]">Frequently Asked Questions</h2></div>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <InteractiveArea key={index} className="w-full">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                                <button onClick={() => toggleFAQ(index)} className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg text-[var(--dark-blue)]">
                                    <span>{faq.q}</span>
                                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center text-[var(--primary-blue)]">
                                        <span className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>+</span>
                                    </div>
                                </button>
                                <div className={`transition-all duration-500 ease-in-out ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <p className="px-5 pb-5 text-[var(--text-light)]">{faq.a}</p>
                                </div>
                            </div>
                        </InteractiveArea>
                    ))}
                </div>
            </div>
        </Section>
    );
};


// --- MAIN HOMEPAGE COMPONENT ---
const HomePage = () => {
    return (
        <main>
            <HeroSection />
            <InstituteSnapshot />
            <CoursesSection />
            <GallerySection />
            <GoogleReviews />
            <TestimonialsSection />
            <ContactSection />
            <BlogSection />
            <FAQ />
        </main>
    );
};

export default HomePage;
