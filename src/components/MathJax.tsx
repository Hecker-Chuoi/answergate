
import React, { useEffect } from 'react';

interface MathJaxProps {
  formula: string;
}

declare global {
  interface Window {
    MathJax: any;
  }
}

const MathJax: React.FC<MathJaxProps> = ({ formula }) => {
  useEffect(() => {
    // Load MathJax script if not already loaded
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.id = 'MathJax-script';
      
      document.head.appendChild(script);
      
      script.onload = () => {
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true
          },
          options: {
            enableMenu: false
          }
        };
        
        window.MathJax.typeset();
      };
    } else {
      // If MathJax is already loaded, just typeset the current formula
      if (window.MathJax.typeset) {
        window.MathJax.typeset();
      }
    }
  }, [formula]);

  return <div dangerouslySetInnerHTML={{ __html: formula }} />;
};

export default MathJax;
