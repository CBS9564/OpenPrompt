import React from 'react';

interface IconProps {
  className?: string;
}

const GeminiIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285f4" d="M512 85.333c-235.638 0-426.667 191.029-426.667 426.667s191.029 426.667 426.667 426.667c235.638 0 426.667-191.029 426.667-426.667S747.638 85.333 512 85.333z"/>
    <path fill="#fff" d="M512 512m-213.333 0a213.333 213.333 0 1 0 426.666 0 213.333 213.333 0 1 0-426.666 0z"/>
    <path fill="#34a853" d="M725.333 512a213.333 213.333 0 0 0-213.333-213.333V512h213.333z"/>
  </svg>
);

export default GeminiIcon;