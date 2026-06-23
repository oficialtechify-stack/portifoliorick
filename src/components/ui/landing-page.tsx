import React, { useEffect, useRef, useState, useCallback, useMemo } from "react"; 
import { cn } from "@/lib/utils";
import { ShaderBackground } from "./liquid-metal-vortex";
import { HandWrittenTitle } from "./hand-writing-text";
import LightningText from "./lightning-text";

// Reusable ScrollGlobe component following shadcn/ui patterns
interface ScrollGlobeProps {
  sections: {
    id: string;
    badge?: string;
    title: string;
    subtitle?: string;
    description: string;
    align?: 'left' | 'center' | 'right';
    features?: { title: string; description: string }[];
    actions?: { label: string; variant: 'primary' | 'secondary'; onClick?: () => void }[];
  }[];
  globeConfig?: {
    positions: {
      top: string;
      left: string;
      scale: number;
    }[];
  };
  className?: string;
}

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.4 },  // Hero: Right side, balanced
    { top: "25%", left: "50%", scale: 0.9 },  // Innovation: Top side, subtle
    { top: "15%", left: "90%", scale: 2 },  // Discovery: Left side, medium
    { top: "55%", left: "50%", scale: 3.5 },  // Future: Center, massive backdrop
  ]
};

// Utility function to smoothly interpolate between values
// const lerp = (start: number, end: number, factor: number): number => {
//   return start + (end - start) * factor;
// };

// Parse percentage string to number
const parsePercent = (str: string): number => parseFloat(str.replace('%', ''));

