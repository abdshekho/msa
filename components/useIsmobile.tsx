"use client";
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Handler to call on window resize
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};
