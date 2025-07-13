
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const OllamaIcon: React.FC<IconProps> = (props) => (
  <svg 
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
  >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.243 15.243c-1.44-1.44-2.825-2.184-3.534-2.184s-2.094.74-3.534 2.184c-1.028 1.028-2.586.428-2.586-1.036V9.464c0-1.464 1.558-2.064 2.586-1.036c1.44 1.44 2.825 2.184 3.534 2.184s2.094-.74 3.534-2.184c1.028-1.028 2.586-.428 2.586 1.036v4.743c0 1.464-1.558 2.064-2.586 1.036z" />
  </svg>
);
