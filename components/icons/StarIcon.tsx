
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const StarIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M21.92,8.49a1,1,0,0,0-.81-.69l-5.73-.83L12.79,2.5a1,1,0,0,0-1.79,0L8.41,7l-5.73.83a1,1,0,0,0-.56,1.71l4.15,4L5.39,19.45a1,1,0,0,0,1.45,1.05L12,17.68l5.12,2.82a1,1,0,0,0,1.45-1.05l-.87-5.69,4.15-4A1,1,0,0,0,21.92,8.49Z" />
  </svg>
);
