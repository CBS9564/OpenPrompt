import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ChainsIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17 9h-4V7h4c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4v-2h4c1.1 0 2-.9 2-2s-.9-2-2-2zM7 9h4V7H7c-2.21 0-4 1.79-4 4s1.79 4 4 4h4v-2H7c-1.1 0-2-.9-2-2s.9-2 2-2zm5 4h-2v-2h2v2z"/>
  </svg>
);
