import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { DocumentControl } from './components/DocumentControl';
import { AddIndicatorModal } from './components/AddIndicatorModal';
import { AddDocumentModal } from './components/AddDocumentModal';
import { useIndicators } from './hooks/useIndicators';
import { useDocuments } from './hooks/useDocuments';
import { Sidebar } from './components/Sidebar';
import type { Page } from './types';

const App: React.FC = () => {
    const { indicators, addIndicator, addConsumption, updateIndicator, updateConsumptionAnalysis, updateConsumption } = useIndicators();
    const { documents, addDocument, updateDocument, reviseDocument, deleteDocument } = useDocuments();
    
    const [activePage, setActivePage] = useState<Page>('indicadores');
    const [isAddIndicatorModalOpen, setAddIndicatorModalOpen] = useState(false);
    const [isAddDocumentModalOpen, setAddDocumentModalOpen] = useState(false);

    const openModalForPage = () => {
        if (activePage === 'indicadores') {
            setAddIndicatorModalOpen(true);
        } else if (activePage === 'documentos') {
            setAddDocumentModalOpen(true);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    page={activePage}
                    onAddClick={openModalForPage}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4 sm:p-6 lg:p-8">
                    {activePage === 'indicadores' && (
                        <Dashboard 
                            indicators={indicators} 
                            addConsumption={addConsumption} 
                            updateIndicator={updateIndicator} 
                            updateConsumptionAnalysis={updateConsumptionAnalysis}
                            updateConsumption={updateConsumption}
                        />
                    )}
                    {activePage === 'documentos' && (
                        <DocumentControl
                            documents={documents}
                            updateDocument={updateDocument}
                            reviseDocument={reviseDocument}
                            deleteDocument={deleteDocument}
                        />
                    )}
                </main>
            </div>

            {isAddIndicatorModalOpen && (
                <AddIndicatorModal
                    onClose={() => setAddIndicatorModalOpen(false)}
                    onAddIndicator={addIndicator}
                />
            )}
            {isAddDocumentModalOpen && (
                <AddDocumentModal
                    onClose={() => setAddDocumentModalOpen(false)}
                    onAddDocument={addDocument}
                />
            )}
        </div>
    );
};

export default App;