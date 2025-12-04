import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Indicator } from '../types';

interface EditIndicatorModalProps {
    indicator: Indicator;
    onClose: () => void;
    onUpdateIndicator: (indicatorId: string, data: { name: string; unit: string; target: number }) => void;
}

export const EditIndicatorModal: React.FC<EditIndicatorModalProps> = ({ indicator, onClose, onUpdateIndicator }) => {
    const [name, setName] = useState(indicator.name);
    const [unit, setUnit] = useState(indicator.unit);
    const [target, setTarget] = useState(indicator.target.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const targetValue = parseFloat(target);
        if (name.trim() && unit.trim() && !isNaN(targetValue) && targetValue > 0) {
            onUpdateIndicator(indicator.id, { name, unit, target: targetValue });
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title="Editar Indicador">
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
                        Salvar Alterações
                    </Button>
                </div>
            </form>
        </Modal>
    );
};