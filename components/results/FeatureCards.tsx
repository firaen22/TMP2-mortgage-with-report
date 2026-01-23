import React from 'react';
import { ShieldCheck, Briefcase } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { formatCurrency } from '../../utils/helpers';
import { CalculationResult } from '../../types';

interface FeatureCardsProps {
    t: any;
    result: CalculationResult;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({ t, result }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-6 border-l-2 border-l-[#D4AF37]">
                <div className="flex gap-4">
                    <div className="mt-1"><ShieldCheck className="text-[#D4AF37]" size={20} /></div>
                    <div>
                        <h4 className="font-serif text-slate-200 text-lg">{t.feature_estate_title}</h4>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                            {t.feature_estate_desc}
                        </p>
                    </div>
                </div>
            </GlassCard>

            <GlassCard className="p-6 border-l-2 border-l-indigo-500">
                <div className="flex gap-4">
                    <div className="mt-1"><Briefcase className="text-indigo-400" size={20} /></div>
                    <div>
                        <h4 className="font-serif text-slate-200 text-lg">{t.feature_liquidity_title}</h4>
                        <div className="mt-3 space-y-2">
                            <div className="flex justify-between text-xs border-b border-white/5 pb-1">
                                <span className="text-slate-500 uppercase tracking-wider">{t.label_surrender_5}</span>
                                <span className="text-slate-200">{formatCurrency(result.yearlyData[4]?.surrenderValue || 0)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500 uppercase tracking-wider">{t.label_net_equity_30}</span>
                                <span className="text-[#D4AF37] text-sm font-serif">{formatCurrency(result.yearlyData[29]?.netEquity || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default FeatureCards;
