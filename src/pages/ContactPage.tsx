import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, Github, Instagram, Linkedin, Send, ChevronRight } from "lucide-react";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Generate actual WhatsApp text and send
    const formattedText = encodeURIComponent(
      `Olá Rickzinxx! Meu nome é *${formData.name}* (${formData.email}).\n\n*Mensagem:*\n${formData.message}`
    );
    const whatsappUrl = `https://wa.me/5581999130885?text=${formattedText}`;
    
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      setIsSending(false);
    }, 800);
  };

  const contactMethods = [
    {
      title: "Email",
      value: "rickmarketing81@gmail.com",
      href: "mailto:rickmarketing81@gmail.com",
      icon: Mail,
      desc: "Retorno em até 24h úteis"
    },
    {
      title: "WhatsApp",
      value: "+55 (81) 99913-0885",
      href: "https://wa.me/5581999130885",
      icon: Phone,
      desc: "Contato instantâneo"
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/rickzinxx_/" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/seu-linkedin" }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20 flex flex-col gap-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4">
        <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-center md:text-left text-zinc-900 dark:text-white transition-colors">
          {t("nav.contato")}
        </h3>
        <div className="hidden md:block h-[1px] flex-1 bg-black/10 dark:bg-white/5 mx-8 transition-colors" />
        <Send className="text-primary animate-pulse w-8 h-8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: Info & Methods */}
        <div className="flex flex-col gap-8 text-left">
          <div>
            <h4 className="text-xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white mb-3 transition-colors">
              Vamos conversar?
            </h4>
            <p className="text-sm font-medium text-zinc-650 dark:text-zinc-400 leading-relaxed max-w-md transition-colors">
              Estou disponível para novas oportunidades de mercado, projetos freelancers focados em performance, consultorias de design UI ou parcerias inovadoras de desenvolvimento frontend.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.href}
                target={method.title !== "Email" ? "_blank" : undefined}
                rel="noreferrer"
                whileHover={{ x: 5, borderColor: "rgba(255, 40, 0, 0.3)" }}
                className="p-5 rounded-3xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-between group transition-colors duration-300 shadow-sm dark:shadow-none"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-100 dark:bg-white/5 group-hover:bg-primary/20 group-hover:text-primary rounded-2xl transition-all duration-300 text-zinc-500 dark:text-zinc-400">
                    <method.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                      {method.title}
                    </span>
                    <h5 className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-primary transition-colors mt-0.5">
                      {method.value}
                    </h5>
                    <p className="text-[10px] font-semibold tracking-wider text-zinc-500 dark:text-zinc-600 uppercase mt-0.5">
                      {method.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-zinc-500 group-hover:text-primary transition-colors" />
              </motion.a>
            ))}
          </div>

          {/* Socials Row */}
          <div className="flex items-center gap-4 mt-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-600 font-bold">Acompanhe nas Redes:</span>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-primary/30 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all duration-300 shadow-sm dark:shadow-none"
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Direct Message Form */}
        <div className="p-8 rounded-[2rem] bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex flex-col justify-between text-left relative overflow-hidden shadow-sm dark:shadow-none">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 mb-6 font-mono text-[10px] font-black uppercase tracking-widest text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>Envio Direto</span>
            </div>
            <h4 className="text-xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white mb-2 transition-colors">
              Envie uma Mensagem
            </h4>
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase mb-8">
              Respostas instantâneas via WhatsApp
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-2">Seu Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Silva"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-black/10 dark:border-white/5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-primary/45 focus:bg-white dark:focus:bg-white/[0.08] transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-2">Seu Email</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: joao@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-black/10 dark:border-white/5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-primary/45 focus:bg-white dark:focus:bg-white/[0.08] transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-2">Mensagem</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escreva sua mensagem aqui..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-black/10 dark:border-white/5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:border-primary/45 focus:bg-white dark:focus:bg-white/[0.08] transition-all resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSending}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 py-4.5 rounded-2xl bg-gradient-to-r from-primary to-orange-500 text-white font-black italic uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:brightness-110 active:brightness-95 transition-all shadow-lg"
              >
                <span>{isSending ? "ENVIANDO..." : "ENVIAR VIA WHATSAPP"}</span>
                <Send size={14} className={isSending ? "animate-ping" : ""} />
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
