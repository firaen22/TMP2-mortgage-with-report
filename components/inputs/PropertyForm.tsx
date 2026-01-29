import React from 'react';
import { Home } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import { formatCurrency } from '../../utils/helpers';

interface PropertyFormProps {
    t: any;
    propertyValue: number | string;
    setPropertyValue: (val: number | string) => void;
    mortgageLTV: number | string;
    setMortgageLTV: (val: number | string) => void;
    mortgageRate: number | string;
    setMortgageRate: (val: number | string) => void;
    mortgageTenure: number | string;
    setMortgageTenure: (val: number | string) => void;
    ownCash: number | string;
    setOwnCash: (val: number | string) => void;
    reserveCashPercent: number;
    setReserveCashPercent: (val: number) => void;
    reserveCashAmount: number; // For display
}

const PropertyForm: React.FC<PropertyFormProps> = ({
    t,
    propertyValue,
    setPropertyValue,
    mortgageLTV,
    setMortgageLTV,
    mortgageRate,
    setMortgageRate,
    mortgageTenure,
    setMortgageTenure,
    ownCash,
    setOwnCash,
    reserveCashPercent,
    setReserveCashPercent,
    reserveCashAmount
}) => {
    return (
        <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Home className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="font-serif text-lg tracking-wide text-slate-100">{t.card_property}</h2>
            </div>

            <div className="space-y-6">
                <div className="group">
                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 group-focus-within:text-[#D4AF37] transition-colors">{t.label_valuation}</label>
                    <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 text-lg font-serif">{t.currency}</span>
                        <input
                            type="number"
                            value={propertyValue}
                            onChange={(e) => setPropertyValue(e.target.value)}
                            className="w-full pl-12 bg-transparent border-b border-slate-700 py-2 text-xl font-serif text-slate-100 focus:outline-none focus:border-[#D4AF37] transition-all"
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-2 group-focus-within:text-[#D4AF37] transition-colors">{t.label_own_cash}</label>
                    <div className="relative">
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 text-lg font-serif">{t.currency}</span>
                        <input
                            type="number"
                            value={ownCash}
                            onChange={(e) => setOwnCash(e.target.value)}
                            className="w-full pl-12 bg-transparent border-b border-slate-700 py-2 text-xl font-serif text-slate-100 focus:outline-none focus:border-[#D4AF37] transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-2 truncate" title={t.label_ltv}>{t.label_ltv}</label>
                        <input
                            type="number"
                            value={mortgageLTV}
                            onChange={(e) => setMortgageLTV(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 px-2 py-2 text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-2 truncate" title={t.label_rate}>{t.label_rate}</label>
                        <input
                            type="number"
                            step="0.1"
                            value={mortgageRate}
                            onChange={(e) => setMortgageRate(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 px-2 py-2 text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[10px] uppercase tracking-wider text-slate-500 mb-2 truncate" title={t.label_tenure}>{t.label_tenure}</label>
                        <input
                            type="number"
                            value={mortgageTenure}
                            onChange={(e) => setMortgageTenure(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 px-2 py-2 text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-500 mb-3">{t.label_reserve}</label>
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={reserveCashPercent}
                            onChange={(e) => setReserveCashPercent(Number(e.target.value))}
                            className="flex-1 h-0.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#D4AF37] [&::-webkit-slider-thumb]:rounded-none [&::-webkit-slider-thumb]:rotate-45"
                        />
                        <span className="font-serif text-[#D4AF37]">{reserveCashPercent}%</span>
                    </div>
                    <p className="text-right text-xs text-slate-500 mt-2">{t.label_cash}: {formatCurrency(reserveCashAmount)}</p>
                </div>
            </div>
        </GlassCard>
    );
};

export default PropertyForm;
