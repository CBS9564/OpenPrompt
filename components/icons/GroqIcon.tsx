import React from 'react';

interface IconProps {
  className?: string;
}

const GroqIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"/>
    <path fill="currentColor" d="M184 128a56 56 0 0 1-48.51 55.49a8 8 0 0 1-15-5V80.51a8 8 0 0 1 15-5A56 56 0 0 1 184 128Zm-16 0a40 40 0 0 0-40-40v80a40 40 0 0 0 40-40Z"/>
  </svg>
);

export default GroqIcon;