
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const PaperClipIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M21.41,10.27,14.66,17a4.25,4.25,0,0,1-6,0,1,1,0,0,1,1.41-1.41,2.25,2.25,0,0,0,3.18,0l5.34-5.34a2.75,2.75,0,0,0-3.89-3.89L9.37,11.71a1.25,1.25,0,0,0,1.77,1.77L14.5,10.12a1,1,0,0,1,1.41,1.41l-3.36,3.36a3.25,3.25,0,0,1-4.6-4.6L13.29,5a4.75,4.75,0,0,1,6.72,6.72Z"/>
  </svg>
);
