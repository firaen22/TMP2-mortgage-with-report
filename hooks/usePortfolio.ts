import { useState, useMemo } from 'react';
import { DEFAULTS, FALLBACK_YIELDS, buildFunds } from '../constants';
import { Fund } from '../types';
import { safeNumber } from '../utils/helpers';

export interface UsePortfolioOptions {
    liveYields?: Record<string, number>;
}

export const usePortfolio = (options: UsePortfolioOptions = {}) => {
    const { liveYields } = options;

    // Build fund list from live yields (or fallback) — re-computed whenever yields change
    const FUNDS: Fund[] = useMemo(() => buildFunds(liveYields), [liveYields]);

    // Tab state
    const [activeTab, setActiveTab] = useState<'income' | 'hedge'>('income');

    // Allocation Split (Income vs Hedge)
    const [allocationIncome, setAllocationIncome] = useState<number>(DEFAULTS.ALLOCATION_INCOME);
    const allocationHedge = 100 - allocationIncome;

    // Fund Allocations
    const [incomeAllocations, setIncomeAllocations] = useState<Record<string, string | number>>(() => {
        const initial: Record<string, string | number> = {};
        buildFunds().forEach((f, index) => {
            initial[f.id] = index === 0 ? 100 : 0;
        });
        return initial;
    });

    const [hedgeAllocations, setHedgeAllocations] = useState<Record<string, string | number>>(() => {
        const initial: Record<string, string | number> = {};
        buildFunds().forEach((f, index) => {
            initial[f.id] = index === 0 ? 100 : 0;
        });
        return initial;
    });

    // Helper Calculation
    const calculatePortfolioYield = (allocations: Record<string, string | number>, funds: Fund[]) => {
        let total = 0;
        let weightedYield = 0;
        funds.forEach(fund => {
            const alloc = safeNumber(allocations[fund.id]);
            total += alloc;
            weightedYield += fund.yield * (alloc / 100);
        });
        return { totalAllocation: total, yield: weightedYield };
    };

    const incomeStats = useMemo(
        () => calculatePortfolioYield(incomeAllocations, FUNDS),
        [incomeAllocations, FUNDS]
    );
    const hedgeStats = useMemo(
        () => calculatePortfolioYield(hedgeAllocations, FUNDS),
        [hedgeAllocations, FUNDS]
    );

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
        FUNDS,
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
