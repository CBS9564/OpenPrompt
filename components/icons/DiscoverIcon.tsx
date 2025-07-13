
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const DiscoverIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".1"/>
    <path d="M15.41,8.59,11,12.94,8.59,10.53a1,1,0,0,0-1.42,1.42l3.18,3.18a1,1,0,0,0,1.42,0l5.18-5.18a1,1,0,0,0-1.42-1.42Z" opacity="0"/>
    <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"/>
    <path d="M14,10l-4,2,2,4,4-2Z"/>
  </svg>
);
