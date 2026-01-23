import React from 'react';

// Custom Glass Card
const GlassCard = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
    <div className={`bg-slate-800/40 backdrop-blur-md border border-white/5 shadow-xl rounded-none ${className}`}>
        {children}
    </div>
);

export default GlassCard;
