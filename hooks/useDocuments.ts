import { useState, useEffect, useCallback } from 'react';
import type { Document } from '../types';

const initialDocuments: Document[] = [
    {
        id: 'doc-1',
        code: 'PRO-ADM-001',
        name: 'Procedimento de Compras',
        revision: 2,
        status: 'Aprovado',
        approvalDate: '2023-10-15',
        nextRevisionDate: '2024-10-15',
    },
    {
        id: 'doc-2',
        code: 'PRO-RH-005',
        name: 'Política de Férias',
        revision: 1,
        status: 'Aprovado',
        approvalDate: '2024-01-20',
        nextRevisionDate: '2025-01-20',
    },
    {
        id: 'doc-3',
        code: 'IT-TI-012',
        name: 'Instrução de Trabalho para Backup',
        revision: 0,
        status: 'Em Elaboração',
        approvalDate: '',
        nextRevisionDate: '',
    },
];

export const useDocuments = () => {
    const [documents, setDocuments] = useState<Document[]>(() => {
        try {
            const item = window.localStorage.getItem('esg-documents');
            if (item) {
                return JSON.parse(item);
            } else {
                window.localStorage.setItem('esg-documents', JSON.stringify(initialDocuments));
                return initialDocuments;
            }
        } catch (error) {
            console.error(error);
            return initialDocuments;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('esg-documents', JSON.stringify(documents));
        } catch (error) {
            console.error('Failed to save documents to localStorage:', error);
        }
    }, [documents]);

    const addDocument = useCallback((doc: Omit<Document, 'id' | 'revision' | 'status'>) => {
        const newDocument: Document = {
            ...doc,
            id: new Date().toISOString(),
            revision: 0,
            status: 'Em Elaboração',
        };
        setDocuments(prev => [...prev, newDocument]);
    }, []);

    const updateDocument = useCallback((docId: string, data: Partial<Omit<Document, 'id' | 'revision'>>) => {
        setDocuments(prev =>
            prev.map(doc => {
                if (doc.id === docId) {
                    const updatedDoc = { ...doc, ...data };
                    // If attachment is explicitly passed as undefined, remove it from the object
                    if (data.attachment === undefined) {
                       delete updatedDoc.attachment;
                    }
                    return updatedDoc;
                }
                return doc;
            })
        );
    }, []);

    const reviseDocument = useCallback((docId: string, newApprovalDate: string, newNextRevisionDate: string) => {
         setDocuments(prev =>
            prev.map(doc => {
                if (doc.id === docId) {
                    return { 
                        ...doc, 
                        revision: doc.revision + 1,
                        approvalDate: newApprovalDate,
                        nextRevisionDate: newNextRevisionDate,
                        status: 'Aprovado', // Assume revision implies approval
                    };
                }
                return doc;
            })
        );
    }, []);

    const deleteDocument = useCallback((docId: string) => {
        setDocuments(prev => prev.filter(doc => doc.id !== docId));
    }, []);


    return { documents, addDocument, updateDocument, reviseDocument, deleteDocument };
};