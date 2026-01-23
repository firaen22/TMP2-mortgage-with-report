import { useState, useMemo } from 'react';
import { FUNDS, DEFAULTS } from '../constants';
import { safeNumber } from '../utils/helpers';

export const usePortfolio = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState<'income' | 'hedge'>('income');

    // Allocation Split (Income vs Hedge)
    const [allocationIncome, setAllocationIncome] = useState<number>(DEFAULTS.ALLOCATION_INCOME);
    const allocationHedge = 100 - allocationIncome;

    // Fund Allocations
    const [incomeAllocations, setIncomeAllocations] = useState<Record<string, string | number>>(() => {
        const initial: Record<string, string | number> = {};
        FUNDS.forEach((f, index) => {
            initial[f.id] = index === 0 ? 100 : 0;
        });
        return initial;
    });

    const [hedgeAllocations, setHedgeAllocations] = useState<Record<string, string | number>>(() => {
        const initial: Record<string, string | number> = {};
        FUNDS.forEach((f, index) => {
            initial[f.id] = index === 0 ? 100 : 0;
        });
        return initial;
    });

    // Helper Calculation
    const calculatePortfolioYield = (allocations: Record<string, string | number>) => {
        let total = 0;
        let weightedYield = 0;
        FUNDS.forEach(fund => {
            const alloc = safeNumber(allocations[fund.id]);
            total += alloc;
            weightedYield += fund.yield * (alloc / 100);
        });
        return { totalAllocation: total, yield: weightedYield };
    };

    const incomeStats = useMemo(() => calculatePortfolioYield(incomeAllocations), [incomeAllocations]);
    const hedgeStats = useMemo(() => calculatePortfolioYield(hedgeAllocations), [hedgeAllocations]);

    const overallYield = useMemo(() => {
        return (allocationIncome * incomeStats.yield + (100 - allocationIncome) * hedgeStats.yield) / 100;
    }, [allocationIncome, incomeStats.yield, hedgeStats.yield]);


    const handleAllocationChange = (type: 'income' | 'hedge', id: string, val: string) => {
        // Allow empty string for deletion
        if (val === '') {
            if (type === 'income') {
                setIncomeAllocations(prev => ({ ...prev, [id]: '' }));
            } else {
                setHedgeAllocations(prev => ({ ...prev, [id]: '' }));
            }
            return;
        }

        // Check if it's a valid number format
        const num = parseFloat(val);
        if (!isNaN(num)) {
            if (num >= 0 && num <= 100) {
                if (type === 'income') {
                    setIncomeAllocations(prev => ({ ...prev, [id]: val }));
                } else {
                    setHedgeAllocations(prev => ({ ...prev, [id]: val }));
                }
            }
        }
    };

    return {
        activeTab,
        setActiveTab,
        allocationIncome,
        setAllocationIncome,
        allocationHedge,
        incomeAllocations,
        hedgeAllocations,
        handleAllocationChange,
        incomeStats,
        hedgeStats,
        overallYield
    };
};
