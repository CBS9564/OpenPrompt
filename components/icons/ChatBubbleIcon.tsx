
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ChatBubbleIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12,2A10,10,0,0,0,2,12a9.89,9.89,0,0,0,2.26,6.33L2.05,21.9a1,1,0,0,0,.28,1.26,1,1,0,0,0,1.27-.28l3.54-3.54A9.89,9.89,0,0,0,12,20,10,10,0,0,0,12,2Zm0,16a8,8,0,0,1-4.18-1.15,1,1,0,0,0-.82-.14L4.35,19.36l2.65-2.65a1,1,0,0,0-.14-.82A8,8,0,1,1,12,18Z"/>
  </svg>
);
