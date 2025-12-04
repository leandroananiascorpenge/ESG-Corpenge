import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Consumption } from '../types';

interface EditConsumptionModalProps {
    consumption: Consumption;
    indicatorUnit: string;
    onClose: () => void;
    onSave: (consumptionId: string, newValue: number) => void;
}

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const EditConsumptionModal: React.FC<EditConsumptionModalProps> = ({ consumption, indicatorUnit, onClose, onSave }) => {
    const [value, setValue] = useState(consumption.value.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const consumptionValue = parseFloat(value);
        if (!isNaN(consumptionValue) && consumptionValue >= 0) {
            onSave(consumption.id, consumptionValue);
        }
    };
    
    const monthName = monthNames[consumption.month - 1];

    return (
        <Modal onClose={onClose} title={`Editar Consumo - ${monthName} ${consumption.year}`}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">Consumo ({indicatorUnit})</label>
                        <input
                            type="number"
                            id="value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            min="0"
                            step="any"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                            autoFocus
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