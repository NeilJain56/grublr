import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDate, findAvailableSnapshot } from '../utils/waybackApi';

interface ViewerState {
  domain: string;
  timestamp: string;
  archiveUrl: string;
}

function Viewer() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingNew, setLoadingNew] = useState(false);
  const [viewerState, setViewerState] = useState<ViewerState | null>(null);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    // Check if we have the required state data
    if (!location.state || 
        !location.state.domain || 
        !location.state.timestamp || 
        !location.state.archiveUrl) {
      // Redirect back to home if we don't have the required data
      navigate('/');
      return;
    }
    
    setViewerState(location.state as ViewerState);
    
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [location, navigate]);

  // Handle iframe load error
  const handleIframeError = () => {
    setIframeError(true);
    setIframeLoading(false);
  };

  // Handle iframe load success
  const handleIframeLoad = () => {
    setIframeLoading(false);
  };

  // Load a new random site directly
  const handleLoadNewSite = async () => {
    setLoadingNew(true);
    
    try {
      const result = await findAvailableSnapshot();
      
      if (result) {
        // Update the current state with new site data
        setLoading(true);
        setIframeError(false);
        setIframeLoading(true);
        
        // Update state with new site data
        setViewerState({
          domain: result.domain,
          timestamp: result.timestamp,
          archiveUrl: result.archiveUrl
        });
        
        // Update the browser history without navigating
        navigate('/viewer', { 
          state: { 
            domain: result.domain,
            timestamp: result.timestamp,
            archiveUrl: result.archiveUrl
          },
          replace: true
        });
        
        // Show loading state briefly
        setTimeout(() => {
          setLoading(false);
        }, 2500);
      } else {
        // If we couldn't find a snapshot, show error in iframe area
        setIframeError(true);
      }
    } catch (err) {
      console.error('Error finding new snapshot:', err);
      setIframeError(true);
    } finally {
      setLoadingNew(false);
    }
  };

  if (!viewerState) {
    return null; // Will redirect to home
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)]">
      {loading ? (
        <motion.div 
          className="flex flex-col items-center justify-center flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="time-portal-container">
            <div className="time-portal">
              <div className="time-portal-inner">
                <span className="text-5xl">📟</span>
              </div>
            </div>
            <div className="time-portal-rays"></div>
          </div>
          
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xl mb-2">Traveling back to {formatDate(viewerState.timestamp)}</p>
            <p className="text-lg text-indigo-400">Destination: {viewerState.domain}</p>
          </motion.div>
        </motion.div>
      ) : (
        <div className="flex flex-col h-[calc(100vh-80px)]">
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 bg-gray-900 backdrop-blur-sm z-10 border-b border-indigo-900/50 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3 mb-2 sm:mb-0">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            
            <div className="flex-1 text-center px-4 mb-2 sm:mb-0">
              <span className="text-sm font-medium text-gray-300">
                {viewerState.domain} • {formatDate(viewerState.timestamp)}
              </span>
            </div>
            
            <motion.button 
              onClick={handleLoadNewSite}
              disabled={loadingNew}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 
                rounded-md text-white font-medium 
                transition-all flex items-center space-x-2 text-sm
                hover:shadow-[0_0_15px_rgba(99,102,241,0.5)]
                disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loadingNew ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Load New Site</span>
                </>
              )}
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="flex-grow relative p-4 sm:p-6 bg-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Loading note banner */}
            {iframeLoading && !iframeError && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 bg-indigo-900/90 px-6 py-3 rounded-lg shadow-lg border border-indigo-700 max-w-md w-full text-center">
                <p className="text-sm text-white">
                  <span className="inline-block mr-2">⏳</span>
                  Loading archived content may take some time. Older sites might load slowly or incompletely.
                </p>
              </div>
            )}
            
            {iframeError ? (
              <div className="flex flex-col items-center justify-center h-full p-4 sm:p-8 text-center">
                <div className="text-5xl mb-6">⚠️</div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Content Unavailable</h2>
                <p className="text-gray-300 mb-6 max-w-lg">
                  The Wayback Machine couldn't load this page. This could be due to content restrictions or browser security policies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href={viewerState.archiveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-6 py-3 rounded-md transition-colors bg-indigo-600 hover:bg-indigo-700"
                  >
                    Open Directly in Wayback Machine
                  </a>
                  <button
                    onClick={handleLoadNewSite}
                    disabled={loadingNew}
                    className="px-6 py-3 rounded-md transition-colors bg-gray-700 hover:bg-gray-600 
                      disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loadingNew ? 'Loading...' : 'Try Another Site'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full w-full rounded-lg overflow-hidden border-2 border-indigo-800/50 shadow-[0_0_25px_rgba(79,70,229,0.15)]">
                <iframe 
                  src={viewerState.archiveUrl}
                  className="w-full h-full bg-white"
                  title={`${viewerState.domain} from ${formatDate(viewerState.timestamp)}`}
                  sandbox="allow-same-origin allow-scripts allow-forms"
                  onError={handleIframeError}
                  onLoad={handleIframeLoad}
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Viewer;