export function ScrollGlobe({ sections, globeConfig = defaultGlobeConfig, className }: ScrollGlobeProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  // const [showNavLabel, setShowNavLabel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  // const lastScrollTime = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const navLabelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Pre-calculate positions for performance
  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map(pos => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale
    }));
  }, [globeConfig.positions]);

  // Simple, direct scroll tracking
  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
    
    setScrollProgress(progress);

    // Simple section detection
    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          newActiveSection = index;
        }
      }
    });

    setActiveSection(newActiveSection);
  }, [calculatedPositions]);

  // Throttled scroll handler with RAF
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use passive listeners and immediate execution
    window.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollPosition(); // Initial call
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (navLabelTimeoutRef.current) {
        clearTimeout(navLabelTimeoutRef.current);
      }
    };
  }, [updateScrollPosition]);

  // Initial scroll position
  useEffect(() => {
    updateScrollPosition();
  }, [updateScrollPosition]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full max-w-screen overflow-x-hidden min-h-screen bg-transparent text-foreground",
        className
      )}
    >
      {/* Background Dot Pattern (Added to match user image) */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.25]"
        style={{ 
          backgroundImage: 'radial-gradient(circle, #ff2800 1.5px, transparent 1.5px)', 
          backgroundSize: '32px 32px' 
        }} 
      />

      {/* Liquid Metal Vortex Background removed as requested */}

      {/* Progress Bar */}

      {/* Enhanced Navigation with auto-hiding labels - Fully Responsive */}
      <div className="hidden sm:flex fixed right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="relative group">
              {/* Auto-hiding section label - Always visible but with responsive sizing */}
              <div
                className={cn(
                  "nav-label absolute right-5 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2",
                  "px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap",
                  "bg-background/95 backdrop-blur-md border border-border/60 shadow-xl z-50",
                  activeSection === index ? "animate-fadeOutLabel" : "opacity-0"
                )}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                  <div className="w-1 sm:w-1.5 lg:w-2 h-1 sm:h-1.5 lg:h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs sm:text-sm lg:text-base">
                    {section.badge || `Secção ${index + 1}`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  sectionRefs.current[index]?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
                className={cn(
                  "relative w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 hover:scale-125",
                  "before:absolute before:inset-0 before:rounded-full before:transition-all before:duration-300",
                  activeSection === index 
                    ? "bg-[#ff4c2b] border-[#ff4c2b] shadow-lg before:animate-ping before:bg-[#ff4c2b]/20" 
                    : "bg-transparent border-white/20 hover:border-[#ff4c2b]/60 hover:bg-[#ff4c2b]/10"
                )}
                aria-label={`Ir para ${section.badge || `secção ${index + 1}`}`}
              />
            </div>
          ))}
        </div>
        
        {/* Enhanced navigation line - Responsive */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 lg:w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2 -z-10" />
      </div>

      {/* Globe removed as requested */}

      {/* Dynamic sections - fully responsive */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={(el) => { sectionRefs.current[index] = el; }}
          className={cn(
            "relative min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 z-20 py-12 sm:py-16 lg:py-20",
            "w-full max-w-full overflow-hidden",
            section.align === 'center' && "items-center text-center",
            section.align === 'right' && "items-end text-right",
            section.align !== 'center' && section.align !== 'right' && "items-start text-left"
          )}
        >
          <div className={cn(
            "w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl will-change-transform transition-all duration-700",
            "opacity-100 translate-y-0"
          )}>
            
            {section.id === 'discovery' ? (
              <div className="mb-12">
                <HandWrittenTitle 
                  title={section.title} 
                  subtitle={section.subtitle} 
                  className="max-w-none text-left p-0 mb-4"
                />
              </div>
            ) : section.id === 'future' ? (
              <div className="w-full flex flex-col items-center justify-center mb-8">
                <div className="w-full max-w-3xl">
                  <LightningText 
                    text="NOSSO AMANHÃ" 
                    textColor="#ff4c2b"
                    thunderColor="#ffffff"
                    thunderGlow="#ff2800"
                    sparkColor="#ff4c2b"
                    size={64}
                    height={180}
                    className="border border-[#ff2800]/20 bg-[#050202]"
                  />
                </div>
                <div className="mt-5 text-zinc-500 dark:text-white/50 text-xs sm:text-sm md:text-base font-black tracking-[0.3em] uppercase select-none">
                  {section.subtitle}
                </div>
              </div>
            ) : (
              <h1 className={cn(
                "font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tight text-zinc-900 dark:text-white transition-colors",
                index === 0 
                  ? "text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl" 
                  : "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl"
              )}>
                {section.subtitle ? (
                  <div className="space-y-1 sm:space-y-2">
                    <div className="bg-gradient-to-r from-zinc-900 to-zinc-750 dark:from-white dark:to-white/90 bg-clip-text text-transparent italic font-black uppercase text-[1.2em] tracking-tighter transition-all">
                      {section.title}
                    </div>
                    <div className="text-zinc-500 dark:text-white/40 text-[0.4em] sm:text-[0.45em] font-medium tracking-[0.2em] uppercase transition-colors">
                      {section.subtitle}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-700 dark:from-white dark:via-white dark:to-white/90 bg-clip-text text-transparent uppercase italic font-black tracking-tighter transition-all">
                    {section.title}
                  </div>
                )}
              </h1>
            )}
            
            <div className={cn(
              "text-zinc-700 dark:text-zinc-200 leading-relaxed mb-8 sm:mb-10 text-lg sm:text-xl lg:text-2xl font-medium transition-colors",
              section.align === 'center' ? "max-w-full mx-auto text-center" : "max-w-full"
            )}>
              <p className="mb-3 sm:mb-4">{section.description}</p>
            </div>

            {/* Enhanced Features - Responsive grid */}
            {section.features && (
              <div className="grid gap-3 sm:gap-4 mb-8 sm:mb-10 w-full">
                {section.features.map((feature, featureIndex) => (
                  <div 
                    key={feature.title}
                    className={cn(
                      "group p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-sm hover:bg-zinc-50 dark:hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 shadow-sm dark:shadow-none",
                      "hover:border-primary/20 hover:-translate-y-1"
                    )}
                    style={{ animationDelay: `${featureIndex * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary/60 mt-1.5 sm:mt-2 group-hover:bg-primary transition-colors flex-shrink-0" />
                      <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                        <h3 className="font-bold text-zinc-900 dark:text-white text-base sm:text-lg uppercase italic tracking-tight transition-colors">{feature.title}</h3>
                        <p className="text-zinc-650 dark:text-zinc-400 leading-relaxed text-sm sm:text-base font-medium transition-colors">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Actions - Responsive buttons */}
            {section.actions && (
              <div className={cn(
                "flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4",
                section.align === 'center' && "justify-center",
                section.align === 'right' && "justify-end",
                (!section.align || section.align === 'left') && "justify-start"
              )}>
                {section.actions.map((action, actionIndex) => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className={cn(
                      "group relative px-10 sm:px-12 py-4 sm:py-5 rounded-full font-black italic transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] text-sm sm:text-lg",
                      "hover:shadow-[0_0_30px_rgba(255,76,43,0.4)] focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto uppercase tracking-wider",
                      action.variant === 'primary' 
                        ? "bg-[#ff4c2b] text-black shadow-xl" 
                        : "border-2 border-black/15 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm hover:bg-zinc-100 dark:hover:bg-white/10 hover:border-primary/30 text-zinc-900 dark:text-white transition-all duration-300"
                    )}
                    style={{ animationDelay: `${actionIndex * 0.1 + 0.2}s` }}
                  >
                    <span className="relative z-10">{action.label}</span>
                    {action.variant === 'primary' && (
                      <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

// LandingPage Component
export default function LandingPage() {
  const demoSections = [
    {
      id: "hero",
      badge: "Master Developer",
      title: "Elevando",
      subtitle: "Possibilidades",
      description: "Utilizo as tecnologias mais modernas do mercado para entregar resultados reais e interfaces que encantam e convertem.",
      align: "left" as const,
      features: [
        { title: "Desenvolvimento Fullstack", description: "Aplicações escaláveis de ponta a ponta com as melhores práticas." },
        { title: "Interfaces Performáticas", description: "Foco total na experiência do usuário e velocidade de carregamento." },
        { title: "Motion & Design Único", description: "Animações que guiam o usuário e trazem vida ao seu produto." }
      ],
      actions: [
        { label: "Começar Jornada", variant: "primary" as const, onClick: () => window.open("https://wa.me/558199130885", "_blank") },
        { label: "Ver Skills", variant: "secondary" as const, onClick: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
      ]
    },
    {
      id: "innovation",
      badge: "Inovação",
      title: "Conectado Globalmente",
      description: "Especialista em criar soluções escaláveis que conectam marcas e pessoas em todo o mundo. Foco em performance, motion design e arquitetura robusta.",
      align: "center" as const,
    },
    {
      id: "discovery",
      badge: "Experiência",
      title: "Elevando",
      subtitle: "Possibilidades",
      description: "Utilizo as tecnologias mais modernas do mercado para entregar resultados reais e interfaces que encantam e convertem.",
      align: "left" as const,
      features: [
        { title: "Desenvolvimento Fullstack", description: "Aplicações escaláveis de ponta a ponta com as melhores práticas" },
        { title: "Interfaces Performáticas", description: "Foco total na experiência do usuário e velocidade de carregamento" },
        { title: "Motion & Design Único", description: "Animações que guiam o usuário e trazem vida ao seu produto" }
      ]
    },
    {
      id: "future",
      badge: "Futuro",
      title: "Nosso Amanhã",
      subtitle: "Compartilhado",
      description: "Vamos construir o futuro juntos. Estou pronto para transformar sua ideia em uma realidade digital de alto impacto.",
      align: "center" as const,
      actions: [
        { label: "Falar Comigo", variant: "primary" as const, onClick: () => window.open("https://wa.me/558199130885", "_blank") },
      ]
    }
  ];

  return (
    <ScrollGlobe 
      sections={demoSections}
      className="bg-transparent"
    />
  );
}
