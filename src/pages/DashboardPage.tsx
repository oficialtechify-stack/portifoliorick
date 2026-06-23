import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ChevronRight, ArrowLeft, Globe, ArrowUpRight, Cpu, Landmark, ShieldCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import TechifyDashboard from "../components/ui/financial-markets-table";
import { CTASection } from "../components/ui/hero-dithering-card";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col gap-12 md:gap-20">
      <section className="w-full">
        {/* Back navigation link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors mb-8 md:mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Home
        </Link>

        {/* Headings */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 px-2 gap-4">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-2 text-primary font-black uppercase text-[10px] tracking-[0.3em]">
              <Globe className="w-3 h-3 animate-spin [animation-duration:8s]" />
              <span>Operação Global Ativa</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-center md:text-left leading-none">
              TECHIFY GLOBAL
            </h3>
          </div>
          <div className="hidden md:block h-[1px] flex-1 bg-white/5 mx-8" />
          <ChevronRight className="text-primary animate-pulse shrink-0" />
        </div>

        {/* Hero description cards about Techify being everywhere */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl border border-white/5 bg-zinc-950/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-xl rounded-full" />
            <Cpu className="text-primary w-5 h-5 mb-4" />
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">Presença Extrema</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Sistemas distribuídos em data centers de ponta no mundo inteiro. Velocidade e latência zero de ponta a ponta.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl border border-white/5 bg-zinc-950/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-xl rounded-full" />
            <Landmark className="text-primary w-5 h-5 mb-4" />
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">Escala Global</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Faturamento sólido em moedas fortes (USD, EUR, BRL) impulsionando tecnologia de altíssimo padrão por toda parte.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-3xl border border-white/5 bg-zinc-950/40 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-xl rounded-full" />
            <ShieldCheck className="text-primary w-5 h-5 mb-4" />
            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2">Empresa Segura</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Garantia de segurança, estabilidade e conformidade legislativa internacional para todos os nossos clientes.
            </p>
          </motion.div>
        </div>

        {/* Global Revenue Table section */}
        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/5 gap-2">
            <div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white">Relatório de Transações & Rendimento</h4>
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Atualizado em tempo real • Conectado à API Techify Core</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-[9px] text-primary font-black uppercase tracking-widest animate-pulse flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
              <span>SISTEMA DE TRANSMISSÃO ON-LINE</span>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full mt-2"
          >
            <TechifyDashboard />
          </motion.div>
        </div>
      </section>

      {/* Interactive summary about rickzinxx everywhere */}
      <section className="w-full p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-950/30 via-zinc-950/50 to-zinc-950/20 relative overflow-hidden">
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-4 relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Unindo os Quatro Cantos</span>
          <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
            ESTAMOS EM TODOS OS LUGARES
          </h3>
          <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed max-w-2xl">
            Fundada pelo desenvolvedor frontend <span className="text-white font-bold">RICKZINXX</span>, a <span className="text-primary font-bold">Techify</span> é hoje uma agência global altamente especializada na criação de ecossistemas web de alta conversão, portfólios imersivos, aplicações em tempo real, jogos de cassino seguros, e landing pages cinemáticas. Projetando à mão em Recife, PE para o mundo todo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/50">
              <span>ESTADOS UNIDOS</span>
              <span className="text-primary">//</span>
              <span>BRASIL</span>
              <span className="text-primary">//</span>
              <span>PORTUGAL</span>
              <span className="text-primary">//</span>
              <span>REINO UNIDO</span>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Call To Action */}
      <CTASection />
    </div>
  );
}
