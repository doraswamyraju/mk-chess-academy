import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

const Layout = ({ children, setPage, page }) => {
  return (
    <div className="text-[var(--text-dark)]">
      <Header setPage={setPage} />
      <main>
        {children}
      </main>
      <Footer />
      <ScrollToTop page={page} />
    </div>
  );
};

export default Layout;
