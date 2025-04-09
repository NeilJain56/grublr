import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { findAvailableSnapshot } from '../utils/waybackApi';

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleExplore = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await findAvailableSnapshot();
      
      if (result) {
        // Navigate to viewer with the snapshot data
        navigate('/viewer', { 
          state: { 
            domain: result.domain,
            timestamp: result.timestamp,
            archiveUrl: result.archiveUrl
          } 
        });
      } else {
        setError("Couldn't open a time portal. Try again!");
      }
    } catch (err) {
      console.error('Error finding snapshot:', err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] relative overflow-hidden px-4 sm:px-6">
      {/* Background animation */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-scanlines"></div>
        <div className="absolute inset-0 bg-crt-flicker"></div>
      </div>
      
      <motion.div 
        className="text-center z-10 w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h1 
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 glitch"
          data-text="📟 Grublr"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          📟 Grublr
        </motion.h1>
        
        <motion.p 
          className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Explore random snapshots of the Internet's golden years.
        </motion.p>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={handleExplore}
            disabled={loading}
            className="relative px-8 sm:px-10 py-4 sm:py-5 rounded-lg text-lg sm:text-xl font-medium transition-all 
              bg-gradient-to-r from-indigo-600 to-purple-600 text-white
              hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]
              disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Time Portal...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Take Me Back
              </span>
            )}
          </button>
        </motion.div>
        
        {error && (
          <motion.div 
            className="mt-6 text-red-500 bg-red-900/30 px-4 py-3 rounded-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Home;