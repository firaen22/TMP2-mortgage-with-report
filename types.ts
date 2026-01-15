export interface Fund {
  id: string;
  name: string;
  yield: number; // Percentage, e.g., 9.94
  riskLevel: 'High' | 'Medium' | 'Low';
}

export interface SimulationYear {
  year: number;
  incomeAV: number; // Account Value of Income Portfolio
  hedgeAV: number; // Account Value of Hedge Portfolio
  reserveCash: number; // Reserve Cash Amount
  totalAV: number; // Total Account Value (Income + Hedge)
  surrenderValue: number; // Estimated Surrender Value
  totalFeesPaid: number;
  mortgageBalance: number; // Remaining Mortgage Balance
  netEquity: number; // Total Assets (AV + Cash) - Mortgage Balance
}

export interface CalculationResult {
  loanAmount: number;
  investedAmount: number;
  reserveCash: number;
  monthlyMortgage: number;
  monthlyDividend: number;
  netMonthlyCashFlow: number;
  yearlyData: SimulationYear[];
}