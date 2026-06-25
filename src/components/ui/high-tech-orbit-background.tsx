import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export const HighTechOrbitBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="absolute inset-0 bg-black" />;

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden select-none pointer-events-none">
      {/* Dynamic Grid Background with parallax depth */}
      <div 
        className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,#331100_1px,transparent_1px),linear-gradient(to_bottom,#331100_1px,transparent_1px)] bg-[size:40px_40px]" 
        style={{ transform: "perspective(1000px) rotateX(60deg) translateY(-30%) scale(1.8)" }}
      />

      {/* Radial glow in the center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[150vmax] h-[150vmax] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,40,0,0.12)_0%,rgba(15,3,0,0.4)_40%,rgba(0,0,0,1)_80%)]" />
      </div>

      {/* Floating particles from ArcPreloaderVariant5 design */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(35)].map((_, i) => {
          const size = Math.random() * 5 + 2;
          const delay = i * 0.15;
          const duration = Math.random() * 6 + 4;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                backgroundColor: i % 2 === 0 ? "rgba(255, 40, 0, 0.4)" : "rgba(255, 120, 0, 0.25)",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -120 - 40, 0],
                x: [0, Math.random() * 60 - 30, 0],
                scale: [0, 1.4, 0],
                opacity: [0, 0.75, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
              }}
            />
          );
        })}
      </div>

      {/* Futuristic Concentric Orbits from ArcPreloaderVariant3 and Variant 4 */}
      <div className="absolute inset-0 flex items-center justify-center opacity-45 pointer-events-none">
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] flex items-center justify-center">
          {/* Inner Fast Orbit */}
          <motion.div
            className="absolute w-full h-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke="rgba(255, 40, 0, 0.2)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="4 8"
              />
            </svg>
          </motion.div>

          {/* Middle Counter-Orbit */}
          <motion.div
            className="absolute w-full h-full scale-[1.25]"
            animate={{ rotate: -360 }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="70"
                stroke="rgba(255, 80, 0, 0.18)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="15 35"
              />
            </svg>
          </motion.div>

          {/* Outer Segmented Ring */}
          <motion.div
            className="absolute w-full h-full scale-[1.6]"
            animate={{ rotate: 360 }}
            transition={{
              duration: 48,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="55"
                stroke="rgba(255, 40, 0, 0.12)"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="40 90"
              />
            </svg>
          </motion.div>

          {/* Center Subtle Compass Lines */}
          <div className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-rgba(255,40,0,0.1) to-transparent" />
          <div className="absolute h-[200%] w-[1px] bg-gradient-to-b from-transparent via-rgba(255,40,0,0.1) to-transparent" />
        </div>
      </div>
      
      {/* Bottom overlay gradient to ensure high readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};
