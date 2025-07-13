
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ImageIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19,3H5A3,3,0,0,0,2,6V18a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V6A3,3,0,0,0,19,3Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V6A1,1,0,0,1,5,5H19a1,1,0,0,1,1,1Z" />
    <path d="M13.29,10.29,10,14H15l-1.29-1.72a1,1,0,0,0-1.42,0Z" />
    <path d="M16.71,12.29,15,14.05V15a1,1,0,0,0,2,0v-.24A1,1,0,0,0,16.71,12.29Z" />
    <path d="M7.29,11.29,6,12.59V15a1,1,0,0,0,2,0V13.41A1,1,0,0,0,7.29,11.29Z" />
    <circle cx="8.5" cy="8.5" r="1.5" />
  </svg>
);
