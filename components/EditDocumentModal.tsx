import React, { useState, useRef } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Document, DocumentStatus, Attachment } from '../types';

interface EditDocumentModalProps {
    document: Document;
    onClose: () => void;
    onUpdateDocument: (docId: string, data: Partial<Omit<Document, 'id' | 'revision'>>) => void;
}

const statusOptions: DocumentStatus[] = ['Aprovado', 'Em Elaboração', 'Em Aprovação', 'Obsoleto'];

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ document, onClose, onUpdateDocument }) => {
    const [name, setName] = useState(document.name);
    const [code, setCode] = useState(document.code);
    const [status, setStatus] = useState(document.status);
    const [approvalDate, setApprovalDate] = useState(document.approvalDate);
    const [nextRevisionDate, setNextRevisionDate] = useState(document.nextRevisionDate);
    const [attachment, setAttachment] = useState<Attachment | null>(document.attachment || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                const base64 = (loadEvent.target?.result as string).split(',')[1];
                setAttachment({
                    name: file.name,
                    type: file.type,
                    content: base64,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && code.trim()) {
            onUpdateDocument(document.id, { 
                name, 
                code, 
                status, 
                approvalDate, 
                nextRevisionDate, 
                attachment: attachment === null ? undefined : attachment 
            });
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title="Editar Documento">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                     <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Código do Documento</label>
                        <input
                            type="text"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Documento</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as DocumentStatus)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="approvalDate" className="block text-sm font-medium text-gray-700">Data de Aprovação</label>
                            <input
                                type="date"
                                id="approvalDate"
                                value={approvalDate}
                                onChange={(e) => setApprovalDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                           <label htmlFor="nextRevisionDate" className="block text-sm font-medium text-gray-700">Próxima Revisão</label>
                            <input
                                type="date"
                                id="nextRevisionDate"
                                value={nextRevisionDate}
                                onChange={(e) => setNextRevisionDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Anexo</label>
                        {attachment && (
                            <div className="mt-1 flex items-center justify-between p-2 border border-gray-300 rounded-md bg-gray-50">
                                <a href={`data:${attachment.type};base64,${attachment.content}`} download={attachment.name} className="text-sm text-blue-600 hover:underline truncate">{attachment.name}</a>
                                <button type="button" onClick={removeAttachment} className="text-red-500 hover:text-red-700 ml-4 flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        )}
                        <div className="mt-2">
                             <input
                                type="file"
                                id="attachment-upload"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Salvar Alterações
                    </Button>
                </div>
            </form>
        </Modal>
    );
};