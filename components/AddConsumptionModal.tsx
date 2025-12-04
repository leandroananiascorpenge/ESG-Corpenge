import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Indicator } from '../types';

interface AddConsumptionModalProps {
    indicator: Indicator;
    onClose: () => void;
    onAddConsumption: (indicatorId: string, consumption: { month: number; year: number; value: number }) => void;
}

const months = [
    { value: 1, name: 'Janeiro' }, { value: 2, name: 'Fevereiro' }, { value: 3, name: 'Março' },
    { value: 4, name: 'Abril' }, { value: 5, name: 'Maio' }, { value: 6, name: 'Junho' },
    { value: 7, name: 'Julho' }, { value: 8, name: 'Agosto' }, { value: 9, name: 'Setembro' },
    { value: 10, name: 'Outubro' }, { value: 11, name: 'Novembro' }, { value: 12, name: 'Dezembro' }
];

export const AddConsumptionModal: React.FC<AddConsumptionModalProps> = ({ indicator, onClose, onAddConsumption }) => {
    const currentYear = new Date().getFullYear();
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(currentYear);
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const consumptionValue = parseFloat(value);
        if (!isNaN(consumptionValue) && consumptionValue >= 0) {
            onAddConsumption(indicator.id, { month, year, value: consumptionValue });
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title={`Lançar Consumo de ${indicator.name}`}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="month" className="block text-sm font-medium text-gray-700">Mês</label>
                            <select
                                id="month"
                                value={month}
                                onChange={(e) => setMonth(parseInt(e.target.value))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                {months.map(m => (
                                    <option key={m.value} value={m.value}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                           <label htmlFor="year" className="block text-sm font-medium text-gray-700">Ano</label>
                            <input
                                type="number"
                                id="year"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">Consumo ({indicator.unit})</label>
                        <input
                            type="number"
                            id="value"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
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
                        Salvar Lançamento
                    </Button>
                </div>
            </form>
        </Modal>
    );
};