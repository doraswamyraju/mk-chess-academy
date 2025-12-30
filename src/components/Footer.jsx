import React from 'react';
import InteractiveArea from './InteractiveArea';

// --- ICONS ---
const PhoneIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const MailIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>);
const MapPinIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>);
const YoutubeIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.5 17a24.12 24.12 0 0 1 0-10C2.5 6 7.5 4 12 4s9.5 2 9.5 3a24.12 24.12 0 0 1 0 10c0 1-4.5 3-9.5 3s-9.5-2-9.5-3Z"/><path d="m10 15 5-3-5-3z"/></svg>);
const InstagramIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>);

// --- LINK DATA ---
const QUICK_LINKS = [
  { name: 'About Us', path: '#about' },
  { name: 'Courses', path: '#courses' },
  { name: 'Contact', path: '#contact' },
  { name: 'Blog', path: '#blog' },
];

const LEGAL_LINKS = [
  { name: 'Privacy Policy', path: '#privacy' },
  { name: 'Terms of Service', path: '#terms' },
  { name: 'Refund Policy', path: '#refund' },
];

// --- HELPER COMPONENT for links with hover effect ---
const FooterLink = ({ href, children }) => (
    <a href={href} className="relative text-gray-400 hover:text-white transition-colors duration-300 group">
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--accent-red)] transition-all duration-300 group-hover:w-full"></span>
    </a>
);


const Footer = () => {
  return (
    <footer className="bg-[var(--dark-blue)] text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Academy Info & Socials */}
          <div className="md:col-span-2 lg:col-span-1">
            <img 
              src="https://i.postimg.cc/MMfFM1x5/logo.png" 
              alt="Modern Knight Chess Academy Logo" 
              className="h-16 mb-4 bg-white p-2 rounded-md"
            />
            <p className="text-gray-400">Mastering the Royal Game in Rajahmundry.</p>
            <div className="flex space-x-4 mt-6">
                <InteractiveArea>
                    <a href="#" aria-label="YouTube" className="text-gray-400 hover:text-white transition-transform hover:scale-110"><YoutubeIcon /></a>
                </InteractiveArea>
                 <InteractiveArea>
                    <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-transform hover:scale-110"><InstagramIcon /></a>
                </InteractiveArea>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map(link => (
                <li key={link.name}>
                  <InteractiveArea>
                    <FooterLink href={link.path}>{link.name}</FooterLink>
                  </InteractiveArea>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(link => (
                <li key={link.name}>
                  <InteractiveArea>
                    <FooterLink href={link.path}>{link.name}</FooterLink>
                  </InteractiveArea>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg text-white mb-4">Contact Us</h3>
            <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                    <MapPinIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-[var(--primary-blue)]"/>
                    <span className="text-gray-400">Manasa Hospital Rd, Danavai Peta, Rajamahendravaram, AP 533103</span>
                </li>
                 <li className="flex items-start">
                    <PhoneIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-[var(--primary-blue)]"/>
                    <div className="text-gray-400">
                        <p>+91-6281250967</p>
                        <p>+91-9885302468</p>
                    </div>
                </li>
                 <li className="flex items-start">
                    <MailIcon className="w-5 h-5 mr-3 mt-1 flex-shrink-0 text-[var(--primary-blue)]"/>
                    <div className="text-gray-400 break-all">
                        <p>karthikgopal04@gmail.com</p>
                        <p>chandramouli545454@gmail.com</p>
                    </div>
                </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-blue-800 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Modern Knight Chess Academy. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
