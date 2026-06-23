"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { X, Code2, Figma, Smartphone, Globe, Rocket, Cpu, Palette, Monitor } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"
import { BallpitBackground } from "./interactive-hero-backgrounds"

interface NavLinkProps {
  children: React.ReactNode
  onClick?: () => void
  gradient: string
}

function NavLink({ children, onClick, gradient }: NavLinkProps) {
  const linkRef = useRef<HTMLButtonElement>(null)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    const link = linkRef.current
    if (!link || isMobile) return

    const handleMouseEnter = () => {
      gsap.to(link, {
        scale: 1.05,
        rotationX: -2,
        z: 20,
        duration: 0.6,
        ease: "power3.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(link, {
        scale: 1,
        rotationX: 0,
        z: 0,
        duration: 0.6,
        ease: "power3.out",
      })
    }

    link.addEventListener("mouseenter", handleMouseEnter)
    link.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      link.removeEventListener("mouseenter", handleMouseEnter)
      link.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <button
      ref={linkRef}
      onClick={onClick}
      className="block mb-4 text-5xl md:text-7xl lg:text-9xl font-black leading-tight cursor-pointer transition-all duration-300 transform-gpu perspective-1000 text-left w-fit uppercase italic"
      style={{
        background: gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </button>
  )
}

export default function WebGLHero({ onEnter }: { onEnter: () => void }) {
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <BallpitBackground />

      <div className="relative z-10 h-full flex flex-col justify-end p-12 md:p-24">
        <div className="flex flex-col">
          <NavLink onClick={onEnter} gradient="linear-gradient(135deg, #ff2800, #ff8000)">
            START
          </NavLink>
          <NavLink onClick={() => setIsServicesOpen(true)} gradient="linear-gradient(135deg, #ffffff, #aaaaaa)">
            SERVICOS
          </NavLink>
        </div>
        
        <div className="mt-12 text-white/30 text-xs font-black uppercase tracking-[0.5em] flex items-center gap-4">
          <div className="w-12 h-[1px] bg-white/20" />
          <span>Innovate . Create . Dominate</span>
        </div>
      </div>

      <AnimatePresence>
        {isServicesOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 md:left-auto md:w-[600px] bg-black/95 backdrop-blur-2xl z-[300] border-l border-white/10 p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-primary">Serviços</h2>
              <button onClick={() => setIsServicesOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-12 pb-20">
              {/* Seção 1 */}
              <div>
                <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Expertise & Entregas</p>
                <div className="grid gap-4">
                  {[
                    { icon: Palette, title: "Designer", desc: "Criação de marcas e identidades visuais de alto impacto." },
                    { icon: Globe, title: "Criação de Sites", desc: "Landing pages e portfólios institucionais otimizados." },
                    { icon: Rocket, title: "Criação de Loja", desc: "E-commerces focados em conversão e usabilidade." },
                    { icon: Cpu, title: "Automação com IA", desc: "Sistemas inteligentes para otimizar fluxos de trabalho." },
                    { icon: Smartphone, title: "Social Media", desc: "Gestão estratégica de presença digital." },
                    { icon: Monitor, title: "Editor", desc: "Edição de vídeo e interfaces dinâmicas para web." }
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4 items-start">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><s.icon size={20} /></div>
                      <div>
                        <h4 className="font-bold text-white uppercase text-sm">{s.title}</h4>
                        <p className="text-xs text-white/50">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Habilidades 3D */}
              <div>
                <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Alta Performance & Imersão</p>
                <div className="space-y-6">
                  <div className="space-y-2">
                     <h4 className="font-bold text-primary italic uppercase sm">Experiências Web Imersivas (3D & WebGL)</h4>
                     <p className="text-sm text-white/70 leading-relaxed">Desenvolvimento de ambientes tridimensionais interativos que prendem a atenção e aumentam o tempo de permanência do usuário no site.</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="font-bold text-primary italic uppercase sm">Interfaces de Alta Performance</h4>
                     <p className="text-sm text-white/70 leading-relaxed">Criação de aplicações otimizadas onde a fluidez das animações não compromete a velocidade de carregamento (Core Web Vitals).</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="font-bold text-primary italic uppercase sm">Motion Design para Web</h4>
                     <p className="text-sm text-white/70 leading-relaxed">Implementação de micro-interações e animações complexas (scroll-triggered, parallax, hover effects) que guiam a jornada do usuário.</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="font-bold text-primary italic uppercase sm">Desenvolvimento Frontend Escalável</h4>
                     <p className="text-sm text-white/70 leading-relaxed">Código limpo e modular utilizando as melhores práticas de mercado para garantir que o projeto possa crescer sem perder qualidade.</p>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="grid grid-cols-1 gap-8">
                <div>
                   <h3 className="text-xl font-black italic uppercase text-white mb-6">Core Frontend</h3>
                   <ul className="space-y-4 text-sm">
                     <li><span className="text-primary font-bold">React.js:</span> Construção de interfaces dinâmicas e reativas.</li>
                     <li><span className="text-primary font-bold">JS / TS:</span> Robustez e tipagem no desenvolvimento.</li>
                     <li><span className="text-primary font-bold">Next.js:</span> Performance superior e SEO premium.</li>
                   </ul>
                </div>
                <div>
                   <h3 className="text-xl font-black italic uppercase text-white mb-6">Imersão & 3D</h3>
                   <ul className="space-y-4 text-sm">
                     <li><span className="text-primary font-bold">Three.js / R3F:</span> Renderização de cenas 3D no navegador.</li>
                     <li><span className="text-primary font-bold">GLSL (Shaders):</span> Efeitos visuais customizados e texturas dinâmicas.</li>
                     <li><span className="text-primary font-bold">GSAP & Framer:</span> Padrão ouro para animações fluidas.</li>
                   </ul>
                </div>
                <div>
                   <h3 className="text-xl font-black italic uppercase text-white mb-6">Design & Tooling</h3>
                   <ul className="space-y-4 text-sm">
                     <li><span className="text-primary font-bold">UI/UX (Figma):</span> Prototipagem e layouts Bento Grid.</li>
                     <li><span className="text-primary font-bold">Tailwind CSS:</span> Estilização moderna e responsiva.</li>
                     <li><span className="text-primary font-bold">Vercel / Git:</span> Deploy e gerenciamento profissional.</li>
                   </ul>
                </div>
              </div>
              
              <Button 
                onClick={() => window.open("https://wa.me/558199130885", "_blank")}
                className="w-full bg-primary text-black font-black uppercase italic py-8 rounded-2xl"
              >
                🚀 Converse Comigo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
