import React, { useState } from 'react';
import { TRANSLATIONS, Language } from './data/translations';
import { DEFAULTS } from './constants';

// Hooks
import { usePortfolio } from './hooks/usePortfolio';
import { useSimulation } from './hooks/useSimulation';
import { usePDFReport } from './hooks/usePDFReport';

// Components
import Header from './components/sections/Header';
import DisclaimerModal from './components/sections/DisclaimerModal';
import PropertyForm from './components/inputs/PropertyForm';
import AllocationForm from './components/inputs/AllocationForm';
import SummaryCard from './components/results/SummaryCard';
import KPIGrid from './components/results/KPIGrid';
import WealthChart from './components/results/WealthChart';
import FeatureCards from './components/results/FeatureCards';
import PDFReport from './components/PDFReport';

const App: React.FC = () => {
  // --- Global State ---
  const [lang, setLang] = useState<Language>('zh');
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const t = TRANSLATIONS[lang];

  // --- Input State ---
  const [propertyValue, setPropertyValue] = useState<number | string>(DEFAULTS.PROPERTY_VALUE);
  const [mortgageLTV, setMortgageLTV] = useState<number | string>(DEFAULTS.MORTGAGE_LTV);
  const [mortgageRate, setMortgageRate] = useState<number | string>(DEFAULTS.MORTGAGE_RATE);
  const [mortgageTenure, setMortgageTenure] = useState<number | string>(DEFAULTS.MORTGAGE_TENURE);
  const [reserveCashPercent, setReserveCashPercent] = useState<number>(0);

  // --- Portfolio Logic ---
  const {
    activeTab,
    setActiveTab,
    allocationIncome,
    setAllocationIncome,
    allocationHedge,
    incomeAllocations,
    hedgeAllocations,
    handleAllocationChange,
    incomeStats,
    hedgeStats,
    overallYield
  } = usePortfolio();

  // --- Simulation Logic ---
  const result = useSimulation({
    propertyValue,
    mortgageLTV,
    mortgageRate,
    mortgageTenure,
    reserveCashPercent,
    allocationIncome,
    incomeYield: incomeStats.yield,
    hedgeYield: hedgeStats.yield
  });

  // --- PDF Logic ---
  const { isDownloading, isReportVisible, handleDownloadPDF } = usePDFReport(t.title);

  return (
    <div className="min-h-screen text-slate-200 selection:bg-amber-900 selection:text-white relative font-sans bg-slate-900">

      <DisclaimerModal
        t={t}
        showDisclaimer={showDisclaimer}
        setShowDisclaimer={setShowDisclaimer}
      />

      <Header
        t={t}
        lang={lang}
        setLang={setLang}
        handleDownloadPDF={handleDownloadPDF}
        isDownloading={isDownloading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Mobile Download Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="md:hidden w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 border border-[#D4AF37]/50 rounded-lg text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 disabled:opacity-50"
        >
          {isDownloading ? '...' : 'Download Report'}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Inputs */}
          <div className="lg:col-span-4 space-y-6">
            <PropertyForm
              t={t}
              propertyValue={propertyValue}
              setPropertyValue={setPropertyValue}
              mortgageLTV={mortgageLTV}
              setMortgageLTV={setMortgageLTV}
              mortgageRate={mortgageRate}
              setMortgageRate={setMortgageRate}
              mortgageTenure={mortgageTenure}
              setMortgageTenure={setMortgageTenure}
              reserveCashPercent={reserveCashPercent}
              setReserveCashPercent={setReserveCashPercent}
              reserveCashAmount={result.reserveCash}
            />

            <SummaryCard
              t={t}
              loanAmount={result.loanAmount}
              investedAmount={result.investedAmount}
              reserveCash={result.reserveCash}
            />

            <AllocationForm
              t={t}
              allocationIncome={allocationIncome}
              setAllocationIncome={setAllocationIncome}
              allocationHedge={allocationHedge}
              investedAmount={result.investedAmount}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              incomeAllocations={incomeAllocations}
              hedgeAllocations={hedgeAllocations}
              incomeStats={incomeStats}
              hedgeStats={hedgeStats}
              handleAllocationChange={handleAllocationChange}
            />
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-8 space-y-6">
            <KPIGrid
              t={t}
              result={result}
              incomeYield={incomeStats.yield}
              mortgageRate={mortgageRate}
            />

            <WealthChart
              t={t}
              lang={lang}
              result={result}
            />

            <FeatureCards
              t={t}
              result={result}
            />

            <div className="text-[10px] text-slate-600 font-light text-justify p-4 border border-white/5">
              <p>{t.disclaimer}</p>
            </div>
          </div>
        </div>
      </main>

      <PDFReport
        t={t}
        isVisible={isReportVisible}
        result={result}
        mortgageRate={mortgageRate}
        mortgageTenure={mortgageTenure}
        allocationIncome={allocationIncome}
        allocationHedge={allocationHedge}
        incomeAllocations={incomeAllocations}
        hedgeAllocations={hedgeAllocations}
        overallYield={overallYield}
      />
    </div>
  );
};

export default App;