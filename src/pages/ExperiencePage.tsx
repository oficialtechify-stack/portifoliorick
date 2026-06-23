import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ChevronRight, Calendar, Bookmark, Briefcase } from "lucide-react";

const TIMELINE = [
  {
    date: "2023 - Presente",
    role: "Desenvolvedor Frontend Freelancer",
    company: "Trabalho Autônomo",
    desc: "Desenvolvimento de interfaces web responsivas e modernas para diversos clientes globais e startups, utilizando stacks avançadas como React, TypeScript e Tailwind CSS.",
    points: [
      "Criação de landing pages otimizadas e com foco absoluto em conversão de leads",
      "Implementação de designs responsivos pixel-perfect baseados em mockups do Figma",
      "Integração contínua com APIs REST e microsserviços modernos de forma segura",
      "Otimização extrema de performance (Core Web Vitals) e pontuações máximas no Lighthouse"
    ]
  },
  {
    date: "2022 - 2023",
    role: "Estagiário em Desenvolvimento Web",
    company: "Netmake",
    desc: "Suporte e melhoria contínua de aplicações corporativas internas baseadas em ecossistema JS moderno.",
    points: [
      "Implementação de novos componentes React reaproveitáveis documentados no Storybook",
      "Identificação e correção de bugs visuais e lógica de renderização em ambiente de testes",
      "Participação ativa em code reviews coletivos focado em boas práticas de design de tipos",
      "Execução de testes de usabilidade e responsividade multi-dispositivos locais"
    ]
  },
  {
    date: "2021 - 2022",
    role: "Desenvolvedor Júnior",
    company: "Avanthia",
    desc: "Desenvolvimento rápido de sites institucionais, e-commerces completos e blogs de conteúdo para marcas regionais.",
    points: [
      "Desenvolvimento dinâmico com ecossistemas CMS flexíveis e frameworks correlacionados",
      "Customização completa de temas customizados focados em estética moderna",
      "Integração de plugins estruturais de e-commerce e gateways de pagamento seguros",
      "Suporte técnico ágil de primeiro nível e treinamento dos painéis de administração"
    ]
  }
];

export default function ExperiencePage() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20 flex flex-col gap-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4">
        <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-center md:text-left">
          {t("nav.experiencia")}
        </h3>
        <div className="hidden md:block h-[1px] flex-1 bg-white/5 mx-8" />
        <Briefcase className="text-primary animate-pulse w-8 h-8" />
      </div>

      {/* Interactive Timeline Layout */}
      <div className="relative border-l border-white/5 pl-6 ml-4 md:ml-6 mt-10 space-y-12">
        {TIMELINE.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative group text-left"
          >
            {/* Pulsing indicator node */}
            <div className="absolute -left-[31px] md:-left-[33px] top-1.5 w-4 h-4 rounded-full bg-black border border-primary flex items-center justify-center transition-transform group-hover:scale-125 duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            </div>

            {/* Glowing line overlay on hover */}
            <div className="absolute -left-[24px] top-5 bottom-0 w-[1px] bg-gradient-to-b from-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Date Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 mb-4 font-mono text-[10px] font-black uppercase tracking-widest text-primary">
              <Calendar size={10} />
              <span>{item.date}</span>
            </div>

            {/* Glass Card content */}
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all duration-500">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <div>
                  <h4 className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors">
                    {item.role}
                  </h4>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold mt-1">
                    {item.company}
                  </p>
                </div>
              </div>

              <p className="text-sm font-medium text-zinc-300 leading-relaxed mb-6">
                {item.desc}
              </p>

              {/* Bullet Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {item.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex gap-2.5 items-start">
                    <ChevronRight size={14} className="text-primary mt-1 shrink-0 animate-pulse" />
                    <span className="text-xs text-zinc-400 font-medium leading-relaxed">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
