
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const UsersIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <circle cx="12" cy="6" r="4" opacity=".1"/>
    <path d="M12,6a4,4,0,1,0,4,4A4,4,0,0,0,12,6Z"/>
    <path d="M18,21a1,1,0,0,0,1-1,5,5,0,0,0-10,0,1,1,0,0,0,1,1Z" opacity=".1"/>
    <path d="M20,14a5,5,0,0,0-5-5,1,1,0,0,0-1,1,3,3,0,0,1-4,0,1,1,0,0,0-1-1,5,5,0,0,0-5,5,1,1,0,0,0,1,1H6a3,3,0,0,1,6,0,3,3,0,0,1,6,0h1A1,1,0,0,0,20,14Z"/>
  </svg>
);
