"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TurbulentFlow } from "@/components/ui/turbulent-flow";
import Markdown from "react-markdown";
import { chatWithMaximus } from "../../src/services/aiService";
import {
  ImageIcon,
  FileUp,
  MonitorIcon,
  CircleUserRound,
  ArrowUpIcon,
  Paperclip,
  Code2,
  Palette,
  Layers,
  Rocket,
  Bot,
  User,
  Loader2,
  Terminal,
  ChevronRight,
  Maximize2,
  Minimize2
} from "lucide-react";

interface Message {
  role: 'user' | 'maximus';
  content: string;
  timestamp: Date;
}

interface AutoResizeProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: AutoResizeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`; // reset first
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Infinity)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export default function MaximusKningtChat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 48,
    maxHeight: 150,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim() || isTyping) return;

    const userMsg = message.trim();
    setMessage("");
    adjustHeight(true);
    
    const newUserMessage: Message = {
      role: 'user',
      content: userMsg,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setIsTyping(true);
    setIsExpanded(true);

    // Transform history for Gemini
    const history = chatHistory.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await chatWithMaximus(userMsg, history);

    const maximusMessage: Message = {
      role: 'maximus',
      content: response,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, maximusMessage]);
    setIsTyping(false);
  };

  const handleQuickAction = (label: string) => {
    setMessage(`Me ajude com: ${label}`);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className={cn(
      "relative w-full transition-all duration-700 ease-in-out border border-white/10 shadow-2xl bg-black overflow-hidden",
      isExpanded ? "min-h-[850px] rounded-[3rem]" : "min-h-[600px] rounded-[2.5rem]"
    )}>
      <TurbulentFlow>
        <div className="w-full h-full flex flex-col items-center">
          
          {/* Top Bar / Controls */}
          <div className="w-full p-6 flex justify-between items-center relative z-20">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#ff2800]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Sistemas Ativos</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="rounded-full bg-white/5 hover:bg-white/10"
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
          </div>

          {/* Centered AI Title (Only when not history or not expanded significantly) */}
          {!isExpanded && (
            <div className="flex-1 w-full flex flex-col items-center justify-center relative z-10 p-8">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white uppercase mb-2 cinema-text-shadow">
                  Maximus <span className="text-primary italic">Kningt</span>
                </h2>
                <p className="text-sm md:text-base text-white/60 font-medium tracking-wide">
                  Elite Digital Alchemist Intelligence
                </p>
              </div>
            </div>
          )}

          {/* Chat History Area */}
          {isExpanded && (
            <div className="flex-1 w-full max-w-4xl px-8 py-4 relative z-10 overflow-hidden flex flex-col">
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto pr-4 space-y-8 no-scrollbar scroll-smooth"
              >
                {chatHistory.length === 0 && !isTyping && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <Terminal size={40} className="text-primary" />
                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed max-w-xs">
                      Conexão Estabelecida.<br/>Aguardando comandos de RickZinxx ou associados.
                    </p>
                  </div>
                )}

                {chatHistory.map((msg, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "flex gap-4 group animate-fade-in-up",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500",
                      msg.role === 'user' 
                        ? "bg-white/5 border-white/10 text-white" 
                        : "bg-primary/20 border-primary/30 text-primary shadow-[0_0_20px_rgba(255,40,0,0.2)]"
                    )}>
                      {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    
                    <div className={cn(
                      "max-w-[80%] rounded-[2rem] px-6 py-4 backdrop-blur-2xl border",
                      msg.role === 'user' 
                        ? "bg-white/5 border-white/10 text-white/90" 
                        : "bg-white/[0.03] border-white/5 text-white/80"
                    )}>
                      <div className="flex items-center gap-2 mb-2 opacity-30">
                        <span className="text-[8px] font-black uppercase tracking-widest">
                          {msg.role === 'user' ? 'RickZinxx User' : 'Maximus Intelligence'}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <span className="text-[8px] font-mono">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="prose prose-invert prose-xs md:prose-sm max-w-none prose-headings:italic prose-headings:font-black prose-p:leading-relaxed prose-code:text-primary">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-4 animate-pulse">
                    <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                      <Loader2 className="animate-spin" size={20} />
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] px-6 py-4 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Transmutando Dados...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Input Box Section */}
          <div className={cn(
            "w-full max-w-3xl px-6 relative z-30 transition-all duration-500",
            isExpanded ? "pb-8" : "pb-12"
          )}>
            <div className="relative bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 overflow-hidden transition-all focus-within:border-primary/50 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
              <Textarea
                ref={textareaRef}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                onChange={(e) => {
                  setMessage(e.target.value);
                  adjustHeight();
                }}
                placeholder="Transmita seu comando para Maximus..."
                className={cn(
                  "w-full px-8 py-6 resize-none border-none shadow-none",
                  "bg-transparent text-white text-base md:text-lg font-medium",
                  "focus-visible:ring-0 focus-visible:ring-offset-0",
                  "placeholder:text-white/20 min-h-[72px]"
                )}
                style={{ overflow: "hidden" }}
              />

              {/* Footer Buttons */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/40 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                  >
                    <Paperclip size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/40 hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                  >
                    <ImageIcon size={20} />
                  </Button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end mr-4 opacity-20 group">
                    <span className="text-[7px] font-black uppercase tracking-[0.3em]">Protocolo Maximus-V1</span>
                    <span className="text-[7px] font-mono">Encrypted Terminal v.2.6</span>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    className={cn(
                      "group flex items-center gap-3 h-12 px-8 rounded-full transition-all font-black uppercase tracking-tighter text-[10px]",
                      message.trim() 
                        ? "bg-primary text-black hover:scale-105 shadow-[0_0_30px_rgba(255,40,0,0.3)]" 
                        : "bg-white/5 text-white/20 border border-white/5"
                    )}
                  >
                    <span>Executar</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Actions - Simplified when expanded */}
            <div className={cn(
              "flex items-center justify-center flex-wrap gap-2 transition-all duration-500",
              isExpanded ? "mt-4 h-0 opacity-0 pointer-events-none scale-95" : "mt-8 h-auto opacity-100"
            )}>
              <QuickAction onClick={() => handleQuickAction("Gerar Código")} icon={<Code2 className="w-4 h-4" />} label="Código" />
              <QuickAction onClick={() => handleQuickAction("Lançar App")} icon={<Rocket className="w-4 h-4" />} label="Lançar" />
              <QuickAction onClick={() => handleQuickAction("Componentes UI")} icon={<Layers className="w-4 h-4" />} label="UI" />
              <QuickAction onClick={() => handleQuickAction("Ideias de Tema")} icon={<Palette className="w-4 h-4" />} label="Temas" />
            </div>
          </div>
        </div>
      </TurbulentFlow>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-2 rounded-full border-white/10 bg-black/40 text-neutral-300 hover:text-white hover:bg-primary hover:text-black hover:border-transparent transition-all backdrop-blur-md h-9 px-4 group"
    >
      <span className="opacity-70 group-hover:opacity-100">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </Button>
  );
}
