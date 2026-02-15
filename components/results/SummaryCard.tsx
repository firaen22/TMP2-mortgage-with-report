import React from 'react';
import { formatCurrency } from '../../utils/helpers';

interface SummaryCardProps {
    t: any;
    loanAmount: number;
    outstandingLoan: number;
    isRemortgage: boolean;
    ownCash: number;
    investedAmount: number;
    reserveCash: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ t, loanAmount, outstandingLoan, isRemortgage, ownCash, investedAmount, reserveCash }) => {
    return (
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-6">
            <h3 className="text-xs font-serif text-[#D4AF37] uppercase tracking-widest mb-4">{t.card_summary}</h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-400">{isRemortgage ? t.label_loan : t.label_loan}</span>
                    <span className="text-slate-200">{formatCurrency(loanAmount)}</span>
                </div>
                {isRemortgage && (
                    <div className="flex justify-between text-rose-400/80">
                        <span>{t.label_outstanding_loan} (-)</span>
                        <span>{formatCurrency(outstandingLoan)}</span>
                    </div>
                )}
                {isRemortgage && (
                    <div className="flex justify-between border-t border-white/5 pt-2 text-[#D4AF37]">
                        <span className="font-bold">Net Cash Out</span>
                        <span className="font-bold">{formatCurrency(loanAmount - outstandingLoan)}</span>
                    </div>
                )}
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
