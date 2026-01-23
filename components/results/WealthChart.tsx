import React from 'react';
import {
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart
} from 'recharts';
import GlassCard from '../ui/GlassCard';
import { formatCurrency } from '../../utils/helpers';
import { COLORS } from '../../constants';
import { CalculationResult } from '../../types';

interface WealthChartProps {
    t: any;
    lang: 'zh' | 'en';
    result: CalculationResult;
}

const WealthChart: React.FC<WealthChartProps> = ({ t, lang, result }) => {
    return (
        <GlassCard className="p-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h3 className="text-xl font-serif text-slate-100 flex items-center gap-2">
                        {t.chart_title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{t.chart_subtitle}</p>
                </div>
                <div className="flex gap-4 text-[10px] uppercase tracking-wider text-slate-400">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> {t.legend_income}</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-500 rounded-full"></div> {t.legend_hedge}</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-sky-500 rounded-full"></div> {t.legend_reserve}</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-0.5 bg-[#D4AF37]"></div> {t.legend_net}</span>
                </div>
            </div>

            <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={result.yearlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.INCOME} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS.INCOME} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorHedge" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.HEDGE} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS.HEDGE} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorReserve" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={COLORS.RESERVE} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={COLORS.RESERVE} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                        <XAxis
                            dataKey="year"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'sans-serif' }}
                            label={{ value: t.axis_year, position: 'insideBottom', offset: -10, fill: '#475569', fontSize: 10 }}
                        />
                        <YAxis
                            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'sans-serif' }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                            itemStyle={{ padding: 0 }}
                            formatter={(value: number, name: string) => [
                                formatCurrency(value),
                                name === 'netEquity' ? t.tooltip_net_equity :
                                    name === 'mortgageBalance' ? t.tooltip_mortgage :
                                        name === 'incomeAV' ? t.tooltip_income :
                                            name === 'hedgeAV' ? t.tooltip_hedge :
                                                name === 'reserveCash' ? t.tooltip_reserve : name
                            ]}
                            labelFormatter={(label) => lang === 'zh' ? `第 ${label} 年` : `Year ${label}`}
                        />

                        <Area
                            type="monotone"
                            dataKey="reserveCash"
                            stackId="1"
                            stroke={COLORS.RESERVE}
                            fill="url(#colorReserve)"
                            name="reserveCash"
                        />
                        <Area
                            type="monotone"
                            dataKey="incomeAV"
                            stackId="1"
                            stroke={COLORS.INCOME}
                            fill="url(#colorIncome)"
                            name="incomeAV"
                        />
                        <Area
                            type="monotone"
                            dataKey="hedgeAV"
                            stackId="1"
                            stroke={COLORS.HEDGE}
                            fill="url(#colorHedge)"
                            name="hedgeAV"
                        />
                        <Line
                            type="monotone"
                            dataKey="mortgageBalance"
                            stroke={COLORS.MORTGAGE}
                            strokeWidth={1}
                            strokeDasharray="4 4"
                            name="mortgageBalance"
                            dot={false}
                            opacity={0.7}
                        />
                        <Line
                            type="monotone"
                            dataKey="netEquity"
                            stroke={COLORS.GOLD}
                            strokeWidth={2}
                            name="netEquity"
                            dot={false}
                            activeDot={{ r: 6, fill: COLORS.GOLD, stroke: '#000' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};

export default WealthChart;
