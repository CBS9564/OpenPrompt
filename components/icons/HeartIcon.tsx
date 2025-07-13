
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const HeartIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21,8.57C21,5.42,18.73,3,15.75,3A5.3,5.3,0,0,0,12,5.2,5.3,5.3,0,0,0,8.25,3C5.27,3,3,5.42,3,8.57,3,14.65,12,21,12,21S21,14.65,21,8.57Z" />
  </svg>
);
