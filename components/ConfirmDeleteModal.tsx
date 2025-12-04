import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDeleteModalProps {
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: React.ReactNode;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onClose, onConfirm, title, children }) => {
    return (
        <Modal onClose={onClose} title={title}>
            <div className="text-sm text-gray-700">
                {children}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
                <Button type="button" variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button type="button" variant="danger" onClick={onConfirm}>
                    Excluir
                </Button>
            </div>
        </Modal>
    );
};