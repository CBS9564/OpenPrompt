
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const StabilityAIIcon: React.FC<IconProps> = (props) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M12 2L2 22h20L12 2zm0 4.5L17.5 20H6.5L12 6.5z"/>
        <path d="M12 11.5L9.5 16h5L12 11.5z"/>
    </svg>
);
