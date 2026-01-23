// Helper to prevent NaN issues
export const safeNumber = (val: string | number): number => {
    if (val === '') return 0;
    const num = Number(val);
    return isNaN(num) || !isFinite(num) ? 0 : num;
};

// --- Formatters ---
export const formatCurrency = (val: number, lang: 'zh' | 'en' = 'zh', compact = false) =>
    new Intl.NumberFormat(lang === 'zh' ? 'zh-HK' : 'en-US', {
        style: 'currency',
        currency: 'HKD',
        maximumFractionDigits: 0,
        notation: compact ? 'compact' : 'standard'
    }).format(val);
