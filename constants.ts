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