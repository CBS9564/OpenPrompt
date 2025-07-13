
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const DatabaseIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12,6a4,4,0,0,0-4,4H8a4,4,0,0,0,4,4,4,4,0,0,0,4-4h0A4,4,0,0,0,12,6Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,12Z" />
    <path d="M12,2A10,10,0,0,0,2,12v1a10,10,0,0,0,20,0V12A10,10,0,0,0,12,2Zm8,11a8,8,0,0,1-16,0V9a8,8,0,0,1,16,0Z" />
  </svg>
);
