import React from 'react';
import Footer from '../components/Footer.tsx';

const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ flexGrow: 1 }}>{children}</div>
      <Footer />
    </div>
  );
};

export default PageLayout;
