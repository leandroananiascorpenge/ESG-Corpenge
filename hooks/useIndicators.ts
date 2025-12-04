import { useState, useEffect, useCallback } from 'react';
import type { Indicator, Consumption } from '../types';

const initialIndicators: Indicator[] = [
    {
        id: '1',
        name: 'Água',
        unit: 'm³',
        target: 100,
        consumptions: Array.from({ length: 12 }, (_, i) => ({
            id: `water-${i}`,
            month: i + 1,
            year: new Date().getFullYear(),
            value: Math.floor(Math.random() * (120 - 80 + 1) + 80),
        })),
    },
    {
        id: '2',
        name: 'Energia Elétrica',
        unit: 'kWh',
        target: 5000,
        consumptions: Array.from({ length: 12 }, (_, i) => ({
            id: `energy-${i}`,
            month: i + 1,
            year: new Date().getFullYear(),
            value: Math.floor(Math.random() * (5500 - 4500 + 1) + 4500),
        })),
    },
    {
        id: '3',
        name: 'Papel A4',
        unit: 'resmas',
        target: 50,
        consumptions: Array.from({ length: 12 }, (_, i) => ({
            id: `paper-${i}`,
            month: i + 1,
            year: new Date().getFullYear(),
            value: Math.floor(Math.random() * (60 - 30 + 1) + 30),
        })),
    },
];

export const useIndicators = () => {
    const [indicators, setIndicators] = useState<Indicator[]>(() => {
        try {
            const item = window.localStorage.getItem('esg-indicators');
            if (item) {
                return JSON.parse(item);
            } else {
                window.localStorage.setItem('esg-indicators', JSON.stringify(initialIndicators));
                return initialIndicators;
            }
        } catch (error) {
            console.error(error);
            return initialIndicators;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('esg-indicators', JSON.stringify(indicators));
        } catch (error) {
            console.error('Failed to save indicators to localStorage:', error);
        }
    }, [indicators]);

    const addIndicator = useCallback((name: string, unit: string, target: number) => {
        const newIndicator: Indicator = {
            id: new Date().toISOString(),
            name,
            unit,
            target,
            consumptions: [],
        };
        setIndicators(prev => [...prev, newIndicator]);
    }, []);

    const addConsumption = useCallback((indicatorId: string, consumption: Omit<Consumption, 'id' | 'analysis'>) => {
        setIndicators(prev =>
            prev.map(indicator => {
                if (indicator.id === indicatorId) {
                    // Check if a consumption for the same month and year already exists
                    const existingIndex = indicator.consumptions.findIndex(
                        c => c.month === consumption.month && c.year === consumption.year
                    );

                    const newConsumptions = [...indicator.consumptions];

                    if (existingIndex > -1) {
                        // Update existing consumption
                        newConsumptions[existingIndex] = { ...newConsumptions[existingIndex], value: consumption.value };
                    } else {
                        // Add new consumption
                        newConsumptions.push({ ...consumption, id: new Date().toISOString() });
                    }

                    // Sort consumptions by year then month
                    newConsumptions.sort((a, b) => a.year - b.year || a.month - b.month);
                    
                    return { ...indicator, consumptions: newConsumptions };
                }
                return indicator;
            })
        );
    }, []);

    const updateIndicator = useCallback((indicatorId: string, data: { name: string; unit: string; target: number }) => {
        setIndicators(prev =>
            prev.map(indicator => {
                if (indicator.id === indicatorId) {
                    return { ...indicator, ...data };
                }
                return indicator;
            })
        );
    }, []);

    const updateConsumptionAnalysis = useCallback((indicatorId: string, consumptionId: string, analysis: string) => {
        setIndicators(prev =>
            prev.map(indicator => {
                if (indicator.id === indicatorId) {
                    const newConsumptions = indicator.consumptions.map(c => {
                        if (c.id === consumptionId) {
                            return { ...c, analysis };
                        }
                        return c;
                    });
                    return { ...indicator, consumptions: newConsumptions };
                }
                return indicator;
            })
        );
    }, []);

    const updateConsumption = useCallback((indicatorId: string, consumptionId: string, value: number) => {
        setIndicators(prev =>
            prev.map(indicator => {
                if (indicator.id === indicatorId) {
                    const newConsumptions = indicator.consumptions.map(c => {
                        if (c.id === consumptionId) {
                            return { ...c, value };
                        }
                        return c;
                    });
                    return { ...indicator, consumptions: newConsumptions };
                }
                return indicator;
            })
        );
    }, []);

    return { indicators, addIndicator, addConsumption, updateIndicator, updateConsumptionAnalysis, updateConsumption };
};