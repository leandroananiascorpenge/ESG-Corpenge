import React, { useMemo, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { Indicator, Consumption } from '../types';
import { EditConsumptionModal } from './EditConsumptionModal';

interface ConsumptionHistoryModalProps {
    indicator: Indicator;
    year: number;
    onClose: () => void;
    onUpdateAnalysis: (indicatorId: string, consumptionId: string, analysis: string) => void;
    onUpdateConsumption: (indicatorId: string, consumptionId: string, value: number) => void;
}

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

export const ConsumptionHistoryModal: React.FC<ConsumptionHistoryModalProps> = ({ indicator, year, onClose, onUpdateAnalysis, onUpdateConsumption }) => {
    
    const [editingConsumption, setEditingConsumption] = useState<Consumption | null>(null);

    const consumptionsForYear = useMemo(() => {
        return monthNames.map((name, index) => {
            const month = index + 1;
            const consumptionData = indicator.consumptions.find(c => c.year === year && c.month === month);
            return {
                monthName: name,
                consumption: consumptionData || null
            };
        });
    }, [indicator.consumptions, year]);

    const [analyses, setAnalyses] = useState<Record<string, string>>(() => 
        indicator.consumptions.reduce((acc, c) => {
            if (c.analysis) {
                acc[c.id] = c.analysis;
            }
            return acc;
        }, {} as Record<string, string>)
    );

    const handleAnalysisChange = (consumptionId: string, text: string) => {
        setAnalyses(prev => ({ ...prev, [consumptionId]: text }));
    };

    const handleAnalysisBlur = (consumptionId: string) => {
        onUpdateAnalysis(indicator.id, consumptionId, analyses[consumptionId] || '');
    };

    const handleUpdateConsumption = (consumptionId: string, value: number) => {
        onUpdateConsumption(indicator.id, consumptionId, value);
        setEditingConsumption(null);
    };

    return (
        <>
            <Modal onClose={onClose} title={`Histórico de Consumo - ${indicator.name} (${year})`} size="maximized">
                <div className="flex-grow overflow-y-auto pr-2">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-4 py-3">Mês</th>
                                <th scope="col" className="px-4 py-3">Consumo</th>
                                <th scope="col" className="px-4 py-3">Meta</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {consumptionsForYear.map(({ monthName, consumption }) => {
                                const isAboveTarget = consumption && consumption.value > indicator.target;
                                const statusText = consumption ? (isAboveTarget ? 'Acima da Meta' : 'Dentro da Meta') : 'N/A';
                                const statusColor = consumption ? (isAboveTarget ? 'text-red-600' : 'text-green-600') : 'text-gray-400';

                                return (
                                    <React.Fragment key={monthName}>
                                        <tr className="border-b">
                                            <td className="px-4 py-3 font-medium text-gray-900">{monthName}</td>
                                            <td className="px-4 py-3">{consumption ? `${consumption.value.toFixed(2)} ${indicator.unit}` : '-'}</td>
                                            <td className="px-4 py-3">{indicator.target} {indicator.unit}</td>
                                            <td className={`px-4 py-3 font-semibold ${statusColor}`}>{statusText}</td>
                                            <td className="px-4 py-3">
                                                {consumption && (
                                                    <button 
                                                        onClick={() => setEditingConsumption(consumption)} 
                                                        className="text-gray-400 hover:text-blue-600"
                                                        aria-label={`Editar consumo de ${monthName}`}
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                        {consumption && isAboveTarget && (
                                            <tr className="bg-orange-50 border-b">
                                                <td colSpan={5} className="p-4">
                                                    <label htmlFor={`analysis-${consumption.id}`} className="block text-xs font-medium text-gray-700 mb-1">Análise Crítica</label>
                                                    <textarea
                                                        id={`analysis-${consumption.id}`}
                                                        rows={2}
                                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100 text-gray-800"
                                                        placeholder="Justifique o consumo acima da meta..."
                                                        value={analyses[consumption.id] || ''}
                                                        onChange={(e) => handleAnalysisChange(consumption.id, e.target.value)}
                                                        onBlur={() => handleAnalysisBlur(consumption.id)}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex-shrink-0 flex justify-end">
                    <Button variant="secondary" onClick={onClose}>
                        Fechar
                    </Button>
                </div>
            </Modal>

            {editingConsumption && (
                <EditConsumptionModal
                    consumption={editingConsumption}
                    indicatorUnit={indicator.unit}
                    onClose={() => setEditingConsumption(null)}
                    onSave={handleUpdateConsumption}
                />
            )}
        </>
    );
};