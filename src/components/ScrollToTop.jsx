import React, { useState, useEffect } from 'react';

const ScrollToTop = ({ page }) => {
  const [isVisible, setIsVisible] = useState(false);

  // This effect runs when the page changes, scrolling the window to the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // This effect adds a scroll listener to show/hide the button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    // Cleanup the listener on component unmount
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-[var(--accent-red)] text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition-opacity duration-300"
          aria-label="Go to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
