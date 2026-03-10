import { useState, useEffect } from 'react';
import { FALLBACK_YIELDS } from '../constants';

const CACHE_KEY = 'yahoo_finance_yields_v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Maps each fund ID to its Yahoo Finance ticker symbol
const FUND_TICKERS: Record<string, string> = {
  barings:         '0P0000XKLI.T',
  allianz:         '0P00015IHG.F',
  fidelity:        '0P00000S0K.F',
  aia:             '0P0001CBXQ.HK',
  capital_group:   '0P0001BX6T.F',
  janus_henderson: '0P0000NQKR.F',
  principal_global:'0P0001DCXP.F',
};

interface YieldCache {
  yields: Record<string, number>;
  date: string;
  timestamp: number;
}

export interface UseYahooFinanceYieldsReturn {
  yields: Record<string, number>;
  date: string | null;
  loading: boolean;
  isLive: boolean;
}

const fetchFundYield = async (ticker: string, fallback: number): Promise<number> => {
  const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=2d`;
  const proxyUrl = `${CORS_PROXY}${encodeURIComponent(yahooUrl)}`;

  const response = await fetch(proxyUrl, {
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) return fallback;

  const data = await response.json();
  const meta = data?.chart?.result?.[0]?.meta;
  const rawYield = meta?.trailingAnnualDividendYield;

  if (rawYield == null || isNaN(rawYield) || rawYield <= 0) return fallback;

  return parseFloat((rawYield * 100).toFixed(2));
};

export const useYahooFinanceYields = (): UseYahooFinanceYieldsReturn => {
  const [yields, setYields] = useState<Record<string, number>>(FALLBACK_YIELDS);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: YieldCache = JSON.parse(cached);
          if (Date.now() - parsed.timestamp < CACHE_DURATION) {
            console.log('Using cached Yahoo Finance yields from', parsed.date);
            setYields(parsed.yields);
            setDate(parsed.date);
            setIsLive(true);
            setLoading(false);
            return;
          }
        }

        // Fetch all funds concurrently — a single failure won't block the others
        console.log('Fetching Yahoo Finance yields...');
        const entries = Object.entries(FUND_TICKERS);
        const results = await Promise.allSettled(
          entries.map(([id, ticker]) =>
            fetchFundYield(ticker, FALLBACK_YIELDS[id])
              .then(yld => ({ id, yld }))
              .catch(() => ({ id, yld: FALLBACK_YIELDS[id] }))
          )
        );

        const newYields: Record<string, number> = { ...FALLBACK_YIELDS };
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            newYields[result.value.id] = result.value.yld;
          }
        });

        const today = new Date().toISOString().split('T')[0];
        const cacheData: YieldCache = {
          yields: newYields,
          date: today,
          timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        setYields(newYields);
        setDate(today);
        setIsLive(true);

      } catch (err) {
        console.error('Failed to fetch Yahoo Finance yields:', err);
        setIsLive(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { yields, date, loading, isLive };
};
