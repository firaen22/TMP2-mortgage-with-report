import { Fund } from './types';

// Static metadata for each fund (names, risk levels) — never changes
export const FUND_METADATA: Array<Omit<Fund, 'yield'>> = [
  { id: 'barings',          name: '霸菱環球高收益債券基金',             riskLevel: 'High'   },
  { id: 'allianz',          name: '安聯收益及增長基金',                 riskLevel: 'Medium' },
  { id: 'fidelity',         name: '富達美元高收益基金',                 riskLevel: 'Medium' },
  { id: 'aia',              name: '友邦美國高收益債券基金',             riskLevel: 'Medium' },
  { id: 'capital_group',    name: '資本集團全球公司債券基金',           riskLevel: 'Low'    },
  { id: 'janus_henderson',  name: '駿利亨德森平衡基金',                 riskLevel: 'Medium' },
  { id: 'principal_global', name: '信安環球投資基金 - 優先證券基金',   riskLevel: 'Low'    },
];

// Static fallback yields used when live data is unavailable
export const FALLBACK_YIELDS: Record<string, number> = {
  barings:          9.94,
  allianz:          8.08,
  fidelity:         7.36,
  aia:              7.07,
  capital_group:    4.80,
  janus_henderson:  7.00,
  principal_global: 8.00,
};

// Build a Fund array, optionally overriding yields with live data
export const buildFunds = (liveYields?: Record<string, number>): Fund[] =>
  FUND_METADATA.map(meta => ({
    ...meta,
    yield: liveYields?.[meta.id] ?? FALLBACK_YIELDS[meta.id],
  }));

// Backwards-compatible export — static yields, used until live data arrives
export const FUNDS: Fund[] = buildFunds();

export const DEFAULTS = {
  PROPERTY_VALUE: 8000000,
  OUTSTANDING_LOAN: 2000000,
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
