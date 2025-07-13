
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const ElevenLabsIcon: React.FC<IconProps> = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M16.8 6.4h-3.2v11.2h3.2V6.4zM10.4 12h-3.2v5.6h3.2V12z"/>
        <path d="M23.2 2.4v19.2H.8V2.4h22.4M24 0H0v24h24V0z"/>
    </svg>
);
