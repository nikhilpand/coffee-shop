import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coffee, Sparkles, Gift, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoyaltyStampCard() {
  const [stamps, setStamps] = useState(() => {
    try {
      const stored = localStorage.getItem('slowpour_loyalty_stamps');
      return stored ? parseInt(stored, 10) : 2; // Start with 2 bonus stamps for new visitor welcome
    } catch {
      return 2;
    }
  });

  const totalRequired = 5;
  const isRewardReady = stamps >= totalRequired;

  return (
    <div className="bg-gradient-to-br from-[#2C1810] to-[#1E0F0A] text-ivory rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-caramel/30">
      {/* Background ambient ring */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-caramel/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel/20 border border-caramel/30 text-[10px] uppercase font-bold tracking-widest text-caramel mb-2">
            <Sparkles size={12} /> Café Rituals Club
          </div>
          <h3 className="font-display text-2xl font-bold mb-1">
            {isRewardReady ? 'Your 5th Coffee is On Us! 🎉' : 'Your 5th Cup is Complimentary'}
          </h3>
          <p className="text-xs text-ivory/70 max-w-sm">
            Collect a stamp for every handcrafted table brew. Enjoy free pastries & seasonal roasts on completion.
          </p>
        </div>

        {/* Stamps Display */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {Array.from({ length: totalRequired }).map((_, i) => {
            const isStamped = i < stamps;
            const isFreeCup = i === totalRequired - 1;

            return (
              <div
                key={i}
                className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 ${
                  isStamped
                    ? 'bg-caramel text-espresso border-caramel shadow-md scale-105'
                    : isFreeCup
                    ? 'bg-white/10 border-dashed border-caramel/60 text-caramel animate-pulse'
                    : 'bg-white/5 border-white/15 text-white/30'
                }`}
              >
                {isStamped ? (
                  <Check size={18} strokeWidth={3} />
                ) : isFreeCup ? (
                  <Gift size={16} />
                ) : (
                  <Coffee size={16} />
                )}
                <span className="text-[8px] font-bold mt-0.5 opacity-80">
                  {isFreeCup ? 'FREE' : `#${i + 1}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
