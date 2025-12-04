import React from 'react';
import type { Indicator, Consumption } from '../types';
import { IndicatorCard } from './IndicatorCard';

interface DashboardProps {
    indicators: Indicator[];
    addConsumption: (indicatorId: string, consumption: { month: number; year: number; value: number }) => void;
    updateIndicator: (indicatorId: string, data: { name: string; unit: string; target: number }) => void;
    updateConsumptionAnalysis: (indicatorId: string, consumptionId: string, analysis: string) => void;
    updateConsumption: (indicatorId: string, consumptionId: string, value: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ indicators, addConsumption, updateIndicator, updateConsumptionAnalysis, updateConsumption }) => {
    if (indicators.length === 0) {
        return (
            <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum indicador encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">Comece adicionando um novo indicador para monitorar.</p>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            {indicators.map(indicator => (
                <IndicatorCard 
                    key={indicator.id} 
                    indicator={indicator}
                    addConsumption={addConsumption}
                    updateIndicator={updateIndicator}
                    updateConsumptionAnalysis={updateConsumptionAnalysis}
                    updateConsumption={updateConsumption}
                />
            ))}
        </div>
    );
};