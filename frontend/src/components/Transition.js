import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const PageTransition = () => {
  const location = useLocation();
  const [transitioning, setTransitioning] = React.useState(false);
  
  useEffect(() => {
    setTransitioning(true);
    const timer = setTimeout(() => {
      setTransitioning(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return transitioning ? (
    <motion.div
      className="page-transition"
      initial={{ scaleY: 0, transformOrigin: "bottom" }}
      animate={{ 
        scaleY: [0, 1, 1, 0],
        transformOrigin: ["bottom", "bottom", "top", "top"]
      }}
      transition={{ 
        duration: 0.8, 
        times: [0, 0.4, 0.6, 1],
        ease: "easeInOut" 
      }}
    />
  ) : null;
};

export default PageTransition;