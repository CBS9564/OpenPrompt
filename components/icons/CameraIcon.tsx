
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const CameraIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12,12.5a3.5,3.5,0,1,0-3.5-3.5A3.5,3.5,0,0,0,12,12.5Zm0-5A1.5,1.5,0,1,1,10.5,9,1.5,1.5,0,0,1,12,7.5Z"/>
    <path d="M19.5,7H16V5.5A2.5,2.5,0,0,0,13.5,3h-3A2.5,2.5,0,0,0,8,5.5V7H4.5A2.5,2.5,0,0,0,2,9.5v9A2.5,2.5,0,0,0,4.5,21h15A2.5,2.5,0,0,0,22,18.5v-9A2.5,2.5,0,0,0,19.5,7Zm.5,11.5a.5.5,0,0,1-.5.5h-15a.5.5,0,0,1-.5-.5v-9a.5.5,0,0,1,.5-.5H8v.5a.5.5,0,0,0,.5.5h7a.5.5,0,0,0,.5-.5V9h3.5a.5.5,0,0,1,.5.5Z"/>
  </svg>
);
