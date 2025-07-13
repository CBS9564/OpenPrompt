
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const GeminiIcon: React.FC<IconProps> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.292 14.227-2.898-1.207-1.207 2.898-1.3-.894 1.207-2.898-2.898-1.207.894-1.3 2.898 1.207 1.207-2.898 1.3.894-1.207 2.898 2.898 1.207-.894 1.3zM12 17.818c-2.885 0-5.217-2.332-5.217-5.217S9.115 7.384 12 7.384c2.885 0 5.217 2.332 5.217 5.217S14.885 17.818 12 17.818z"/>
    <path d="M12 8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z" opacity=".15"/>
  </svg>
);
