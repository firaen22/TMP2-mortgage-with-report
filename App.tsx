import React, { useState, useMemo, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
  Calculator,
  TrendingUp,
  ShieldCheck,
  PieChart as PieIcon,
  AlertCircle,
  Briefcase,
  Home,
  Layers,
  Landmark,
  ChevronRight,
  Globe,
  Download,
  Loader2,
  DollarSign,
  FileText
} from 'lucide-react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Pie,
  Cell
} from 'recharts';
import { FUNDS, DEFAULTS } from './constants';
import { CalculationResult, SimulationYear } from './types';

// --- Theme Colors ---
const COLORS = {
  GOLD: '#D4AF37', // Champagne Gold
  GOLD_DIM: '#8a701e',
  SLATE_900: '#0f172a',
  SLATE_800: '#1e293b',
  SLATE_700: '#334155',
  TEXT_MAIN: '#f8fafc',
  TEXT_MUTED: '#94a3b8',
  INCOME: '#10b981', // Emerald
  HEDGE: '#6366f1',  // Indigo
  MORTGAGE: '#f43f5e', // Rose
  RESERVE: '#0ea5e9', // Sky Blue for Cash
  // Light Theme Colors for PDF
  PDF_BG: '#ffffff',
  PDF_TEXT: '#1e293b',
  PDF_BORDER: '#e2e8f0',
};

const PIE_COLORS_INCOME = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
const PIE_COLORS_HEDGE = ['#4338ca', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];


// --- Translations ---
type Language = 'zh' | 'en';

