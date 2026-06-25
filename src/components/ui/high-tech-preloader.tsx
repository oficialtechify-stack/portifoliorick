import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

interface HighTechPreloaderProps {
  onComplete: () => void;
}

export const HighTechPreloader: React.FC<HighTechPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Elegant incremental loading curve simulation (starts fast, slows down at 85%, then speeds up to finish)
    let currentProgress = 0;
    const interval = setInterval(() => {
      let increment = 0;
      if (currentProgress < 30) {
        increment = Math.floor(Math.random() * 4) + 2;
      } else if (currentProgress < 75) {
        increment = Math.floor(Math.random() * 3) + 1;
      } else if (currentProgress < 90) {
        increment = Math.random() < 0.3 ? 1 : 0; // slower near 90%
      } else {
        increment = Math.floor(Math.random() * 3) + 1;
      }

      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(Math.floor(currentProgress));

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Small delay at 100% for satisfying visual completion before resolving
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[1000] w-full h-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Grid Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#331100_1px,transparent_1px),linear-gradient(to_bottom,#331100_1px,transparent_1px)] bg-[size:30px_30px]"
        style={{ transform: "perspective(800px) rotateX(45deg) translateY(-20%) scale(1.5)" }}
      />

      {/* Floating particles background from Variant 5 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              backgroundColor: "rgba(255, 40, 0, 0.25)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 30, 0],
              scale: [0, 1.3, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {progress < 100 ? (
          <motion.div
            key="preloader-active"
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center gap-10 relative z-10"
          >
            {/* Concentric high-tech circle display */}
            <div className="relative w-64 h-64 md:w-72 md:h-72">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="preloader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255, 40, 0, 0.3)" />
                    <stop offset="60%" stopColor="rgba(255, 65, 0, 1)" />
                    <stop offset="100%" stopColor="rgba(255, 120, 0, 0.4)" />
                  </linearGradient>
                </defs>

                {/* Outer base track */}
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  stroke="rgba(255, 40, 0, 0.08)"
                  strokeWidth="4"
                  fill="none"
                />

                {/* Animated active progress arc */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="85"
                  stroke="url(#preloader-grad)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={534}
                  strokeDashoffset={534 - (534 * progress) / 100}
                  transition={{ duration: 0.1, ease: "linear" }}
                />

                {/* Dotted Inner rotating ring from Orbit Variant */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="72"
                  stroke="rgba(255, 80, 0, 0.4)"
                  strokeWidth="1.5"
                  fill="none"
                  strokeDasharray="5 10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "center" }}
                />

                {/* Subtle outer rotating ticks */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="94"
                  stroke="rgba(255, 40, 0, 0.15)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="2 30"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "center" }}
                />
              </svg>

              {/* Progress text in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className="text-5xl md:text-6xl font-black italic tracking-tighter text-white font-mono flex items-baseline"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  {progress}
                  <span className="text-xl md:text-2xl font-bold text-primary ml-1">%</span>
                </motion.div>
                <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-[0.3em] mt-2 font-black">
                  {i18n.language?.startsWith("pt") ? "CARREGANDO" : "LOADING"}
                </span>
              </div>
            </div>

            {/* Glowing active animation dots */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,40,0,0.8)]"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.25, 1, 0.25] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      delay: i * 0.18,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium font-mono">
                {i18n.language?.startsWith("pt") 
                  ? "Sincronizando sistemas..." 
                  : "Syncing system architectures..."}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preloader-complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ type: "spring", damping: 15 }}
            className="text-center relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.1, 1] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,40,0,0.2)]"
            >
              <span className="text-5xl font-bold text-primary">✓</span>
            </motion.div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-2">
              {i18n.language?.startsWith("pt") ? "PRONTO" : "ALL SET"}
            </h1>
            <p className="text-sm text-white/50 uppercase tracking-[0.15em] font-mono">
              {i18n.language?.startsWith("pt") ? "Iniciando RICKZINXX" : "Initializing RICKZINXX"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
