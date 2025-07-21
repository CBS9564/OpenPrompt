import React from 'react';

interface IconProps {
  className?: string;
}

const AnthropicIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z"/>
    <path fill="currentColor" d="M168 96h-24a8 8 0 0 0-8 8v56h-16v-40a8 8 0 0 0-8-8H88a8 8 0 0 0 0 16h24v40a8 8 0 0 0 8 8h24a8 8 0 0 0 8-8v-56h16v40a8 8 0 0 0 8 8h24a8 8 0 0 0 0-16h-16v-40a8 8 0 0 0-8-8Z"/>
  </svg>
);

export default AnthropicIcon;