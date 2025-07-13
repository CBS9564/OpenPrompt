
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const RunwayMLIcon: React.FC<IconProps> = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M2 2v20h20V2H2zm18 18H4V4h16v16z"/>
        <path d="M10.33 16.33L14 12l-3.67-4.33H8.5L12.17 12 8.5 16.33zM15.5 8.33V16.33H14V8.33z"/>
    </svg>
);
