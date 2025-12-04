import React from 'react';
import type { Page } from '../types';

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const IndicatorIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
);

const DocumentIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);

const LogoIcon = () => (
     <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
);


export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
    
    const menuItems = [
        { id: 'indicadores', label: 'Indicadores', icon: IndicatorIcon },
        { id: 'documentos', label: 'Controle de Documentos', icon: DocumentIcon },
    ];

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                 <div className="bg-gray-900 p-2 rounded-md">
                    <LogoIcon />
                 </div>
                <h1 className="text-xl font-bold ml-3">ESG Corpenge</h1>
            </div>
            <nav className="flex-grow mt-4">
                <ul>
                    {menuItems.map(item => (
                         <li key={item.id}>
                            <a 
                                href="#" 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActivePage(item.id as Page);
                                }}
                                className={`flex items-center px-6 py-3 font-semibold transition-colors duration-200 ${activePage === item.id ? 'bg-gray-700 text-blue-400' : 'hover:bg-gray-700'}`}
                            >
                                <item.icon />
                                <span className="ml-3">{item.label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};