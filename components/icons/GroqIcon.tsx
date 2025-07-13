
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const GroqIcon: React.FC<IconProps> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm4.5 13.5c0 1.8-1.458 3.25-3.25 3.25S10 17.3 10 15.5v-7C10 6.7 11.458 5.25 13.25 5.25S16.5 6.7 16.5 8.5v.75H14v-1a.75.75 0 0 0-1.5 0v6.5a.75.75 0 0 0 1.5 0v-1h2.5z" />
  </svg>
);
