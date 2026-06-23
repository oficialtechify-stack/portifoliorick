import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { PricingWrapper, Heading as CardHeading, Paragraph as CardParagraph, Price as CardPrice } from "../components/ui/animated-pricing-cards";
import { CTASection } from "../components/ui/hero-dithering-card";
import { cn } from "@/lib/utils";

const PROJECTS = [
  {
    title: "Senac Reciclagem",
    desc: "Uma plataforma educacional dedicada à conscientização ambiental, oferecendo informações detalhadas sobre o descarte correto de lixo e dicas sustentáveis com foco em Pernambuco.",
    stack: "HTML + CSS + JS",
    link: "https://senac-reciclagem-v1.netlify.app",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Neon Tic-Tac-Toe Diamond",
    desc: "Jogo da velha com tema neon desenvolvido para diversão e passatempo. Interface luminosa e visual elegante.",
    stack: "HTML + CSS + JS",
    link: "https://neon-tic-tac-teo.netlify.app/",
    image: "https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Techify Max",
    desc: "Sistema avançado de automação e escala digital de alto padrão.",
    stack: "React + GSAP",
    link: "https://splendid-unicorn-68fd5c.netlify.app",
    image: "https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Techify Office",
    desc: "Plataforma de gestão e inteligência corporativa da Techify.",
    stack: "Next.js + Tailwind",
    link: "https://techify-office.vercel.app",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Quantum Flow",
    desc: "Engine de animação 3D para interfaces de alto desempenho.",
    stack: "Three.js + Shaders",
    link: "#",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Elite Commerce",
    desc: "E-commerce headless com foco em performance extrema.",
    stack: "SolidJS + Node",
    link: "#",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20 flex flex-col gap-20">
      <section className="w-full">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Home
        </Link>

        <div className="flex flex-col md:flex-row items-center justify-between mb-12 px-2 gap-4">
            <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-center md:text-left">{t("projects.title")}</h3>
            <div className="hidden md:block h-[1px] flex-1 bg-white/5 mx-8" />
            <ChevronRight className="text-primary animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project, idx) => (
              <PricingWrapper 
                key={idx} 
                contactHref={project.link} 
                type={idx % 2 === 0 ? 'waves' : 'crosses'}
                color={idx === 0 ? 'bg-primary' : 'bg-white/[0.03]'}
                image={project.image}
                className="max-w-none hover:scale-[1.02] transition-transform duration-500"
              >
                 <CardHeading className={idx === 0 ? 'text-black' : 'text-white'}>
                   {project.title}
                 </CardHeading>
                 <CardPrice className={idx === 0 ? 'text-black/60' : 'text-primary'}>
                   {project.stack}
                 </CardPrice>
                 <CardParagraph className={idx === 0 ? 'text-black/80' : 'text-zinc-200 font-medium'}>
                   {project.desc}
                 </CardParagraph>
              </PricingWrapper>
            ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
