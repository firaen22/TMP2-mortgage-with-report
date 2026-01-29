import { useMemo } from 'react';
import { CalculationResult, SimulationYear } from '../types';
import { DEFAULTS } from '../constants';
import { safeNumber } from '../utils/helpers';

interface SimulationInputs {
    propertyValue: string | number;
    mortgageLTV: string | number;
    mortgageRate: string | number;
    mortgageTenure: string | number;
    ownCash: string | number;
    reserveCashPercent: number;
    allocationIncome: number;
    incomeYield: number;
    hedgeYield: number;
}

export const useSimulation = ({
    propertyValue,
    mortgageLTV,
    mortgageRate,
    mortgageTenure,
    ownCash,
    reserveCashPercent,
    allocationIncome,
    incomeYield,
    hedgeYield
}: SimulationInputs): CalculationResult => {
    const allocationHedge = 100 - allocationIncome;

    return useMemo(() => {
        // Convert inputs to numbers safely using safeNumber
        const valProperty = safeNumber(propertyValue);
        const valLTV = safeNumber(mortgageLTV);
        const valRate = safeNumber(mortgageRate);
        const valTenure = safeNumber(mortgageTenure);
        const valOwnCash = safeNumber(ownCash);

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
        const totalCapital = loanAmount + valOwnCash;
        const reserveCash = totalCapital * (reserveCashPercent / 100);
        const investedAmount = totalCapital - reserveCash;

        const initialIncomeAV = investedAmount * (allocationIncome / 100);
        const initialHedgeAV = investedAmount * (allocationHedge / 100);

        // 3. Monthly Income
        const monthlyDividend = (initialIncomeAV * (incomeYield / 100)) / 12;

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

            const hedgeGrowth = currentHedgeAV * (hedgeYield / 100);
            // Logic from App.tsx: currentHedgeAV = currentHedgeAV + hedgeGrowth - totalFees;
            currentHedgeAV = currentHedgeAV + hedgeGrowth - totalFees;

            // Amortization
            if (currentMortgageBalance > 0) {
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
            }

            // Surrender Value (2 year penalty)
            // Note: Reserve Cash is assumed to be liquid and penalty-free
            const isSurrenderPenalty = year <= DEFAULTS.SURRENDER_PENALTY_YEARS;
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
            ownCash: valOwnCash,
            investedAmount,
            reserveCash,
            monthlyMortgage,
            monthlyDividend,
            netMonthlyCashFlow,
            yearlyData
        };
    }, [propertyValue, mortgageLTV, mortgageRate, mortgageTenure, ownCash, reserveCashPercent, allocationIncome, incomeYield, hedgeYield, allocationHedge]);
};
