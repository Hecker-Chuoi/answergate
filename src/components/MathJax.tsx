
import React, { useEffect, useRef } from 'react';

interface MathJaxProps {
  formula: string;
}

declare global {
  interface Window {
    MathJax: any;
  }
}

const MathJax: React.FC<MathJaxProps> = ({ formula }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load MathJax script if not already loaded
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.id = 'MathJax-script';
      
      // Configure MathJax before loading the script
      window.MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true
        },
        options: {
          enableMenu: false
        },
        startup: {
          pageReady: () => {
            console.log('MathJax is ready');
            // Initial typeset is handled by MathJax itself after loading
          }
        }
      };
      
      document.head.appendChild(script);
    } else if (window.MathJax.typesetPromise) {
      // If MathJax is already loaded and properly initialized with typesetPromise
      try {
        window.MathJax.typesetPromise([containerRef.current]).catch((err: any) => {
          console.error('MathJax typesetting failed:', err);
        });
      } catch (error) {
        console.error('Error calling MathJax.typesetPromise:', error);
      }
    } else if (window.MathJax.typeset) {
      // Fallback if typesetPromise is not available but typeset is
      try {
        window.MathJax.typeset([containerRef.current]);
      } catch (error) {
        console.error('Error calling MathJax.typeset:', error);
      }
    } else {
      console.warn('MathJax is not properly initialized yet');
    }
  }, [formula]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: formula }} />;
};

export default MathJax;
