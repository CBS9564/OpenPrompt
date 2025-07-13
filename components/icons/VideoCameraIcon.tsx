
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const VideoCameraIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M21.71,6.29,18,10.17V8a3,3,0,0,0-3-3H5A3,3,0,0,0,2,8v8a3,3,0,0,0,3,3H15a3,3,0,0,0,3-3V13.83l3.71,3.88A1,1,0,0,0,22,18a.91.91,0,0,0,.42-.1.93.93,0,0,0,.58-.82V7.12A1,1,0,0,0,21.71,6.29ZM16,16a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V8A1,1,0,0,1,5,7H15a1,1,0,0,1,1,1Z" />
  </svg>
);
