import React from 'react';
import { PieChart as PieIcon } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { formatCurrency, safeNumber } from '../../utils/helpers';
import { FUNDS, COLORS } from '../../constants';

interface AllocationFormProps {
    t: any;
    allocationIncome: number;
    setAllocationIncome: (val: number) => void;
    allocationHedge: number;
    investedAmount: number;
    activeTab: 'income' | 'hedge';
    setActiveTab: (val: 'income' | 'hedge') => void;
    incomeAllocations: Record<string, string | number>;
    hedgeAllocations: Record<string, string | number>;
    incomeStats: { totalAllocation: number, yield: number };
    hedgeStats: { totalAllocation: number, yield: number };
    handleAllocationChange: (type: 'income' | 'hedge', id: string, val: string) => void;
}

const AllocationForm: React.FC<AllocationFormProps> = ({
    t,
    allocationIncome,
    setAllocationIncome,
    allocationHedge,
    investedAmount,
    activeTab,
    setActiveTab,
    incomeAllocations,
    hedgeAllocations,
    incomeStats,
    hedgeStats,
    handleAllocationChange
}) => {

    const renderFundList = () => {
        const isIncome = activeTab === 'income';
        const allocations = isIncome ? incomeAllocations : hedgeAllocations;
        const stats = isIncome ? incomeStats : hedgeStats;
        const activeColor = isIncome ? 'text-emerald-400' : 'text-indigo-400';

        return (
            <div className="mt-4 p-4 border border-white/10 bg-black/20">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-serif tracking-wide text-slate-300">
                        {isIncome ? t.tab_income : t.tab_hedge}
                    </label>
                    <div className={`text-xs px-2 py-0.5 border ${stats.totalAllocation === 100 ? 'border-emerald-500/50 text-emerald-400' : 'border-amber-500/50 text-amber-400'}`}>
                        {t.label_total_alloc}: {stats.totalAllocation}%
                    </div>
                </div>

                <div className="space-y-4">
                    {FUNDS.map(fund => {
                        const currentVal = allocations[fund.id];
                        // Provide a value that React Input can handle (string or number, but never undefined/null to avoid uncontrolled warning)
                        const inputValue = currentVal === undefined ? 0 : currentVal;

                        return (
                            <div key={fund.id} className="text-sm">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-slate-200 font-light">
                                        {/*@ts-ignore*/}
                                        {t.funds[fund.id] || fund.name}
                                    </span>
                                    <span className="text-xs text-slate-400 border border-slate-700 px-1.5">{fund.yield}%</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={safeNumber(inputValue)}
                                        onChange={(e) => handleAllocationChange(activeTab, fund.id, e.target.value)}
                                        className={`flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full ${isIncome ? '[&::-webkit-slider-thumb]:bg-emerald-500' : '[&::-webkit-slider-thumb]:bg-indigo-500'}`}
                                    />
                                    <div className="relative w-12">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={inputValue}
                                            onChange={(e) => handleAllocationChange(activeTab, fund.id, e.target.value)}
                                            className={`w-full text-right bg-transparent border-b border-slate-600 text-slate-200 text-xs py-0.5 focus:outline-none focus:border-[${COLORS.GOLD}]`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs text-slate-400 uppercase tracking-widest">{t.label_avg_yield}</span>
                    <span className={`text-lg font-serif ${activeColor}`}>{stats.yield.toFixed(2)}%</span>
                </div>
            </div>
        );
    };

    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <PieIcon className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-lg tracking-wide text-slate-100">{t.card_allocation}</h2>
            </div>

            {/* Slider Section */}
            <div className="mb-6">
                <div className="flex-1 space-y-3">
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-emerald-400">{t.label_income_alloc} ({allocationIncome}%)</span>
                            <span className="text-indigo-400">{t.label_hedge_alloc} ({allocationHedge}%)</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={allocationIncome}
                            onChange={(e) => setAllocationIncome(Number(e.target.value))}
                            className="w-full h-1 bg-gradient-to-r from-emerald-900 to-indigo-900 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-slate-200 [&::-webkit-slider-thumb]:rounded-full"
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{formatCurrency(investedAmount * (allocationIncome / 100), 'zh', true)}</span>
                        <span>{formatCurrency(investedAmount * (allocationHedge / 100), 'zh', true)}</span>
                    </div>
                </div>
            </div>

            {/* Portfolio Tabs */}
            <div>
                <div className="grid grid-cols-2 gap-px bg-slate-700 border border-slate-700 mb-4">
                    <button
                        onClick={() => setActiveTab('income')}
                        className={`py-2 text-xs uppercase tracking-wider transition-all ${activeTab === 'income' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
                    >
                        {t.tab_income}
                    </button>
                    <button
                        onClick={() => setActiveTab('hedge')}
                        className={`py-2 text-xs uppercase tracking-wider transition-all ${activeTab === 'hedge' ? 'bg-slate-800 text-indigo-400' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
                    >
                        {t.tab_hedge}
                    </button>
                </div>
                {renderFundList()}
            </div>
        </GlassCard>
    );
};

export default AllocationForm;
