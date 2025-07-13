
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const CpuChipIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M19,5H5A2,2,0,0,0,3,7V17a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2V7A2,2,0,0,0,19,5ZM8,16H6V14H8Zm0-4H6V10H8Zm0-4H6V6H8Zm4,8H10V14h2Zm0-4H10V10h2Zm0-4H10V6h2Zm4,8H14V14h2Zm0-4H14V10h2Zm0-4H14V6h2Zm2,6h.09L18,14v2Zm0-4h.09L18,10v2Z" />
  </svg>
);
