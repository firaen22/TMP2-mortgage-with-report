import React from 'react';
import { Landmark, Globe, Download, Loader2 } from 'lucide-react';
import { COLORS } from '../../constants';

interface HeaderProps {
    t: any;
    lang: 'zh' | 'en';
    setLang: (lang: 'zh' | 'en') => void;
    handleDownloadPDF: () => void;
    isDownloading: boolean;
    hiborDate?: string;
}

const Header: React.FC<HeaderProps> = ({ t, lang, setLang, handleDownloadPDF, isDownloading, hiborDate, showSyncStatus }) => {
    return (
        <nav className="border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-[40]">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 border border-[#D4AF37]/30 rounded-none bg-[#D4AF37]/5">
                        <Landmark size={24} color={COLORS.GOLD} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif text-slate-100 tracking-wide">
                            {t.title}
                        </h1>
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{t.subtitle}</p>
                            {hiborDate && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-slate-600 bg-slate-800/50 px-1.5 py-0.5 border border-white/5 rounded-none uppercase tracking-wider">
                                        HIBOR Update: {hiborDate}
                                    </span>
                                    {showSyncStatus && (
                                        <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-none uppercase animate-pulse">
                                            {t.status_hibor_live}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">

                    {/* Download PDF Button */}
                    <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-[#D4AF37]/50 rounded text-xs font-medium text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        <span>{isDownloading ? t.btn_generating : t.btn_download}</span>
                    </button>

                    {/* Language Switcher */}
                    <button
                        onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-700 rounded text-xs font-light hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                    >
                        <Globe size={14} />
                        <span>{lang === 'zh' ? 'EN' : '繁'}</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Header;
