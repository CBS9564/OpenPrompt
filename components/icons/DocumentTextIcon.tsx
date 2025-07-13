
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const DocumentTextIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19.71,9.29l-4-4A1,1,0,0,0,15,5H8A3,3,0,0,0,5,8v8a3,3,0,0,0,3,3H16a3,3,0,0,0,3-3V10A1,1,0,0,0,19.71,9.29ZM16,16H8a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2Zm0-4H8a1,1,0,0,1,0-2h8a1,1,0,0,1,0,2Zm-1-4V7h2.59L15,9.59Z" />
  </svg>
);
