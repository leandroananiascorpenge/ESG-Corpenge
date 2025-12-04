import React from 'react';
import { Button } from './Button';
import type { Page } from '../types';

interface HeaderProps {
    page: Page;
    onAddClick: () => void;
}

const pageConfig = {
    indicadores: {
        title: 'Indicadores',
        buttonLabel: '+ Adicionar Indicador',
    },
    documentos: {
        title: 'Controle de Documentos',
        buttonLabel: '+ Adicionar Documento',
    },
};

export const Header: React.FC<HeaderProps> = ({ page, onAddClick }) => {
    const config = pageConfig[page];

    return (
        <header className="bg-white shadow-sm flex-shrink-0">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <h1 className="text-xl font-semibold text-gray-900">{config.title}</h1>
                    <div className="flex items-center space-x-4">
                        <Button onClick={onAddClick}>
                           {config.buttonLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};