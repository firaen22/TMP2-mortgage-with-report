import React from 'react';
import GlassCard from '../ui/GlassCard';
import { DollarSignIcon } from '../ui/Icons';
import { formatCurrency, safeNumber } from '../../utils/helpers';
import { CalculationResult } from '../../types';

interface KPIGridProps {
    t: any;
    result: CalculationResult;
    incomeYield: number;
    mortgageRate: string | number;
}

const KPIGrid: React.FC<KPIGridProps> = ({ t, result, incomeYield, mortgageRate }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-emerald-500/20"></div>
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400">{t.kpi_income}</p>
                    <p className="text-xs text-emerald-500 mt-1">{t.label_yield_rate} {incomeYield.toFixed(2)}%</p>
                </div>
                <p className="text-2xl font-serif text-emerald-400">{formatCurrency(result.monthlyDividend)}</p>
            </GlassCard>

            <GlassCard className="p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-rose-500/20"></div>
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400">{t.kpi_mortgage}</p>
                    <p className="text-xs text-rose-500 mt-1">{t.label_rate_simple} {safeNumber(mortgageRate)}%</p>
                </div>
                <p className="text-2xl font-serif text-rose-400">-{formatCurrency(result.monthlyMortgage)}</p>
            </GlassCard>

            <GlassCard className={`p-5 flex flex-col justify-between h-32 border-t-2 ${result.netMonthlyCashFlow >= 0 ? 'border-t-emerald-500' : 'border-t-rose-500'}`}>
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        {t.kpi_net_flow} <DollarSignIcon size={12} />
                    </p>
                </div>
                <div>
                    <p className={`text-3xl font-serif ${result.netMonthlyCashFlow >= 0 ? 'text-[#D4AF37]' : 'text-rose-400'}`}>
                        {result.netMonthlyCashFlow > 0 ? '+' : ''}{formatCurrency(result.netMonthlyCashFlow)}
                    </p>
                    {result.netMonthlyCashFlow >= 0 && (
                        <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 mt-1 inline-block">{t.label_positive_carry}</span>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};

export default KPIGrid;
