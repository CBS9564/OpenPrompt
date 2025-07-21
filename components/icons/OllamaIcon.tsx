import React from 'react';

interface IconProps {
  className?: string;
}

const OllamaIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
      <path d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4S4 12.954 4 24s8.954 20 20 20Z"/>
      <path d="M24 36c6.627 0 12-5.373 12-12s-5.373-12-12-12"/>
    </g>
  </svg>
);

export default OllamaIcon;