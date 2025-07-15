import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const HomeIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12,2L3,9V22H21V9ZM12,4.34,19,10V20H5V10Z" />
  </svg>
);
