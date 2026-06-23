import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Code2, ChevronRight, Palette, Laptop, Sparkles, Cpu, Layers, GitBranch, Terminal } from "lucide-react";
import BlurTextAnimation from "../components/ui/blur-text-animation";

const SKILLS = [
  { name: "HTML5", icon: Layers, desc: "Estruturação semântica e acessível" },
  { name: "CSS3", icon: Palette, desc: "Layouts modernos, Grid e Flexbox" },
  { name: "JavaScript", icon: Terminal, desc: "ES6+, assincronismo e manipulação de DOM" },
  { name: "React", icon: Cpu, desc: "SPA, Hooks, Context API e State Management" },
  { name: "SASS / Tailwind", icon: Laptop, desc: "Estilização avançada e design atômico" },
  { name: "Git", icon: GitBranch, desc: "Controle de versão e trabalho colaborativo" },
  { name: "NPM / Node", icon: Code2, desc: "Gerenciamento de pacotes e ferramentas de build" },
  { name: "Responsivo", icon: Sparkles, desc: "Mobile-first e adaptações multi-resolução" }
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20 flex flex-col gap-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4">
        <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-center md:text-left text-zinc-900 dark:text-white transition-colors">
          {t("nav.sobre")}
        </h3>
        <div className="hidden md:block h-[1px] flex-1 bg-black/10 dark:bg-white/5 mx-8 transition-colors" />
        <Code2 className="text-primary animate-pulse w-8 h-8" />
      </div>

      {/* Main Content Info */}
      <div className="w-full flex flex-col gap-6 text-zinc-700 dark:text-zinc-300 text-left">
          <BlurTextAnimation 
            text="Sou um Desenvolvedor Frontend apaixonado por criar interfaces web intuitivas e responsivas. Minha especialidade é transformar designs em código de alta performance, unindo estética e velocidade para garantir a melhor experiência para o usuário."
            highlightWords={["Desenvolvedor", "Frontend"]}
            fontSize="text-base md:text-lg"
            textColor="text-zinc-700 dark:text-zinc-300"
            once={true}
          />

          <BlurTextAnimation 
            text="Com experiência em projetos freelancer e corporativos, domino as principais tecnologias frontend do mercado. Entendo a fundo os pilares de performance (Core Web Vitals), modularização de componentes React e criação de fluxos limpos de código com tipagem estrita de dados."
            highlightWords={["performance", "Core", "Web", "Vitals"]}
            fontSize="text-sm md:text-base"
            textColor="text-zinc-500 dark:text-zinc-400"
            once={true}
          />

          <BlurTextAnimation 
            text="Meu foco principal é construir soluções eficientes que impactem positivamente as marcas dos meus clientes, seguindo à risca as melhores práticas de SEO, acessibilidade e design responsivo mobile-first."
            highlightWords={["SEO", "acessibilidade", "mobile-first"]}
            fontSize="text-sm md:text-base"
            textColor="text-zinc-500 dark:text-zinc-400"
            once={true}
          />
        </div>

      {/* Technologies Section */}
      <div className="mt-8 flex flex-col gap-8">
        <div>
          <h4 className="text-lg font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-2 italic transition-colors">
            Tecnologias que Utilizo
          </h4>
          <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Meu Tech Stack e Ferramentas Diárias</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, borderColor: "rgba(255, 40, 0, 0.3)" }}
              className="p-5 rounded-3xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex flex-col gap-3 group transition-all duration-300 text-left shadow-sm dark:shadow-none"
            >
              <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors text-zinc-500 dark:text-zinc-400 self-start">
                <skill.icon className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-black italic uppercase tracking-wider text-zinc-900 dark:text-white text-sm transition-colors">
                  {skill.name}
                </h5>
                <p className="text-zinc-500 text-[10px] font-semibold tracking-wide mt-1 uppercase">
                  {skill.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
