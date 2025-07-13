
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const BookOpenIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M21,5c-2.31,0-4,1.05-4,2.67V18.5c0,1.29,2.23,2,4,2s4-.7,4-2V7.67C25,6.05,23.31,5,21,5Zm-5,13.5V7.67C16.57,7.06,17.5,7,18,7s1.43,0,2,.67V18.5c-.57.62-1.5,1-2,1S16.57,19.12,16,18.5Z" opacity="0.1" />
    <path d="M19,2H8.37A3.37,3.37,0,0,0,5,5.37V18.63A3.37,3.37,0,0,0,8.37,22H19a1,1,0,0,0,1-1V3A1,1,0,0,0,19,2ZM8.37,4H18V15.57A3.5,3.5,0,0,0,15,14a3.5,3.5,0,0,0-3.5,3.5A3.5,3.5,0,0,0,15,21a3.5,3.5,0,0,0,3-1.43V20H8.37A1.37,1.37,0,0,1,7,18.63V5.37A1.37,1.37,0,0,1,8.37,4Z" />
  </svg>
);
