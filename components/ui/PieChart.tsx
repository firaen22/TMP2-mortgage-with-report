import React from 'react';
import { ComposedChart } from 'recharts';

const PieChart = ({ width, height, children }: { width?: number; height?: number; children?: React.ReactNode }) => {
    // Fix for Recharts ResponsiveContainer warning: "width(-1) and height(-1) of chart should be greater than 0"
    // This ensures a valid positive dimension is always passed to ComposedChart, even if measurement fails momentarily.
    const safeWidth = width && width > 0 ? width : 150;
    const safeHeight = height && height > 0 ? height : 150;

    return (
        <ComposedChart width={safeWidth} height={safeHeight} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            {children}
        </ComposedChart>
    );
};

export default PieChart;
