import { Fund } from './types';

export const FUNDS: Fund[] = [
  { id: 'barings', name: '霸菱環球高收益債券基金', yield: 9.94, riskLevel: 'High' },
  { id: 'allianz', name: '安聯收益及增長基金', yield: 8.08, riskLevel: 'Medium' },
  { id: 'fidelity', name: '富達美元高收益基金', yield: 7.36, riskLevel: 'Medium' },
  { id: 'aia', name: '友邦美國高收益債券基金', yield: 7.07, riskLevel: 'Medium' },
  { id: 'capital_group', name: '資本集團全球公司債券基金', yield: 4.80, riskLevel: 'Low' },
];

export const DEFAULTS = {
  PROPERTY_VALUE: 8000000,
  MORTGAGE_LTV: 70,
  MORTGAGE_RATE: 3.375,
  MORTGAGE_TENURE: 30,
  RESERVE_CASH_PERCENT: 10, // Percentage of Loan Amount kept as cash
  ALLOCATION_INCOME: 70, // Percentage allocated to Income Portfolio

  // New Fee Structure based on Account Value
  FEE_RATE_INITIAL: 2.35, // % per annum for first 5 years (based on Account Value)
  FEE_RATE_ONGOING: 1.0,  // % per annum from year 6 onwards (based on Account Value)

  SURRENDER_PENALTY_YEARS: 2, // Simplified for UI logic
};

// --- Theme Colors ---
export const COLORS = {
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

export const PIE_COLORS_INCOME = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
export const PIE_COLORS_HEDGE = ['#4338ca', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];