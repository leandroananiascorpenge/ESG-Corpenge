import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface AddIndicatorModalProps {
    onClose: () => void;
    onAddIndicator: (name: string, unit: string, target: number) => void;
}

export const AddIndicatorModal: React.FC<AddIndicatorModalProps> = ({ onClose, onAddIndicator }) => {
    const [name, setName] = useState('');
    const [unit, setUnit] = useState('');
    const [target, setTarget] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const targetValue = parseFloat(target);
        if (name.trim() && unit.trim() && !isNaN(targetValue) && targetValue > 0) {
            onAddIndicator(name, unit, targetValue);
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title="Adicionar Novo Indicador">
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Indicador</label>
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
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidade de Medida</label>
                        <input
                            type="text"
                            id="unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            placeholder="Ex: m³, kWh, resmas"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="target" className="block text-sm font-medium text-gray-700">Meta Mensal</label>
                        <input
                            type="number"
                            id="target"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            min="0"
                            step="any"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        Adicionar
                    </Button>
                </div>
            </form>
        </Modal>
    );
};