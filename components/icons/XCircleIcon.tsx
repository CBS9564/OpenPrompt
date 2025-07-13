
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const XCircleIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.71,12.29a1,1,0,0,1,0,1.42,1,1,0,0,1-1.42,0L12,13.41l-2.29,2.3a1,1,0,0,1-1.42,0,1,1,0,0,1,0-1.42L10.59,12l-2.3-2.29a1,1,0,0,1,1.42-1.42L12,10.59l2.29-2.3a1,1,0,1,1,1.42,1.42L13.41,12Z" />
  </svg>
);
