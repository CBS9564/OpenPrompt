
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const AnthropicIcon: React.FC<IconProps> = (props) => (
    <svg 
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M15.104 20.928H8.896c-3.312 0-6-2.688-6-6V1.992h5.456v10.432c0 .3.256.544.544.544h.112c.304 0 .544-.24.544-.544V1.992h5.456v10.432c0 3.312 2.688 6 6 6h-6.096V1.992h5.456v12.936c0 3.312-2.688 6-6 6z" />
    </svg>
);
