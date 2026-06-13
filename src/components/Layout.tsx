import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './website/Navbar';
import { Footer } from './website/Footer';

export function Layout() {
  const location = useLocation();

  const exactHidePaths = ['/'];
  const prefixHidePaths = [
    '/booking',
    '/tasks',
    '/app',
    '/profile',
    '/public-profile',
    '/auth',
    '/calendar',
    '/analytics',
  ];

  const showLayoutElements =
    !exactHidePaths.includes(location.pathname) &&
    !prefixHidePaths.some(path => location.pathname.startsWith(path));

  return (
    <>
      {showLayoutElements && <Navbar />}
      
      <main>
        <Outlet />
      </main>
      
      {showLayoutElements && <Footer />}
    </>
  );
}