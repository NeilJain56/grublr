    import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const isViewerPage = location.pathname === '/viewer';

  return (
    <header className="py-4 px-6 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <span className="mr-2">📟</span>
          <span>Grublr</span>
        </Link>
        
        {!isViewerPage && (
          <div className="text-xs text-gray-400">
            Surf the Internet's Past
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;