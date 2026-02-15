
import { useState, useEffect } from 'react';

const HIBOR_API_URL = 'https://api.hkma.gov.hk/public/market-data-and-statistics/daily-monetary-statistics/daily-figures-interbank-liquidity?offset=0';
const CACHE_KEY = 'hibor_rate_data_v2'; // Changed key to invalidate old cache
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface HiborData {
    rate: number;
    date: string;
    timestamp: number;
}

export const useHiborRate = () => {
    const [hiborRate, setHiborRate] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHiborRate = async () => {
            try {
                setLoading(true);

                // Check cache first
                const cachedData = localStorage.getItem(CACHE_KEY);
                if (cachedData) {
                    const parsedData: HiborData = JSON.parse(cachedData);
                    const now = new Date().getTime();

                    if (now - parsedData.timestamp < CACHE_DURATION) {
                        console.log('Using cached HIBOR rate:', parsedData.rate);
                        setHiborRate(parsedData.rate);
                        setLoading(false);
                        return;
                    }
                }

                // Fetch from API if cache is expired or missing
                console.log('Fetching HIBOR rate from HKMA API...');
                const response = await fetch(HIBOR_API_URL);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();

                if (data.header.success && data.result.records.length > 0) {
                    // The API returns records sorted by date descending (latest first)
                    // We need the 'hibor_fixing_1m' field
                    const latestRecord = data.result.records[0];
                    const rateValue = latestRecord['hibor_fixing_1m'];
                    const rate = typeof rateValue === 'number' ? rateValue : parseFloat(rateValue);
                    const date = latestRecord.end_of_date; // Note: field is 'end_of_date' here, not 'end_of_day'

                    if (!isNaN(rate) && rate !== null) {
                        const newCacheData: HiborData = {
                            rate,
                            date,
                            timestamp: new Date().getTime()
                        };

                        localStorage.setItem(CACHE_KEY, JSON.stringify(newCacheData));
                        setHiborRate(rate);
                    } else {
                        throw new Error('Invalid rate format received');
                    }
                } else {
                    throw new Error('No records found in API response');
                }

            } catch (err) {
                console.error('Failed to fetch HIBOR rate:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                // Fallback to a default if needed, or let the UI handle null
            } finally {
                setLoading(false);
            }
        };

        fetchHiborRate();
    }, []);

    return { hiborRate, loading, error };
};
