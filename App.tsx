import React, { useState } from 'react';
import { TRANSLATIONS, Language } from './data/translations';
import { DEFAULTS } from './constants';

// Hooks
import { usePortfolio } from './hooks/usePortfolio';
import { useSimulation } from './hooks/useSimulation';
import { usePDFReport } from './hooks/usePDFReport';
import { useHiborRate } from './hooks/useHiborRate';

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

  // --- HIBOR Data ---
  const { hiborRate: fetchedHibor, hiborDate: fetchedDate, loading: hiborLoading } = useHiborRate();

  // --- Input State ---
  const [propertyValue, setPropertyValue] = useState<number | string>(DEFAULTS.PROPERTY_VALUE);
  const [mortgageLTV, setMortgageLTV] = useState<number | string>(DEFAULTS.MORTGAGE_LTV);

  // Split Mortgage Rate into HIBOR + Spread + Cap
  const [rateMode, setRateMode] = useState<'H' | 'Cap'>('H');
  const [hiborRate, setHiborRate] = useState<number | string>(0);
  const [spreadRate, setSpreadRate] = useState<number | string>(1.3); // Default spread
  const [primeRate, setPrimeRate] = useState<number | string>(5.0);
  const [capSpread, setCapSpread] = useState<number | string>(1.75);
  const [mortgageRate, setMortgageRate] = useState<number | string>(DEFAULTS.MORTGAGE_RATE);

  // Effect to update HIBOR when fetched
  React.useEffect(() => {
    if (fetchedHibor !== null) {
      setHiborRate(fetchedHibor);
    }
  }, [fetchedHibor]);

  // Effect to calculate total mortgage rate
  React.useEffect(() => {
    if (rateMode === 'H') {
      const h = parseFloat(hiborRate.toString()) || 0;
      const s = parseFloat(spreadRate.toString()) || 0;
      setMortgageRate(h + s);
    } else {
      const p = parseFloat(primeRate.toString()) || 0;
      const cs = parseFloat(capSpread.toString()) || 0;
      setMortgageRate(Math.max(0, p - cs));
    }
  }, [hiborRate, spreadRate, primeRate, capSpread, rateMode]);

  const [mortgageTenure, setMortgageTenure] = useState<number | string>(DEFAULTS.MORTGAGE_TENURE);
  const [isRemortgage, setIsRemortgage] = useState<boolean>(false);
  const [outstandingLoan, setOutstandingLoan] = useState<number | string>(DEFAULTS.OUTSTANDING_LOAN);
  const [ownCash, setOwnCash] = useState<number | string>(0);
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
    outstandingLoan: isRemortgage ? outstandingLoan : 0,
    ownCash,
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
        hiborDate={fetchedDate || undefined}
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
              rateMode={rateMode}
              setRateMode={setRateMode}
              hiborRate={hiborRate}
              setHiborRate={setHiborRate}
              spreadRate={spreadRate}
              setSpreadRate={setSpreadRate}
              primeRate={primeRate}
              setPrimeRate={setPrimeRate}
              capSpread={capSpread}
              setCapSpread={setCapSpread}
              mortgageRate={mortgageRate} // Pass for display/calc
              setMortgageRate={setMortgageRate}
              mortgageTenure={mortgageTenure}
              setMortgageTenure={setMortgageTenure}
              isRemortgage={isRemortgage}
              setIsRemortgage={setIsRemortgage}
              outstandingLoan={outstandingLoan}
              setOutstandingLoan={setOutstandingLoan}
              ownCash={ownCash}
              setOwnCash={setOwnCash}
              reserveCashPercent={reserveCashPercent}
              setReserveCashPercent={setReserveCashPercent}
              reserveCashAmount={result.reserveCash}
            />

            <SummaryCard
              t={t}
              loanAmount={result.loanAmount}
              outstandingLoan={result.outstandingLoan}
              isRemortgage={isRemortgage}
              ownCash={result.ownCash}
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