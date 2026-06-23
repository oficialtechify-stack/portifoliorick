import { ArrowRight } from "lucide-react"
import { useState, Suspense, lazy } from "react"
import { cn } from "@/lib/utils"

const Dithering = lazy(() => 
  import("@paper-design/shaders-react").then((mod) => ({ default: mod.Dithering }))
)

export function CTASection() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-12 w-full flex justify-center items-center px-4 md:px-6">
      <div 
        className="w-full max-w-7xl relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[32px] md:rounded-[48px] border border-white/10 bg-black shadow-sm min-h-[500px] md:min-h-[600px] flex flex-col items-center justify-center duration-500 py-12 md:py-0">
             <Suspense fallback={<div className="absolute inset-0 bg-white/5" />}>
            <div className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen">
              <Dithering
                colorBack="#00000000" // Transparent
                colorFront="#FF0000"  // Accent (Red)
                shape="simplex"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <div className="relative z-10 px-4 md:px-6 max-w-4xl mx-auto text-center flex flex-col items-center">
            
            <div className="mb-6 md:mb-8 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-xs md:text-sm font-medium text-primary backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              EXCLUSIVO
            </div>

            {/* Headline */}
            <h2 className="font-sans text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 md:mb-8 leading-[1.0] md:leading-[0.95] uppercase italic px-2">
              RESULTADOS <br className="hidden sm:block" />
              <span className="text-primary truncate sm:overflow-visible">REAIS.</span>
            </h2>
            
            {/* Description */}
            <p className="text-white/60 text-base md:text-xl max-w-2xl mb-8 md:mb-12 leading-relaxed font-medium uppercase tracking-tight">
              Junte-se a centenas de pessoas que transformaram seu jogo. 
              Estratégias limpas, precisas e únicas.
            </p>

            {/* Button */}
            <button 
              onClick={() => window.open("https://wa.me/558199130885", "_blank")}
              className="group relative inline-flex h-14 md:h-16 items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-8 md:px-12 text-base md:text-lg font-black text-black transition-all duration-300 hover:bg-white hover:scale-105 active:scale-95 hover:ring-8 hover:ring-primary/20 uppercase italic"
            >
              <span className="relative z-10">QUERO COMEÇAR</span>
              <ArrowRight className="h-5 w-5 md:h-6 md:w-6 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