const TRANSLATIONS = {
  zh: {
    title: "樓宇增值模擬器",
    subtitle: "PROPERTY APPRECIATION SIMULATOR",
    nav_estate: "財富傳承",
    nav_yield: "收益增強",
    card_property: "物業與融資",
    label_valuation: "物業估值",
    label_ltv: "按揭成數 (%)",
    label_rate: "年利率 (%)",
    label_tenure: "按揭年期 (年)",
    label_reserve: "流動資金儲備",
    label_cash: "現金",
    card_allocation: "資產配置",
    label_income_alloc: "收息倉",
    label_hedge_alloc: "對沖倉",
    tab_income: "收息倉",
    tab_hedge: "對沖倉",
    label_total_alloc: "總計",
    label_avg_yield: "平均回報率",
    card_summary: "資金總覽",
    label_loan: "貸款本金",
    label_invested: "淨投資額",
    label_reserve_cash: "備用現金",
    kpi_income: "每月派息收入",
    label_yield_rate: "回報率",
    kpi_mortgage: "每月供款",
    label_rate_simple: "利率",
    kpi_net_flow: "每月淨現金流",
    label_positive_carry: "正向套利",
    chart_title: "資產增值預測",
    chart_subtitle: "30 年長線分析",
    legend_income: "收息資產",
    legend_hedge: "對沖資產",
    legend_reserve: "備用現金",
    legend_net: "淨資產",
    axis_year: "保單年度",
    tooltip_net_equity: "淨資產 (總回報)",
    tooltip_mortgage: "按揭餘額",
    tooltip_income: "收息資產",
    tooltip_hedge: "對沖資產",
    tooltip_reserve: "備用現金",
    feature_estate_title: "財富傳承保障",
    feature_estate_desc: "保證身故賠償高達戶口價值 105%，確保您的資產在市場波動中仍能完整傳承，為摯愛提供安穩保障。",
    feature_liquidity_title: "流動性與淨值",
    label_surrender_5: "第 5 年退保價值",
    label_net_equity_30: "第 30 年淨資產",
    disclaimer: "免責聲明：本模擬器僅供學習用途，不作為任何投資組合建議。預測回報基於假設表現及現行收費結構。實際結果將視乎基金表現及市場情況而定。過往表現並非未來結果的指標。",
    currency: "HKD",
    funds: {
      barings: "霸菱環球高收益債券基金",
      allianz: "安聯收益及增長基金",
      fidelity: "富達美元高收益基金",
      aia: "友邦美國高收益債券基金",
      capital_group: "資本集團全球公司債券基金",
    },
    btn_download: "下載報告",
    btn_generating: "生成中...",
    report_title: "投資分析報告",
    report_section_allocation: "資產配置分佈",
    report_section_mortgage: "按揭貸款詳情",
    report_section_cashflow: "每月現金流狀況",
    report_section_projection: "預期回報 (10 - 30年)",
    table_year: "年度",
    table_asset: "收息資產",
    table_mortgage: "按揭餘額",
    table_cash: "備用現金",
    table_net_equity: "淨資產",
    disclaimer_popup_title: "重要提示",
    disclaimer_popup_study: "本模擬器僅供學習用途。",
    disclaimer_popup_not_recommend: "不作為任何投資組合建議或財務推薦。",
    disclaimer_popup_btn: "我明白",
    generated_on: "報告生成日期: ",
  },
  en: {
    title: "Property Appreciation Simulator",
    subtitle: "PROPERTY APPRECIATION SIMULATOR",
    nav_estate: "Estate Planning",
    nav_yield: "Yield Enhancement",
    card_property: "Property & Financing",
    label_valuation: "Property Valuation",
    label_ltv: "LTV Ratio (%)",
    label_rate: "Interest Rate (%)",
    label_tenure: "Loan Tenure (Years)",
    label_reserve: "Liquidity Reserve",
    label_cash: "Cash",
    card_allocation: "Asset Allocation",
    label_income_alloc: "Income",
    label_hedge_alloc: "Hedge",
    tab_income: "Income Portfolio",
    tab_hedge: "Hedge Portfolio",
    label_total_alloc: "Total",
    label_avg_yield: "Avg. Yield",
    card_summary: "Capital Overview",
    label_loan: "Loan Principal",
    label_invested: "Net Investment",
    label_reserve_cash: "Reserve Cash",
    kpi_income: "Monthly Dividend",
    label_yield_rate: "Yield",
    kpi_mortgage: "Monthly Payment",
    label_rate_simple: "Rate",
    kpi_net_flow: "Net Cash Flow",
    label_positive_carry: "Positive Carry",
    chart_title: "Wealth Projection",
    chart_subtitle: "30-Year Analysis",
    legend_income: "Income Asset",
    legend_hedge: "Hedge Asset",
    legend_reserve: "Reserve Cash",
    legend_net: "Net Equity",
    axis_year: "Policy Year",
    tooltip_net_equity: "Net Equity (Total Return)",
    tooltip_mortgage: "Mortgage Balance",
    tooltip_income: "Income Asset",
    tooltip_hedge: "Hedge Asset",
    tooltip_reserve: "Reserve Cash",
    feature_estate_title: "Legacy Protection",
    feature_estate_desc: "Guaranteed Death Benefit at 105% of Account Value ensures your estate is preserved against market volatility, providing peace of mind.",
    feature_liquidity_title: "Liquidity & Net Worth",
    label_surrender_5: "Year 5 Surrender Value",
    label_net_equity_30: "Year 30 Net Equity",
    disclaimer: "Disclaimer: This simulator is for study purposes only and is NOT intended as portfolio advice. Projected returns are based on hypothetical performance and current fee structures. Actual results will vary based on fund performance and market conditions. Past performance is not indicative of future results.",
    currency: "HKD",
    funds: {
      barings: "Barings Global High Yield Bond",
      allianz: "Allianz Income and Growth",
      fidelity: "Fidelity US High Yield",
      aia: "AIA US High Yield Bond",
      capital_group: "Capital Group Global Corporate Bond",
    },
    btn_download: "Download Report",
    btn_generating: "Generating...",
    report_title: "Investment Analysis Report",
    report_section_allocation: "Asset Allocation",
    report_section_mortgage: "Mortgage Details",
    report_section_cashflow: "Monthly Cash Flow Status",
    report_section_projection: "Expected Returns (10 - 30 Years)",
    table_year: "Year",
    table_asset: "Income Asset",
    table_mortgage: "Mortgage Balance",
    table_cash: "Reserve Cash",
    table_net_equity: "Net Equity",
    disclaimer_popup_title: "Important Notice",
    disclaimer_popup_study: "This simulator is for study purposes only.",
    disclaimer_popup_not_recommend: "It is NOT intended as portfolio advice or financial recommendation.",
    disclaimer_popup_btn: "I Understand",
    generated_on: "Generated on: ",
  }
};

