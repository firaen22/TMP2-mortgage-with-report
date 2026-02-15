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
    hiborRate: number | string;
    setHiborRate: (val: number | string) => void;
    spreadRate: number | string;
    setSpreadRate: (val: number | string) => void;
    rateMode: 'H' | 'Cap';
    setRateMode: (mode: 'H' | 'Cap') => void;
    primeRate: number | string;
    setPrimeRate: (val: number | string) => void;
    capSpread: number | string;
    setCapSpread: (val: number | string) => void;
    hRate: number;
    pRate: number;
    mortgageTenure: number | string;
    setMortgageTenure: (val: number | string) => void;
    isRemortgage: boolean;
    setIsRemortgage: (val: boolean) => void;
    outstandingLoan: number | string;
    setOutstandingLoan: (val: number | string) => void;
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
    hiborRate,
    setHiborRate,
    spreadRate,
    setSpreadRate,
    rateMode,
    setRateMode,
    primeRate,
    setPrimeRate,
    capSpread,
    setCapSpread,
    hRate,
    pRate,
    mortgageTenure,
    setMortgageTenure,
    isRemortgage,
    setIsRemortgage,
    outstandingLoan,
    setOutstandingLoan,
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
                {/* Property Value Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-xs uppercase tracking-wider text-slate-500">{t.label_property_value}</label>

                        {/* Remortgage Toggle */}
                        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded border border-white/5">
                            <span className={`text-[10px] uppercase tracking-tighter ${!isRemortgage ? 'text-[#D4AF37] font-bold' : 'text-slate-500'}`}>{t.label_full_paid}</span>
                            <button
                                onClick={() => setIsRemortgage(!isRemortgage)}
                                className="relative w-8 h-4 bg-slate-700 rounded-full transition-colors focus:outline-none"
                            >
                                <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${isRemortgage ? 'translate-x-4' : 'translate-x-0'}`} />
                            </button>
                            <span className={`text-[10px] uppercase tracking-tighter ${isRemortgage ? 'text-[#D4AF37] font-bold' : 'text-slate-500'}`}>{t.label_remortgage}</span>
                        </div>
                    </div>

                    <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">HKD</span>
                        <input
                            type="number"
                            value={propertyValue}
                            onChange={(e) => setPropertyValue(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 px-12 py-3 text-2xl font-serif text-slate-100 focus:outline-none focus:border-[#D4AF37] transition-all"
                        />
                    </div>

                    {/* Conditional Outstanding Loan Input */}
                    {isRemortgage && (
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-[#D4AF37]/20 space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="block text-xs uppercase tracking-wider text-[#D4AF37]">{t.label_outstanding_loan}</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">HKD</span>
                                <input
                                    type="number"
                                    value={outstandingLoan}
                                    onChange={(e) => setOutstandingLoan(e.target.value)}
                                    className="w-full bg-slate-900/60 border border-slate-700 px-12 py-2 text-lg font-serif text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                                />
                            </div>
                        </div>
                    )}
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

                {/* Rate Section (H & P simultaneously) */}
                <div className="space-y-4">
                    <label className="block text-xs uppercase tracking-wider text-slate-500">{t.label_rate}</label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* H Plan Section */}
                        <div
                            onClick={() => setRateMode('H')}
                            className={`p-4 rounded-lg border transition-all cursor-pointer relative ${rateMode === 'H' ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/20' : 'bg-slate-900/30 border-white/5 hover:border-white/10'}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] uppercase tracking-widest ${rateMode === 'H' ? 'text-[#D4AF37] font-bold' : 'text-slate-500'}`}>H Plan</span>
                                {hRate < pRate && (
                                    <span className="text-[8px] px-1.5 py-0.5 bg-[#D4AF37] text-slate-900 font-bold uppercase">{t.label_lower}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">HIBOR (H)</label>
                                    <input
                                        type="number"
                                        step="0.00001"
                                        value={hiborRate}
                                        readOnly={true}
                                        className="w-full bg-slate-900/50 border border-slate-700 px-2 py-1.5 text-xs text-slate-400 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Spread</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={spreadRate}
                                        onChange={(e) => setSpreadRate(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-slate-900/50 border border-slate-700 px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-white/5 pt-2">
                                <span className="text-[9px] text-slate-500 uppercase">Effective Rate</span>
                                <span className="text-xl font-serif text-[#D4AF37]">{hRate.toFixed(3)}%</span>
                            </div>
                        </div>

                        {/* Cap Rate Section */}
                        <div
                            onClick={() => setRateMode('Cap')}
                            className={`p-4 rounded-lg border transition-all cursor-pointer relative ${rateMode === 'Cap' ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/20' : 'bg-slate-900/30 border-white/5 hover:border-white/10'}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-[10px] uppercase tracking-widest ${rateMode === 'Cap' ? 'text-[#D4AF37] font-bold' : 'text-slate-500'}`}>Cap Rate</span>
                                {pRate < hRate && (
                                    <span className="text-[8px] px-1.5 py-0.5 bg-[#D4AF37] text-slate-900 font-bold uppercase">{t.label_lower}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Prime (P)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={primeRate}
                                        onChange={(e) => setPrimeRate(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-slate-900/50 border border-slate-700 px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[8px] uppercase tracking-wider text-slate-500 mb-1">Spread (-)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={capSpread}
                                        onChange={(e) => setCapSpread(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-slate-900/50 border border-slate-700 px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-white/5 pt-2">
                                <span className="text-[9px] text-slate-500 uppercase">Effective Rate</span>
                                <span className="text-xl font-serif text-[#D4AF37]">{pRate.toFixed(3)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
