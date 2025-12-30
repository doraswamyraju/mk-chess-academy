import React, { useState } from 'react';
import InteractiveArea from '../components/InteractiveArea'; // Assuming this is in src/components

// --- PAGE-SPECIFIC ICONS ---
const PhoneIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const MailIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const MapPinIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>);
const ClockIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);

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

// --- CONTACT US PAGE SECTION COMPONENTS ---
const ContactHero = () => (
    <section className="relative text-white flex items-center justify-center text-center overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 w-full h-full bg-cover bg-center hero-parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop')` }} />
        <div className="absolute inset-0 bg-[var(--dark-blue)] bg-opacity-70"></div>
        <div className="relative z-10 p-6 container mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 leading-tight">Contact Us</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto">We're here to help you start your chess journey. Reach out with any questions or inquiries.</p>
        </div>
    </section>
);

const QuickContactDetails = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <div className="grid md:grid-cols-3 gap-8 text-center">
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><MapPinIcon className="w-12 h-12 text-[var(--accent-red)] mb-4 mx-auto" /><h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Our Address</h3><p className="text-[var(--text-light)]">Manasa Hospital Rd, Danavai Peta, Rajamahendravaram, AP 533103</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><PhoneIcon className="w-12 h-12 text-[var(--accent-red)] mb-4 mx-auto" /><h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Phone Numbers</h3><p className="text-[var(--text-light)]">+91-6281250967<br/>+91-9885302468</p></div></InteractiveArea>
            <InteractiveArea className="w-full"><div className="bg-white p-8 rounded-lg shadow-lg h-full transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"><MailIcon className="w-12 h-12 text-[var(--accent-red)] mb-4 mx-auto" /><h3 className="text-2xl font-bold text-[var(--dark-blue)] mb-3">Email Addresses</h3><p className="text-[var(--text-light)] break-all">karthikgopal04@gmail.com<br/>chandramouli545454@gmail.com</p></div></InteractiveArea>
        </div>
    </Section>
);

const MapAndForm = () => (
    <Section bgColor="var(--light-bg)" divider="waves" dividerColor="var(--white)">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
                <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-4">Find Us Here</h2>
                <p className="text-[var(--text-light)] mb-6">Our academy is conveniently located in the heart of Rajahmundry. Use the map below for directions.</p>
                <InteractiveArea onHoverType="queen" className="w-full">
                    <div className="rounded-lg shadow-xl overflow-hidden h-96 transform transition-transform duration-300 hover:scale-105">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.576918115591!2d81.785956!3d17.020521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37a4a9b2a6b2a1%3A0x8b6b6b3b3b3b3b3b!2sModern%20Knight%20Chess%20Academy!5e0!3m2!1sen!2sin!4v1678886400000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Modern Knight Chess Academy Location"
                        ></iframe>
                    </div>
                </InteractiveArea>
            </div>
            <div>
                <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-4">Send Us a Message</h2>
                <p className="text-[var(--text-light)] mb-6">Have a question? Fill out the form below, and we'll get back to you as soon as possible.</p>
                <form className="bg-white p-8 rounded-lg shadow-xl space-y-4">
                    <InteractiveArea className="w-full"><input type="text" placeholder="Your Name" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none transition-shadow" /></InteractiveArea>
                    <InteractiveArea className="w-full"><input type="email" placeholder="Your Email" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none transition-shadow" /></InteractiveArea>
                    <InteractiveArea className="w-full">
                        <select className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none transition-shadow bg-white">
                            <option>General Inquiry</option>
                            <option>Admissions</option>
                            <option>Online Courses</option>
                            <option>Technical Support</option>
                        </select>
                    </InteractiveArea>
                    <InteractiveArea className="w-full"><textarea placeholder="Your Message" rows="5" className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-[var(--primary-blue)] outline-none transition-shadow"></textarea></InteractiveArea>
                    <div className="flex items-center">
                        <input id="consent" type="checkbox" className="h-4 w-4 text-[var(--primary-blue)] focus:ring-[var(--primary-blue)] border-gray-300 rounded" />
                        <label htmlFor="consent" className="ml-2 block text-sm text-[var(--text-light)]">I agree to the Privacy Policy.</label>
                    </div>
                    <InteractiveArea><button type="submit" className="w-full bg-[var(--accent-red)] text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors">Send Message</button></InteractiveArea>
                </form>
            </div>
        </div>
    </Section>
);

const SupportAndHours = () => (
    <Section divider="slant" dividerColor="var(--light-bg)">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center">
                <h3 className="text-3xl font-bold text-[var(--dark-blue)] mb-4">Instant Support</h3>
                <p className="text-[var(--text-light)] mb-6">For quick questions, connect with us via WhatsApp.</p>
                <InteractiveArea>
                    <a href="#" className="inline-block bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg transform hover:scale-105 transition-transform">
                        Chat on WhatsApp
                    </a>
                </InteractiveArea>
            </div>
            <div className="text-center">
                <h3 className="text-3xl font-bold text-[var(--dark-blue)] mb-4">Office Hours</h3>
                <div className="flex items-center justify-center space-x-3 text-lg text-[var(--text-light)]">
                    <ClockIcon className="w-6 h-6"/>
                    <span>Monday - Saturday: 10:00 AM - 7:00 PM (IST)</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">(We provide flexible support for international students in different time zones)</p>
            </div>
        </div>
    </Section>
);

const SocialAndFAQ = () => {
    const contactFaqs = [
        { q: "What is your typical response time?", a: "We strive to respond to all inquiries within 24 business hours. For urgent matters, please call us directly." },
        { q: "Who will reply to my message?", a: "Your message will be directed to the most relevant department, whether it's our admissions team, a specific coach, or technical support." },
    ];
    const [openIndex, setOpenIndex] = useState(null);
    const toggleFAQ = index => { setOpenIndex(openIndex === index ? null : index); };
    
    return (
        <Section bgColor="var(--light-bg)">
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-6">Follow Our Journey</h2>
                    <div className="flex justify-start space-x-4">
                        <InteractiveArea><a href="#" className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">Icon FB</a></InteractiveArea>
                        <InteractiveArea><a href="#" className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">Icon IG</a></InteractiveArea>
                        <InteractiveArea><a href="#" className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">Icon YT</a></InteractiveArea>
                        <InteractiveArea><a href="#" className="p-3 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">Icon LI</a></InteractiveArea>
                    </div>
                </div>
                <div>
                    <h2 className="text-4xl font-bold text-[var(--dark-blue)] mb-6">Quick Questions</h2>
                     <div className="space-y-4">
                        {contactFaqs.map((faq, index) => (
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
            </div>
        </Section>
    );
};

// --- MAIN CONTACT US PAGE COMPONENT ---
const ContactUsPage = () => {
    return (
        <main>
            <ContactHero />
            <QuickContactDetails />
            <MapAndForm />
            <SupportAndHours />
            <SocialAndFAQ />
        </main>
    );
};

export default ContactUsPage;
