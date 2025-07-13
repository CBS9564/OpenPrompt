
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const LinkIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M8.47,16.47a4,4,0,0,1,0-5.66l4-4a4,4,0,1,1,5.66,5.66l-1.21,1.21a1,1,0,0,1-1.42-1.42L16.7,11.08a2,2,0,1,0-2.83-2.83l-4,4a2,2,0,0,0,2.83,2.83l1.21-1.21a1,1,0,0,1,1.42,1.42L14.12,16.5a4,4,0,0,1-5.65.17Z" />
    <path d="M9.88,8.29,8.67,9.5a2,2,0,1,0,2.83,2.83l4-4a2,2,0,0,0-2.83-2.83L11.47,6.7a1,1,0,0,1-1.42-1.42L11.27,4.07a4,4,0,0,1,5.66,5.66l-4,4a4,4,0,0,1-5.66-5.66L8.48,6.88A1,1,0,1,1,9.88,8.29Z" />
  </svg>
);
