
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const UserCircleIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2ZM12,6a3,3,0,1,1-3,3A3,3,0,0,1,12,6Zm0,14a7,7,0,0,1-7-7,2,2,0,0,1,2-2H17a2,2,0,0,1,2,2,7,7,0,0,1-7,7Z" />
    <circle cx="12" cy="9" r="3" opacity=".1"/>
    <path d="M12,13a2,2,0,0,0-2,2,7,7,0,0,0,14,0,2,2,0,0,0-2-2Z" opacity=".1"/>
  </svg>
);
