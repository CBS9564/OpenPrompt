import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

export const PdfIcon: React.FC<IconProps> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor"
        {...props}>
        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM12.75 12.75a.75.75 0 00-1.5 0v2.586l-1.06-1.06a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l2.5-2.5a.75.75 0 10-1.06-1.06l-1.06 1.06V12.75z" clipRule="evenodd" />
        <path d="M14.25 5.25a.75.75 0 00-.75-.75H9a.75.75 0 000 1.5h4.5a.75.75 0 00.75-.75z" />
    </svg>
);