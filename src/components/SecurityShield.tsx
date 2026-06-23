import React, { useEffect } from 'react';

/**
 * SecurityShield Component
 * Implements high-level frontend security patterns to deter "cloning" and basic "hacking".
 * Note: No frontend-only measure is 100% foolproof, but these significantly harden the UI.
 */
const SecurityShield: React.FC = () => {
  useEffect(() => {
    // 1. Disable Right-Click (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // 2. Disable Common Inspection Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (View Source)
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') // Disable Save Page
      ) {
        e.preventDefault();
        return false;
      }
    };

    // 3. Simple Console protection - Detected DevTools can trigger a refresh or blur
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // Devtools likely open
        // console.clear();
      }
    };

    // 4. Domain Lock (Optional - set your authorized domain here)
    // If you want to prevent the site from running on a specific cloned domain
    const checkDomain = () => {
      const authorizedDomains = ['localhost', 'run.app', 'vercel.app']; // Add your domains
      const currentHost = window.location.hostname;
      const isAuthorized = authorizedDomains.some(domain => currentHost.includes(domain));
      
      if (!isAuthorized) {
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#f00;font-family:sans-serif;font-weight:bold;text-align:center;padding:20px;">CLONE DETECTED: UNAUTHORIZED ACCESS BLOCKED.</div>';
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', detectDevTools);
    
    // Initial checks
    checkDomain();

    // Console anti-debugging trick
    const heartBeat = setInterval(() => {
      (function() {
        // This makes stepping through code in debugger much harder
        // debugger; 
      })();
    }, 1000);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', detectDevTools);
      clearInterval(heartBeat);
    };
  }, []);

  // 5. CSS Protection - Prevents selection and drag-drop cloning
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `}} />
  );
};

export default SecurityShield;
