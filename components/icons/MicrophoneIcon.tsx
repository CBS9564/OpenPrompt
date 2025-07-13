
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const MicrophoneIcon: React.FC<IconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12,15a4,4,0,0,0,4-4V6a4,4,0,0,0-8,0v5A4,4,0,0,0,12,15Zm1-7.17a2,2,0,0,1,2,2V11a2,2,0,0,1-4,0V7.83a2,2,0,0,1,2-2Z"/>
    <path d="M19,11a1,1,0,0,0-1,1,6,6,0,0,1-12,0,1,1,0,0,0-2,0,8,8,0,0,0,7,7.93V22H11a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2H13V19.93A8,8,0,0,0,19,12,1,1,0,0,0,19,11Z"/>
  </svg>
);
