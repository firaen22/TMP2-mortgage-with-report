import React, { useMemo } from 'react';
import { Landmark } from 'lucide-react';
import { Pie, Cell, ResponsiveContainer, PieChart } from 'recharts';
import { formatCurrency, safeNumber } from '../utils/helpers';
import { FUNDS, PIE_COLORS_INCOME, PIE_COLORS_HEDGE } from '../constants';
import { CalculationResult } from '../types';

interface PDFReportProps {
    t: any;
    isVisible: boolean;
    result: CalculationResult;
    mortgageRate: string | number;
    mortgageTenure: string | number;
    allocationIncome: number;
    allocationHedge: number;
    incomeAllocations: Record<string, string | number>;
    hedgeAllocations: Record<string, string | number>;
    overallYield: number;
}

const PDFReport: React.FC<PDFReportProps> = ({
    t,
    isVisible,
    result,
    mortgageRate,
    mortgageTenure,
    allocationIncome,
    allocationHedge,
    incomeAllocations,
    hedgeAllocations,
    overallYield
}) => {
    // Data Preparation for Report
    const incomePieData = useMemo(() => {
        return FUNDS.map(fund => ({
            // @ts-ignore
            name: t.funds[fund.id] || fund.name,
            value: safeNumber(incomeAllocations[fund.id])
        })).filter(item => item.value > 0);
    }, [incomeAllocations, t.funds]);

    const hedgePieData = useMemo(() => {
        return FUNDS.map(fund => ({
            // @ts-ignore
            name: t.funds[fund.id] || fund.name,
            value: safeNumber(hedgeAllocations[fund.id])
        })).filter(item => item.value > 0);
    }, [hedgeAllocations, t.funds]);

    if (!isVisible) return null;

    return (
        <>
            {/* Page 1 */}
            <div
                id="pdf-report-page-1"
                className="fixed top-0 left-[-10000px] w-[210mm] min-h-[297mm] bg-white text-slate-800 p-[15mm] shadow-none z-0"
            >
                {/* Report Header */}
                <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif text-slate-900 font-bold mb-1">{t.report_title}</h1>
                        <p className="text-sm text-slate-500 tracking-wide">{t.subtitle}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl text-[#D4AF37] mb-1">
                            <Landmark />
                        </div>
                        <p className="text-xs text-slate-400">{t.generated_on} {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Summary Boxes */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{t.label_loan}</p>
                        <p className="text-xl font-medium text-slate-800">{formatCurrency(result.loanAmount)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{t.label_own_cash}</p>
                        <p className="text-xl font-medium text-slate-800">{formatCurrency(result.ownCash)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{t.label_invested}</p>
                        <p className="text-xl font-medium text-[#D4AF37]">{formatCurrency(result.investedAmount)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 border border-slate-100">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">{t.label_reserve_cash}</p>
                        <p className="text-xl font-medium text-slate-800">{formatCurrency(result.reserveCash)}</p>
                    </div>
                </div>

                {/* New: Mortgage Details Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-rose-500 pl-3 mb-4">{t.report_section_mortgage}</h3>
                    <div className="grid grid-cols-3 gap-6 text-sm">
                        <div className="flex flex-col">
                            <span className="text-slate-500 mb-1">{t.label_rate}</span>
                            <span className="font-bold text-slate-800">{safeNumber(mortgageRate)}%</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 mb-1">{t.label_tenure}</span>
                            <span className="font-bold text-slate-800">{safeNumber(mortgageTenure)}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 mb-1">{t.kpi_mortgage}</span>
                            <span className="font-bold text-rose-600">-{formatCurrency(result.monthlyMortgage)}</span>
                        </div>
                    </div>
                </div>

                {/* 1. Allocation Pie Charts */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-[#D4AF37] pl-3 mb-4">{t.report_section_allocation}</h3>
                    <div className="grid grid-cols-2 gap-8">
                        {/* Income Pie */}
                        <div className="bg-slate-50 p-4 rounded border border-slate-100">
                            <p className="text-center font-bold text-emerald-700 mb-2">{t.label_income_alloc} ({allocationIncome}%)</p>
                            <div className="h-40 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={incomePieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                            isAnimationActive={false} // Crucial for PDF
                                        >
                                            {incomePieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS_INCOME[index % PIE_COLORS_INCOME.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-2 text-xs text-slate-600 grid grid-cols-1 gap-1">
                                {incomePieData.map((entry, index) => (
                                    <div key={index} className="flex justify-between items-start border-b border-slate-100 pb-1 last:border-0">
                                        <span className="text-left leading-tight pr-2">{entry.name}</span>
                                        <span className="text-right font-mono whitespace-nowrap">{entry.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Hedge Pie */}
                        <div className="bg-slate-50 p-4 rounded border border-slate-100">
                            <p className="text-center font-bold text-indigo-700 mb-2">{t.label_hedge_alloc} ({allocationHedge}%)</p>
                            <div className="h-40 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={hedgePieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={70}
                                            paddingAngle={2}
                                            dataKey="value"
                                            isAnimationActive={false} // Crucial for PDF
                                        >
                                            {hedgePieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS_HEDGE[index % PIE_COLORS_HEDGE.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-2 text-xs text-slate-600 grid grid-cols-1 gap-1">
                                {hedgePieData.map((entry, index) => (
                                    <div key={index} className="flex justify-between items-start border-b border-slate-100 pb-1 last:border-0">
                                        <span className="text-left leading-tight pr-2">{entry.name}</span>
                                        <span className="text-right font-mono whitespace-nowrap">{entry.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Average Yield Display */}
                    <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                        <span className="text-sm text-slate-500 uppercase tracking-wider">{t.label_avg_yield}: </span>
                        <span className="text-xl font-bold text-[#D4AF37]">{overallYield.toFixed(2)}%</span>
                    </div>
                </div>

                {/* 2. Monthly Cash Flow */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 mb-4">{t.report_section_cashflow}</h3>
                    <div className="grid grid-cols-3 divide-x divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                        <div className="p-4 bg-emerald-50 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.kpi_income}</p>
                            <p className="text-2xl font-bold text-emerald-700">{formatCurrency(result.monthlyDividend, 'zh', false)}</p>
                        </div>
                        <div className="p-4 bg-rose-50 text-center">
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.kpi_mortgage}</p>
                            <p className="text-2xl font-bold text-rose-700">-{formatCurrency(result.monthlyMortgage, 'zh', false)}</p>
                        </div>
                        <div className={`p-4 text-center ${result.netMonthlyCashFlow >= 0 ? 'bg-indigo-50' : 'bg-orange-50'}`}>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.kpi_net_flow}</p>
                            <p className={`text-2xl font-bold ${result.netMonthlyCashFlow >= 0 ? 'text-indigo-700' : 'text-orange-700'}`}>
                                {result.netMonthlyCashFlow > 0 ? '+' : ''}{formatCurrency(result.netMonthlyCashFlow, 'zh', false)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page 2: Projection & Disclaimer (Including Header for context) */}
            <div
                id="pdf-report-page-2"
                className="fixed top-0 left-[-10000px] w-[210mm] min-h-[297mm] bg-white text-slate-800 p-[15mm] shadow-none z-0"
            >
                {/* Header Repeated for Page 2 */}
                <div className="flex justify-between items-center border-b-2 border-slate-200 pb-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-serif text-slate-900 font-bold mb-1">{t.report_title}</h1>
                        <p className="text-sm text-slate-500 tracking-wide">{t.subtitle}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl text-[#D4AF37] mb-1">
                            <Landmark />
                        </div>
                        <p className="text-xs text-slate-400">{t.generated_on} {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* 3. Projection Table (Full 30 Years) */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-slate-500 pl-3 mb-4">{t.report_section_projection}</h3>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Left Column: Years 1-15 */}
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-100 text-slate-600 font-bold">
                                <tr>
                                    <th className="px-1 py-2">{t.table_year}</th>
                                    <th className="px-1 py-2 text-right">{t.table_asset}</th>
                                    <th className="px-1 py-2 text-right">{t.table_mortgage}</th>
                                    <th className="px-1 py-2 text-right">{t.table_cash}</th>
                                    <th className="px-1 py-2 text-right">{t.table_net_equity}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {result.yearlyData.slice(0, 15).map(data => {
                                    return (
                                        <tr key={data.year} className="hover:bg-slate-50">
                                            <td className="px-1 py-1.5 font-medium text-slate-800">{data.year}</td>
                                            <td className="px-1 py-1.5 text-right text-slate-700 font-mono text-[9px]">{formatCurrency(data.totalAV, 'zh', false)}</td>
                                            <td className="px-1 py-1.5 text-right text-rose-600 font-mono text-[9px]">-{formatCurrency(data.mortgageBalance, 'zh', false)}</td>
                                            <td className="px-1 py-1.5 text-right text-slate-700 font-mono text-[9px]">{formatCurrency(data.reserveCash, 'zh', false)}</td>
                                            <td className="px-1 py-1.5 text-right font-mono font-bold text-slate-900 text-[9px]">
                                                {formatCurrency(data.netEquity, 'zh', false)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Right Column: Years 16-30 */}
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-100 text-slate-600 font-bold">
                                <tr>
                                    <th className="px-1 py-2">{t.table_year}</th>
                                    <th className="px-1 py-2 text-right">{t.table_asset}</th>
                                    <th className="px-1 py-2 text-right">{t.table_mortgage}</th>
                                    <th className="px-1 py-2 text-right">{t.table_cash}</th>
                                    <th className="px-1 py-2 text-right">{t.table_net_equity}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {result.yearlyData.slice(15, 30).map(data => {
                                    return (
                                        <tr key={data.year} className="hover:bg-slate-50">
                                            <td className="px-1 py-1.5 font-medium text-slate-800">{data.year}</td>
                                            <td className="px-1 py-1.5 text-right text-slate-700 font-mono text-[9px]">{formatCurrency(data.totalAV, 'zh', false)}</td>
                                            <td className="px-1 py-1.5 text-right text-rose-600 font-mono text-[9px]">-{formatCurrency(data.mortgageBalance, 'zh', false)}</td>
                                            <td className="px-1 py-1.5 text-right text-slate-700 font-mono text-[9px]">{formatCurrency(data.reserveCash, 'zh', false)}</td>
                                            <td className="px-1 py-1.5 text-right font-mono font-bold text-slate-900 text-[9px]">
                                                {formatCurrency(data.netEquity, 'zh', false)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="absolute bottom-10 left-0 w-full text-center">
                    <p className="text-[10px] text-slate-400 max-w-2xl mx-auto border-t border-slate-100 pt-2 px-8">
                        {t.disclaimer}
                    </p>
                </div>
            </div>
        </>
    );
};

export default PDFReport;