const App: React.FC = () => {
  // --- State ---
  const [lang, setLang] = useState<Language>('zh');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isReportVisible, setIsReportVisible] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const t = TRANSLATIONS[lang];

  // Input states as string | number to allow empty deletion
  const [propertyValue, setPropertyValue] = useState<number | string>(DEFAULTS.PROPERTY_VALUE);
  const [mortgageLTV, setMortgageLTV] = useState<number | string>(DEFAULTS.MORTGAGE_LTV);
  const [mortgageRate, setMortgageRate] = useState<number | string>(DEFAULTS.MORTGAGE_RATE);
  const [mortgageTenure, setMortgageTenure] = useState<number | string>(DEFAULTS.MORTGAGE_TENURE);

  const [reserveCashPercent, setReserveCashPercent] = useState<number>(0);

  // Tab state for switching between Income and Hedge configuration
  const [activeTab, setActiveTab] = useState<'income' | 'hedge'>('income');

  // Allocation State (Updated to string | number for better input handling)
  const [incomeAllocations, setIncomeAllocations] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {};
    FUNDS.forEach((f, index) => {
      initial[f.id] = index === 0 ? 100 : 0;
    });
    return initial;
  });

  const [hedgeAllocations, setHedgeAllocations] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {};
    FUNDS.forEach((f, index) => {
      initial[f.id] = index === 0 ? 100 : 0;
    });
    return initial;
  });

  const [allocationIncome, setAllocationIncome] = useState<number>(DEFAULTS.ALLOCATION_INCOME);

  // --- Derived State & Calculations ---

  // Helper to prevent NaN issues
  const safeNumber = (val: string | number): number => {
    if (val === '') return 0;
    const num = Number(val);
    return isNaN(num) || !isFinite(num) ? 0 : num;
  };

  const calculatePortfolioYield = (allocations: Record<string, string | number>) => {
    let total = 0;
    let weightedYield = 0;
    FUNDS.forEach(fund => {
      const alloc = safeNumber(allocations[fund.id]);
      total += alloc;
      weightedYield += fund.yield * (alloc / 100);
    });
    return { totalAllocation: total, yield: weightedYield };
  };

  const incomeStats = useMemo(() => calculatePortfolioYield(incomeAllocations), [incomeAllocations]);
  const hedgeStats = useMemo(() => calculatePortfolioYield(hedgeAllocations), [hedgeAllocations]);

  const overallYield = useMemo(() => {
    return (allocationIncome * incomeStats.yield + (100 - allocationIncome) * hedgeStats.yield) / 100;
  }, [allocationIncome, incomeStats.yield, hedgeStats.yield]);

  const allocationHedge = 100 - allocationIncome;

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
      // Only update if within 0-100 range (optional constraint, can relax if needed)
      // Relaxing constraint slightly to allow typing "100" naturally without getting stuck at "10" if logic was strict
      if (num >= 0 && num <= 100) {
        if (type === 'income') {
          setIncomeAllocations(prev => ({ ...prev, [id]: val })); // Keep as string to preserve "0." etc
        } else {
          setHedgeAllocations(prev => ({ ...prev, [id]: val }));
        }
      }
    }
  };

  const result: CalculationResult = useMemo(() => {
    // Convert inputs to numbers safely using safeNumber
    const valProperty = safeNumber(propertyValue);
    const valLTV = safeNumber(mortgageLTV);
    const valRate = safeNumber(mortgageRate);
    const valTenure = safeNumber(mortgageTenure);

    // 1. Mortgage Basics
    const loanAmount = valProperty * (valLTV / 100);
    const monthlyRate = (valRate / 100) / 12;
    const numPayments = valTenure * 12;

    // Calculation with safety check for tenure = 0
    let monthlyMortgage = 0;
    if (loanAmount > 0 && numPayments > 0 && monthlyRate > 0) {
      monthlyMortgage = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else if (loanAmount > 0 && numPayments > 0 && monthlyRate === 0) {
      monthlyMortgage = loanAmount / numPayments;
    }

    // 2. Investment Split
    const reserveCash = loanAmount * (reserveCashPercent / 100);
    const investedAmount = loanAmount - reserveCash;

    const initialIncomeAV = investedAmount * (allocationIncome / 100);
    const initialHedgeAV = investedAmount * (allocationHedge / 100);

    // 3. Monthly Income
    const monthlyDividend = (initialIncomeAV * (incomeStats.yield / 100)) / 12;

    // 4. Net Cash Flow
    const netMonthlyCashFlow = monthlyDividend - monthlyMortgage;

    // 5. 30-Year Simulation
    const yearlyData: SimulationYear[] = [];
    let currentHedgeAV = initialHedgeAV;
    const currentIncomeAV = initialIncomeAV;
    let currentMortgageBalance = loanAmount;

    for (let year = 1; year <= 30; year++) {
      const totalAVStart = currentIncomeAV + currentHedgeAV;

      // Fees: Years 1-5: 2.35%, Years 6+: 1.0% (Based on Account Value)
      const feeRate = year <= 5 ? DEFAULTS.FEE_RATE_INITIAL : DEFAULTS.FEE_RATE_ONGOING;
      const totalFees = totalAVStart * (feeRate / 100);

      const hedgeGrowth = currentHedgeAV * (hedgeStats.yield / 100);
      currentHedgeAV = currentHedgeAV + hedgeGrowth - totalFees;

      // Amortization
      for (let m = 0; m < 12; m++) {
        if (currentMortgageBalance > 0) {
          // Handle principal reduction
          if (numPayments > 0) {
            const interest = currentMortgageBalance * monthlyRate;
            const principal = monthlyMortgage - interest;
            currentMortgageBalance -= principal;
          }
          if (currentMortgageBalance < 0) currentMortgageBalance = 0;
        }
      }

      // Surrender Value (2 year penalty)
      // Note: Reserve Cash is assumed to be liquid and penalty-free
      const isSurrenderPenalty = year <= 2;
      const portfolioSurrenderValue = isSurrenderPenalty
        ? (currentIncomeAV + currentHedgeAV) * 0.9
        : (currentIncomeAV + currentHedgeAV);
      const surrenderValue = portfolioSurrenderValue + reserveCash;

      const totalAV = currentIncomeAV + (currentHedgeAV > 0 ? currentHedgeAV : 0);
      const totalAssets = totalAV + reserveCash;

      yearlyData.push({
        year,
        incomeAV: currentIncomeAV,
        hedgeAV: currentHedgeAV > 0 ? currentHedgeAV : 0,
        reserveCash,
        totalAV,
        surrenderValue,
        totalFeesPaid: totalFees,
        mortgageBalance: currentMortgageBalance,
        netEquity: totalAssets - currentMortgageBalance
      });
    }

    return {
      loanAmount,
      investedAmount,
      reserveCash,
      monthlyMortgage,
      monthlyDividend,
      netMonthlyCashFlow,
      yearlyData
    };
  }, [propertyValue, mortgageLTV, mortgageRate, mortgageTenure, reserveCashPercent, allocationIncome, incomeStats.yield, hedgeStats.yield]);

  // --- Data Preparation for Report ---
  const incomePieData = useMemo(() => {
    return FUNDS.map(fund => ({
      name: t.funds[fund.id] || fund.name,
      value: safeNumber(incomeAllocations[fund.id])
    })).filter(item => item.value > 0);
  }, [incomeAllocations, t.funds]);

  const hedgePieData = useMemo(() => {
    return FUNDS.map(fund => ({
      name: t.funds[fund.id] || fund.name,
      value: safeNumber(hedgeAllocations[fund.id])
    })).filter(item => item.value > 0);
  }, [hedgeAllocations, t.funds]);

  // Data Prepared directly from result.yearlyData

  // --- PDF Generation ---
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setIsReportVisible(true); // Render the report in the off-screen area

    // Wait for the report container to render and Recharts to settle (remove animation)
    setTimeout(async () => {
      const page1 = document.getElementById('pdf-report-page-1');
      const page2 = document.getElementById('pdf-report-page-2');

      if (!page1 || !page2) {
        setIsDownloading(false);
        setIsReportVisible(false);
        return;
      }

      try {
        // Capture Page 1
        const canvas1 = await html2canvas(page1, {
          scale: 2, // High resolution
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
          windowWidth: page1.scrollWidth,
          windowHeight: page1.scrollHeight
        });
        const imgData1 = canvas1.toDataURL('image/png');

        // Capture Page 2
        const canvas2 = await html2canvas(page2, {
          scale: 2, // High resolution
          backgroundColor: '#ffffff',
          useCORS: true,
          logging: false,
          windowWidth: page2.scrollWidth,
          windowHeight: page2.scrollHeight
        });
        const imgData2 = canvas2.toDataURL('image/png');

        // Initialize PDF (A4 Portrait)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        // const pdfHeight = pdf.internal.pageSize.getHeight(); 

        // Add Page 1
        // Calculate ratio to fit width exactly
        const imgProps1 = pdf.getImageProperties(imgData1);
        const pdfHeight1 = (imgProps1.height * pdfWidth) / imgProps1.width;
        pdf.addImage(imgData1, 'PNG', 0, 0, pdfWidth, pdfHeight1);

        // Add Page 2
        pdf.addPage();
        const imgProps2 = pdf.getImageProperties(imgData2);
        const pdfHeight2 = (imgProps2.height * pdfWidth) / imgProps2.width;
        pdf.addImage(imgData2, 'PNG', 0, 0, pdfWidth, pdfHeight2);

        pdf.save(`${t.title}_Analysis.pdf`);

      } catch (error) {
        console.error('PDF Generation failed:', error);
        alert('Generating PDF failed. Please try again.');
      } finally {
        setIsDownloading(false);
        setIsReportVisible(false); // Remove from DOM
      }
    }, 1500); // Delay to ensure charts render
  };

  // --- Formatters ---
  const formatCurrency = (val: number, compact = false) =>
    new Intl.NumberFormat(lang === 'zh' ? 'zh-HK' : 'en-US', {
      style: 'currency',
      currency: 'HKD',
      maximumFractionDigits: 0,
      notation: compact ? 'compact' : 'standard'
    }).format(val);

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
    <div className="min-h-screen text-slate-200 selection:bg-amber-900 selection:text-white relative">
      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDisclaimer(false)}></div>
          <div className="relative bg-slate-900 border border-[#D4AF37]/50 p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="text-[#D4AF37]" size={28} />
              <h2 className="text-2xl font-serif text-white">{t.disclaimer_popup_title}</h2>
            </div>
            <div className="space-y-4 text-slate-300 mb-8">
              <p className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0"></span>
                <span>{t.disclaimer_popup_study}</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0"></span>
                <span>{t.disclaimer_popup_not_recommend}</span>
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full py-3 bg-[#D4AF37] text-slate-900 font-bold uppercase tracking-widest hover:bg-[#D4AF37]/90 transition-all"
            >
              {t.disclaimer_popup_btn}
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-[40]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-[#D4AF37]/30 rounded-none bg-[#D4AF37]/5">
              <Landmark size={24} color={COLORS.GOLD} />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-slate-100 tracking-wide">
                {t.title}
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-[#D4AF37]/50 rounded text-xs font-medium text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              <span>{isDownloading ? t.btn_generating : t.btn_download}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-700 rounded text-xs font-light hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
            >
              <Globe size={14} />
              <span>{lang === 'zh' ? 'EN' : '繁'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Mobile Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="md:hidden w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 border border-[#D4AF37]/50 rounded-lg text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 disabled:opacity-50"
        >
          {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          <span>{isDownloading ? t.btn_generating : t.btn_download}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Inputs */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. Property Inputs */}
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
                  <p className="text-right text-xs text-slate-500 mt-2">{t.label_cash}: {formatCurrency(result.reserveCash)}</p>
                </div>
              </div>
            </GlassCard>

            {/* 2. Capital Overview (Moved Up) */}
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-6">
              <h3 className="text-xs font-serif text-[#D4AF37] uppercase tracking-widest mb-4">{t.card_summary}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">{t.label_loan}</span>
                  <span className="text-slate-200">{formatCurrency(result.loanAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-[#D4AF37]/10 pt-2">
                  <span className="text-slate-400">{t.label_reserve_cash}</span>
                  <span className="text-slate-200">{formatCurrency(result.reserveCash)}</span>
                </div>
                <div className="flex justify-between border-t border-[#D4AF37]/10 pt-2">
                  <span className="text-slate-400">{t.label_invested}</span>
                  <span className="text-[#D4AF37]">{formatCurrency(result.investedAmount)}</span>
                </div>
              </div>
            </div>

            {/* 3. Allocation Panel */}
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
                    <span>{formatCurrency(result.investedAmount * (allocationIncome / 100), true)}</span>
                    <span>{formatCurrency(result.investedAmount * (allocationHedge / 100), true)}</span>
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

          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-8 space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-full blur-2xl -mr-8 -mt-8 transition-all group-hover:bg-emerald-500/20"></div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400">{t.kpi_income}</p>
                  <p className="text-xs text-emerald-500 mt-1">{t.label_yield_rate} {incomeStats.yield.toFixed(2)}%</p>
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

            {/* Main Chart */}
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

            {/* Feature Highlights */}
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
                        <span className="text-slate-200">{formatCurrency(result.yearlyData[4].surrenderValue)}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 uppercase tracking-wider">{t.label_net_equity_30}</span>
                        <span className="text-[#D4AF37] text-sm font-serif">{formatCurrency(result.yearlyData[29].netEquity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="text-[10px] text-slate-600 font-light text-justify p-4 border border-white/5">
              <p>{t.disclaimer}</p>
            </div>

          </div>
        </div>
      </main>

      {/* --- HIDDEN REPORT CONTAINER --- */}
      {/* 
          Moved off-screen to avoid clipping issues with html2canvas when content > viewport.
          Fixed position, full width A4 logic.
      */}
      {isReportVisible && (
        <>
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
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t.label_loan}</p>
                <p className="text-xl font-medium text-slate-800">{formatCurrency(result.loanAmount)}</p>
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
                  {/* Fixed: Use Grid for legend to avoid cutting off text if many funds */}
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
                  {/* Fixed: Use Grid for legend to avoid cutting off text if many funds */}
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
                  <p className="text-2xl font-bold text-emerald-700">{formatCurrency(result.monthlyDividend, true)}</p>
                </div>
                <div className="p-4 bg-rose-50 text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.kpi_mortgage}</p>
                  <p className="text-2xl font-bold text-rose-700">-{formatCurrency(result.monthlyMortgage, true)}</p>
                </div>
                <div className={`p-4 text-center ${result.netMonthlyCashFlow >= 0 ? 'bg-indigo-50' : 'bg-orange-50'}`}>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.kpi_net_flow}</p>
                  <p className={`text-2xl font-bold ${result.netMonthlyCashFlow >= 0 ? 'text-indigo-700' : 'text-orange-700'}`}>
                    {result.netMonthlyCashFlow > 0 ? '+' : ''}{formatCurrency(result.netMonthlyCashFlow, true)}
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
                          <td className="px-1 py-1.5 text-right text-slate-700 font-mono text-[9px]">{formatCurrency(data.totalAV, true)}</td>
                          <td className="px-1 py-1.5 text-right text-rose-600 font-mono text-[9px]">-{formatCurrency(data.mortgageBalance, true)}</td>
                          <td className="px-1 py-1.5 text-right text-slate-700 font-mono text-[9px]">{formatCurrency(data.reserveCash, true)}</td>
                          <td className="px-1 py-1.5 text-right font-mono font-bold text-slate-900 text-[9px]">
                            {formatCurrency(data.netEquity, true)}
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
                          <td className="px-1 py-1.5 text-right text-slate-700 font-mono text-[9px]">{formatCurrency(data.totalAV, true)}</td>
                          <td className="px-1 py-1.5 text-right text-rose-600 font-mono text-[9px]">-{formatCurrency(data.mortgageBalance, true)}</td>
                          <td className="px-1 py-1.5 text-right text-slate-700 font-mono text-[9px]">{formatCurrency(data.reserveCash, true)}</td>
                          <td className="px-1 py-1.5 text-right font-mono font-bold text-slate-900 text-[9px]">
                            {formatCurrency(data.netEquity, true)}
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
      )}

    </div>
  );
};

// Helper Icon
const DollarSignIcon = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
);

// Custom Glass Card (Moved outside App)
const GlassCard = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-slate-800/40 backdrop-blur-md border border-white/5 shadow-xl rounded-none ${className}`}>
    {children}
  </div>
);

const PieChart = ({ width, height, children }: { width?: number; height?: number; children?: React.ReactNode }) => {
  // Fix for Recharts ResponsiveContainer warning: "width(-1) and height(-1) of chart should be greater than 0"
  // This ensures a valid positive dimension is always passed to ComposedChart, even if measurement fails momentarily.
  const safeWidth = width && width > 0 ? width : 150;
  const safeHeight = height && height > 0 ? height : 150;

  return (
    <ComposedChart width={safeWidth} height={safeHeight} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
      {children}
    </ComposedChart>
  );
};

export default App;