import React, { useState } from 'react';
import type { Document } from '../types';
import { EditDocumentModal } from './EditDocumentModal';
import { ReviseDocumentModal } from './ReviseDocumentModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface DocumentControlProps {
    documents: Document[];
    updateDocument: (docId: string, data: Partial<Omit<Document, 'id' | 'revision'>>) => void;
    reviseDocument: (docId: string, newApprovalDate: string, newNextRevisionDate: string) => void;
    deleteDocument: (docId: string) => void;
}

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const ReviseIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6.414A2 2 0 0017.414 5L14 1.586A2 2 0 0012.586 1H4a2 2 0 00-2-2zm3 1a1 1 0 000 2h6a1 1 0 100-2H7zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
    </svg>
);

const AttachmentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);


const StatusBadge: React.FC<{ status: Document['status'] }> = ({ status }) => {
    const colorClasses = {
        'Aprovado': 'bg-green-100 text-green-800',
        'Em Elaboração': 'bg-blue-100 text-blue-800',
        'Em Aprovação': 'bg-yellow-100 text-yellow-800',
        'Obsoleto': 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

export const DocumentControl: React.FC<DocumentControlProps> = ({ documents, updateDocument, reviseDocument, deleteDocument }) => {
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [revisingDocument, setRevisingDocument] = useState<Document | null>(null);
    const [deletingDocument, setDeletingDocument] = useState<Document | null>(null);

    const handleDeleteConfirm = () => {
        if (deletingDocument) {
            deleteDocument(deletingDocument.id);
            setDeletingDocument(null);
        }
    };

    if (documents.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum documento encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo documento para gerenciar.</p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Documento</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revisão</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anexo</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Aprovação</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima Revisão</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {documents.map(doc => (
                                <tr key={doc.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{String(doc.revision).padStart(2, '0')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={doc.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doc.attachment ? (
                                            <a
                                                href={`data:${doc.attachment.type};base64,${doc.attachment.content}`}
                                                download={doc.attachment.name}
                                                className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-2"
                                                title={doc.attachment.name}
                                            >
                                                <AttachmentIcon />
                                                <span className="truncate" style={{maxWidth: '150px'}}>{doc.attachment.name}</span>
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.approvalDate ? new Date(doc.approvalDate).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.nextRevisionDate ? new Date(doc.nextRevisionDate).toLocaleDateString() : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => setEditingDocument(doc)} className="text-gray-400 hover:text-blue-600"><EditIcon /></button>
                                        <button onClick={() => setRevisingDocument(doc)} className="text-gray-400 hover:text-blue-600"><ReviseIcon /></button>
                                        <button onClick={() => setDeletingDocument(doc)} className="text-gray-400 hover:text-red-600"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingDocument && (
                <EditDocumentModal
                    document={editingDocument}
                    onClose={() => setEditingDocument(null)}
                    onUpdateDocument={updateDocument}
                />
            )}
             {revisingDocument && (
                <ReviseDocumentModal
                    document={revisingDocument}
                    onClose={() => setRevisingDocument(null)}
                    onReviseDocument={reviseDocument}
                />
            )}
            {deletingDocument && (
                <ConfirmDeleteModal
                    title="Excluir Documento"
                    onClose={() => setDeletingDocument(null)}
                    onConfirm={handleDeleteConfirm}
                >
                    <p>Você tem certeza que deseja excluir o documento <strong>{deletingDocument.code} - {deletingDocument.name}</strong>?</p>
                    <p className="mt-2 text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
                </ConfirmDeleteModal>
            )}
        </>
    );
};