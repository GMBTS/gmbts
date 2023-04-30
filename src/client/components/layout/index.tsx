// import Footer from './footer';
// import Navbar from './navbar';

import { PropsWithChildren } from 'react';

import Navbar from './header';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <Navbar />

      <main>{children}</main>
      {/* <Footer /> */}
    </>
  );
};
export default Layout;
