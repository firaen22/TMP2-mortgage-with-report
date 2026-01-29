import React from 'react';
import { formatCurrency } from '../../utils/helpers';

interface SummaryCardProps {
    t: any;
    loanAmount: number;
    ownCash: number;
    investedAmount: number;
    reserveCash: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ t, loanAmount, ownCash, investedAmount, reserveCash }) => {
    return (
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-6">
            <h3 className="text-xs font-serif text-[#D4AF37] uppercase tracking-widest mb-4">{t.card_summary}</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-400">{t.label_loan}</span>
                    <span className="text-slate-200">{formatCurrency(loanAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-[#D4AF37]/10 pt-2">
                    <span className="text-slate-400">{t.label_own_cash}</span>
                    <span className="text-slate-200">{formatCurrency(ownCash)}</span>
                </div>
                <div className="flex justify-between border-t border-[#D4AF37]/10 pt-2">
                    <span className="text-slate-400">{t.label_reserve_cash}</span>
                    <span className="text-slate-200">{formatCurrency(reserveCash)}</span>
                </div>
                <div className="flex justify-between border-t border-[#D4AF37]/10 pt-2">
                    <span className="text-slate-400">{t.label_invested}</span>
                    <span className="text-[#D4AF37]">{formatCurrency(investedAmount)}</span>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;
