import { ReactNode } from 'react';
import Header from './Header';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="container mx-auto px-4">
        {children}
      </main>
    </div>
  );
}

export default Layout;