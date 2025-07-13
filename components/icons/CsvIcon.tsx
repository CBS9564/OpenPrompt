import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const CsvIcon: React.FC<IconProps> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        {...props}>
        <path fillRule="evenodd" d="M3 3.75A.75.75 0 013.75 3h16.5a.75.75 0 01.75.75v16.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V3.75zm3 2.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zm0 4.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);