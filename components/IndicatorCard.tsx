import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import type { Indicator } from '../types';
import { Button } from './Button';
import { AddConsumptionModal } from './AddConsumptionModal';
import { EditIndicatorModal } from './EditIndicatorModal';
import { ConsumptionHistoryModal } from './ConsumptionHistoryModal';

interface IndicatorCardProps {
    indicator: Indicator;
    addConsumption: (indicatorId: string, consumption: { month: number; year: number; value: number }) => void;
    updateIndicator: (indicatorId: string, data: { name: string; unit: string; target: number }) => void;
    updateConsumptionAnalysis: (indicatorId: string, consumptionId: string, analysis: string) => void;
    updateConsumption: (indicatorId: string, consumptionId: string, value: number) => void;
}

const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const CustomLegend = () => (
    <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-gray-600">
        <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-300 mr-2" style={{backgroundColor: '#93c5fd'}}></span>
            <span>Dentro da Meta</span>
        </div>
        <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-yellow-300 mr-2" style={{backgroundColor: '#fde047'}}></span>
            <span>Acima da Meta (Sem Análise)</span>
        </div>
        <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-red-400 mr-2" style={{backgroundColor: '#f87171'}}></span>
            <span>Acima da Meta (Com Análise)</span>
        </div>
    </div>
);


export const IndicatorCard: React.FC<IndicatorCardProps> = ({ indicator, addConsumption, updateIndicator, updateConsumptionAnalysis, updateConsumption }) => {
    const [isAddConsumptionModalOpen, setAddConsumptionModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const availableYears = useMemo(() => {
        const years = new Set(indicator.consumptions.map(c => c.year));
        if (!years.has(new Date().getFullYear())) {
            years.add(new Date().getFullYear());
        }
        return Array.from(years).sort((a: number, b: number) => b - a);
    }, [indicator.consumptions]);
    
    const chartData = useMemo(() => {
        const yearConsumptions = indicator.consumptions.filter(c => c.year === selectedYear);
        
        return monthNames.map((name, index) => {
            const month = index + 1;
            const consumption = yearConsumptions.find(c => c.month === month);

            // Color Logic
            const colors = {
                default: '#93c5fd', 
                warning: '#fde047',
                danger: '#f87171', 
            };
            
            let barColor = colors.default;
            if (consumption && consumption.value > indicator.target) {
                if (consumption.analysis && consumption.analysis.trim() !== '') {
                    barColor = colors.danger; // Above target with analysis
                } else {
                    barColor = colors.warning; // Above target without analysis
                }
            }

            return {
                name,
                "Consumo": consumption ? consumption.value : 0,
                "Meta": indicator.target,
                fill: barColor,
            };
        });
    }, [indicator.consumptions, selectedYear, indicator.target]);

    const totalConsumption = useMemo(() => {
      return chartData.reduce((sum, item) => sum + (item['Consumo'] || 0), 0);
    }, [chartData]);
    
    return (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <div className="flex items-center gap-2">
                         <h3 className="text-xl font-bold text-gray-800">{indicator.name}</h3>
                         <button 
                            onClick={() => setEditModalOpen(true)} 
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            aria-label={`Editar indicador ${indicator.name}`}
                         >
                            <EditIcon />
                         </button>
                    </div>
                    <p className="text-sm text-gray-500">Meta Mensal: {indicator.target} {indicator.unit}</p>
                     <p className="text-sm text-gray-600 font-semibold mt-1">Consumo Anual ({selectedYear}): {totalConsumption.toFixed(2)} {indicator.unit}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-end gap-2">
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    >
                        {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                    <Button onClick={() => setAddConsumptionModalOpen(true)}>
                        Adicionar Lançamento
                    </Button>
                </div>
            </div>
            <div 
                className="flex-grow h-72 cursor-pointer"
                onClick={() => setHistoryModalOpen(true)}
                role="button"
                aria-label={`Ver histórico de consumo para ${indicator.name}`}
            >
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 20,
                            left: -10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} unit={` ${indicator.unit}`} width={80}/>
                        <Tooltip
                            contentStyle={{
                                background: "rgba(255, 255, 255, 0.8)",
                                border: "1px solid #ccc",
                                borderRadius: "4px"
                            }}
                        />
                        <ReferenceLine y={indicator.target} label={{ value: "Meta", position: "insideTopRight", fill: '#f87171', fontSize: 12 }} stroke="#f87171" strokeDasharray="3 3" />
                        <Bar dataKey="Consumo" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <CustomLegend />
            {isAddConsumptionModalOpen && (
                <AddConsumptionModal
                    indicator={indicator}
                    onClose={() => setAddConsumptionModalOpen(false)}
                    onAddConsumption={addConsumption}
                />
            )}
            {isEditModalOpen && (
                <EditIndicatorModal
                    indicator={indicator}
                    onClose={() => setEditModalOpen(false)}
                    onUpdateIndicator={updateIndicator}
                />
            )}
             {isHistoryModalOpen && (
                <ConsumptionHistoryModal
                    indicator={indicator}
                    year={selectedYear}
                    onClose={() => setHistoryModalOpen(false)}
                    onUpdateAnalysis={updateConsumptionAnalysis}
                    onUpdateConsumption={updateConsumption}
                />
            )}
        </div>
    );
};