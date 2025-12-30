import React, { useState, useEffect } from 'react';
import InteractiveArea from './InteractiveArea';

const NAV_LINKS = ['Home', 'About', 'Courses', 'Coaches', 'Admissions', 'Blog', 'Contact'];

// SVG Icon for the menu button
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

// SVG Icon for the close button
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Header = ({ setPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scrolling when the mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleNavClick = (page) => {
    setPage(page);
    setIsMenuOpen(false); // Close menu on navigation
  };

  return (
    <>
      <header className="bg-white backdrop-blur-sm bg-opacity-80 text-[var(--dark-blue)] p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <InteractiveArea onHoverType="queen">
            <a 
              href="#home" 
              onClick={(e) => { e.preventDefault(); handleNavClick('Home'); }} 
              aria-label="Modern Knight Chess Academy Home"
            >
              <img 
                src="https://i.postimg.cc/MMfFM1x5/logo.png" 
                alt="Modern Knight Chess Academy Logo" 
                className="h-14 object-contain" 
              />
            </a>
          </InteractiveArea>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-5 text-md font-medium">
          {NAV_LINKS.map(item => (
            <InteractiveArea key={item}>
              <a 
                href={`#${item.toLowerCase()}`} 
                onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
                className="hover:text-[var(--accent-red)] transition duration-300 px-2 py-1"
              >
                {item}
              </a>
            </InteractiveArea>
          ))}
        </nav>

        {/* Desktop Enroll Button */}
        <div className="hidden md:block">
            <InteractiveArea>
              <button 
                onClick={() => handleNavClick('Admissions')}
                className="bg-[var(--accent-red)] hover:bg-opacity-90 text-white font-bold py-2 px-5 rounded-md transition duration-300 transform hover:scale-105 shadow-sm"
              >
                  Enroll Now
              </button>
            </InteractiveArea>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
            <InteractiveArea>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
                    <MenuIcon />
                </button>
            </InteractiveArea>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <div className="flex justify-end p-4">
               <InteractiveArea>
                    <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                        <CloseIcon />
                    </button>
                </InteractiveArea>
          </div>
          <nav className="flex flex-col items-center justify-center h-full space-y-8 text-2xl font-bold">
              {NAV_LINKS.map(item => (
                  <InteractiveArea key={item}>
                      <a 
                          href={`#${item.toLowerCase()}`} 
                          onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
                          className="hover:text-[var(--accent-red)] transition duration-300"
                      >
                          {item}
                      </a>
                  </InteractiveArea>
              ))}
               <InteractiveArea>
                  <button 
                    onClick={() => handleNavClick('Admissions')}
                    className="bg-[var(--accent-red)] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-md transition duration-300 transform hover:scale-105 shadow-sm"
                  >
                      Enroll Now
                  </button>
              </InteractiveArea>
          </nav>
      </div>
    </>
  );
};

export default Header;
