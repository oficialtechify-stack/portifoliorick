"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";

export interface WordData {
  text: string;
  duration: number;
  delay: number;
  blur: number;
  scale?: number;
}

interface BlurTextAnimationProps {
  text?: string;
  words?: WordData[];
  highlightWords?: string[];
  className?: string;
  containerClassName?: string;
  fontSize?: string;
  fontFamily?: string;
  textColor?: string;
  animationDelay?: number;
  once?: boolean;
}

export default function BlurTextAnimation({
  text = "Elegant blur animation that brings your words to life with cinematic transitions.",
  words,
  highlightWords = [],
  className = "",
  containerClassName = "",
  fontSize = "text-xl md:text-2xl",
  fontFamily = "font-sans",
  textColor = "text-white",
  animationDelay = 4000,
  once = false
}: BlurTextAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const t1Ref = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const textWords = useMemo(() => {
    if (words) return words;
    
    const splitWords = text.split(" ");
    const totalWords = splitWords.length;
    
    return splitWords.map((word, index) => {
      const progress = index / totalWords;
      
      const exponentialDelay = Math.pow(progress, 0.8) * 0.5;
      
      const baseDelay = index * 0.04; // Slightly faster transition sequence
      
      const microVariation = (Math.random() - 0.5) * 0.05;
      
      return {
        text: word,
        duration: 2.0 + Math.cos(index * 0.3) * 0.3,
        delay: baseDelay + exponentialDelay + microVariation,
        blur: 12 + Math.floor(Math.random() * 8),
        scale: 0.95 + Math.sin(index * 0.2) * 0.03
      };
    });
  }, [text, words]);

  useEffect(() => {
    const startAnimation = () => {
      setIsAnimating(false);
      
      t1Ref.current = setTimeout(() => {
        setIsAnimating(true);
      }, 200);
      
      let maxTime = 0;
      textWords.forEach(word => {
        const totalTime = word.delay + word.duration;
        maxTime = Math.max(maxTime, totalTime);
      });
      
      if (!once) {
        animationTimeoutRef.current = setTimeout(() => {
          setIsAnimating(false);
          
          resetTimeoutRef.current = setTimeout(() => {
            startAnimation();
          }, animationDelay);
        }, (maxTime + 1) * 1000);
      }
    };

    startAnimation();

    return () => {
      if (t1Ref.current) clearTimeout(t1Ref.current);
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, [textWords, animationDelay, once]);

  return (
    <div className={`${containerClassName}`}>
      <div className={`${className}`}>
        <p className={`${textColor} ${fontSize} ${fontFamily} font-light leading-relaxed tracking-wide`}>
          {textWords.map((word, index) => {
            const cleanWord = word.text.toLowerCase().replace(/^[.,()]+|[.,()]+$/g, '');
            const isHighlighted = highlightWords.some(
              hw => hw.toLowerCase().replace(/^[.,()]+|[.,()]+$/g, '') === cleanWord
            );
            return (
              <span
                key={index}
                className={`inline-block transition-all ${
                  isAnimating ? 'opacity-100' : 'opacity-0'
                } ${isHighlighted ? 'text-primary font-black italic shadow-primary/30 text-shadow-sm' : ''}`}
                style={{
                  transitionDuration: `${word.duration}s`,
                  transitionDelay: `${word.delay}s`,
                  transitionTimingFunction: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  filter: isAnimating 
                    ? 'blur(0px) brightness(1)' 
                    : `blur(${word.blur}px) brightness(0.6)`,
                  transform: isAnimating 
                    ? 'translateY(0) scale(1) rotateX(0deg)' 
                    : `translateY(20px) scale(${word.scale || 1}) rotateX(-15deg)`,
                  marginRight: '0.35em',
                  willChange: 'filter, transform, opacity',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  textShadow: isAnimating 
                    ? isHighlighted 
                      ? '0 0 15px rgba(255,76,43,0.3)'
                      : undefined 
                    : undefined
                }}
              >
                {word.text}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

export function Component() {
  return <BlurTextAnimation once={true} containerClassName="flex items-center justify-center min-h-screen bg-black" className="text-center max-w-5xl px-8" />;
}
