
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const PencilIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M20.71,7.04C21.1,6.65,21.1,6,20.71,5.63l-2.34-2.34C18.17,3.12,17.5,3.12,17.12,3.29L15.12,5.29l4.42,4.42ZM3,17.25V21H6.75L17.81,9.94l-4.42-4.42Z"/>
  </svg>
);
