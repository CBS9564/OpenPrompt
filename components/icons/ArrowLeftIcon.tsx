
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ArrowLeftIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M21,11H6.83l3.58-3.59a2,2,0,0,0-2.82-2.82l-6.2,6.19a.52.52,0,0,0-.1.15.54.54,0,0,0-.1.2,1,1,0,0,0,0,.84.54.54,0,0,0,.1.2.52.52,0,0,0,.1.15l6.2,6.19a2,2,0,0,0,2.82-2.82L6.83,13H21a1,1,0,0,0,0-2Z" />
  </svg>
);
