// hooks/useScreenWidth.js
import { useState, useEffect } from 'react';

function useScreenWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    // Resize handler function
    const handleResize = () => setWidth(window.innerWidth);
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array ensures it runs only once
  
  return width;
}

export default useScreenWidth