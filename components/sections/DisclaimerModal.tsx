import React from 'react';
import { AlertCircle } from 'lucide-react';

interface DisclaimerModalProps {
    t: any;
    showDisclaimer: boolean;
    setShowDisclaimer: (show: boolean) => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ t, showDisclaimer, setShowDisclaimer }) => {
    if (!showDisclaimer) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDisclaimer(false)}></div>
            <div className="relative bg-slate-900 border border-[#D4AF37]/50 p-8 max-w-md w-full shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="text-[#D4AF37]" size={28} />
                    <h2 className="text-2xl font-serif text-white">{t.disclaimer_popup_title}</h2>
                </div>
                <div className="space-y-4 text-slate-300 mb-8">
                    <p className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0"></span>
                        <span>{t.disclaimer_popup_study}</span>
                    </p>
                    <p className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0"></span>
                        <span>{t.disclaimer_popup_not_recommend}</span>
                    </p>
                </div>
                <button
                    onClick={() => setShowDisclaimer(false)}
                    className="w-full py-3 bg-[#D4AF37] text-slate-900 font-bold uppercase tracking-widest hover:bg-[#D4AF37]/90 transition-all"
                >
                    {t.disclaimer_popup_btn}
                </button>
            </div>
        </div>
    );
};

export default DisclaimerModal;
