
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const HuggingFaceIcon: React.FC<IconProps> = (props) => (
    <svg 
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M20.25 16.5a1.25 1.25 0 1 1-2.5 0v-1.625a.25.25 0 0 0-.25-.25H6.5a.25.25 0 0 0-.25.25V16.5a1.25 1.25 0 1 1-2.5 0V7.5a1.25 1.25 0 1 1 2.5 0v1.625a.25.25 0 0 0 .25.25h11a.25.25 0 0 0 .25-.25V7.5a1.25 1.25 0 1 1 2.5 0v9zM9.25 10.25a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0zm5 0a1.25 1.25 0 1 0 2.5 0 1.25 1.25 0 0 0-2.5 0z"/>
    </svg>
);
