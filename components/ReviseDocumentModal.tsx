import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Document } from '../types';

interface ReviseDocumentModalProps {
    document: Document;
    onClose: () => void;
    onReviseDocument: (docId: string, newApprovalDate: string, newNextRevisionDate: string) => void;
}

export const ReviseDocumentModal: React.FC<ReviseDocumentModalProps> = ({ document, onClose, onReviseDocument }) => {
    const [approvalDate, setApprovalDate] = useState('');
    const [nextRevisionDate, setNextRevisionDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (approvalDate && nextRevisionDate) {
            onReviseDocument(document.id, approvalDate, nextRevisionDate);
            onClose();
        }
    };
    
    const nextRevision = String(document.revision + 1).padStart(2, '0');

    return (
        <Modal onClose={onClose} title={`Revisar Documento: ${document.code}`}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Você está criando a revisão <strong>{nextRevision}</strong> para o documento <strong>{document.name}</strong>.
                        Por favor, informe as novas datas de aprovação e próxima revisão.
                    </p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="approvalDate" className="block text-sm font-medium text-gray-700">Nova Data de Aprovação</label>
                            <input
                                type="date"
                                id="approvalDate"
                                value={approvalDate}
                                onChange={(e) => setApprovalDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                           <label htmlFor="nextRevisionDate" className="block text-sm font-medium text-gray-700">Nova Próxima Revisão</label>
                            <input
                                type="date"
                                id="nextRevisionDate"
                                value={nextRevisionDate}
                                onChange={(e) => setNextRevisionDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Confirmar Revisão
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
