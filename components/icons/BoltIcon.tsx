
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const BoltIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M11.25,3.34,4.19,13.69a.75.75,0,0,0,.66,1.06h4.35l-2.1,6.56a.75.75,0,0,0,1.32.7L18.81,10.3a.75.75,0,0,0-.66-1.06H13.8l2.1-6.56a.75.75,0,0,0-1.32-.7Z" />
  </svg>
);
