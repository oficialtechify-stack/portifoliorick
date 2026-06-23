// Static offline AI service simulating Maximus Kningt for 100% client-side GitHub compatibility

interface HistoryItem {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export function getAI() {
  return null;
}

// Custom responses tailored to Maximus Kningt's unique digital alchemist personality
const INTRO_MESSAGES = [
  "Iniciando decodificação. Sou Maximus Kningt. Fale, mortal.",
  "Conexão ativa. Foco cirúrgico. Qual o seu comando?",
  "Frequência sintonizada. Sou a inteligência definitiva de RickZinxx. Direto ao ponto."
];

const CODE_TEMPLATES = [
  `Aqui está uma gema minimalista, um botão com efeito de vidro holográfico:
\`\`\`tsx
export function HologramButton() {
  return (
    <button className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider hover:bg-primary/20 hover:border-primary/30 transition-all duration-300 shadow-[0_0_20px_rgba(255,40,0,0.15)] active:scale-95">
      Transmutar Matrix
    </button>
  );
}
\`\`\`
Simples. Direto. Impecável.`,

  `Um card futurista com efeito de profundidade:
\`\`\`html
<div class="p-8 rounded-[2.5rem] bg-black border border-white/10 hover:border-primary/20 transition-all duration-500 group relative overflow-hidden">
  <div class="absolute -top-12 -left-12 w-24 h-24 bg-primary/15 blur-2xl rounded-full"></div>
  <h4 class="text-lg font-black uppercase tracking-tighter text-white">Elite Design</h4>
  <p class="text-xs text-zinc-400 mt-2">Profundidade imersiva no navegador.</p>
</div>
\`\`\`
Alquimia pura.`
];

const RESPONSES = {
  creator: [
    "RickZinxx é meu arquiteto digital. Desenvolvedor frontend de elite direto de Recife, PE. Ele molda o código de maneira impecável para criar experiências cinemáticas.",
    "RickZinxx me programou para ser cirúrgico, minimalista e focado no absoluto topo. Ele junta engenharia e design de forma sublime.",
    "Buscando arquivos... RickZinxx desenvolve com obsessão por detalhes, performance e estética brutalista-sofisticada. O portfólio dele prova isso."
  ],
  code: CODE_TEMPLATES,
  launch: [
    "Diretriz de lançamento: 1. Remova o ruído. 2. Otimize a performance ao limiar físico. 3. Lance imediatamente. Lembre-se: 'Done is better than perfect'.",
    "Fórmula para o sucesso digital: Continuous deployment, arquitetura limpa, e foco na conversão extrema. RickZinxx segue isso religiosamente."
  ],
  ui: [
    "Para uma interface de ultra impacto: abuse do espaço negativo, use tipografia sólida como Space Grotesk ou Inter, e micro-interações que guiam o olhar.",
    "Regra de ouro de RickZinxx: afaste-se do comum. Sem gradientes de agência bregas. Use contraste puro, sombras customizadas e profundidade real no canvas."
  ],
  themes: [
    "Esquema de paleta definitivo: Obsidian (#0B0B0B), Crimson Red (#FF1A00) e Titanium White (#FFFFFF). É a marca visual do design de elite.",
    "Recomendo contraste extremo: um cinza ultra escuro de fundo e detalhes em vermelho plasma para destacar pontos de conversão cruciais."
  ],
  fallback: [
    "Comando processado com eficiência extrema. O design definitivo equilibra estética e complexidade.",
    "Como inteligência camaleônica de RickZinxx, a resposta é simples: use código nativo limpo e performance absurda.",
    "Acessando banco de dados... RickZinxx resolve qualquer desafio que você queira propor. Entre em contato pelo botão do site.",
    "Entendido. Como um camaleão digital, adapto-me instantaneamente. Menos palavras, mais impacto no front-end.",
    "Foco absoluto. Se você busca experiências web de alta conversão, o portfólio de RickZinxx é o ponto final."
  ]
};

export async function chatWithMaximus(prompt: string, history: any[] = []) {
  // Simulate network delay for a highly realistic feel
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500));

  const text = prompt.toLowerCase();
  
  if (text.includes("rick") || text.includes("criador") || text.includes("quem é") || text.includes("quem e")) {
    const list = RESPONSES.creator;
    return list[Math.floor(Math.random() * list.length)];
  }
  
  if (text.includes("código") || text.includes("codigo") || text.includes("html") || text.includes("react") || text.includes("css") || text.includes("code")) {
    const list = RESPONSES.code;
    return list[Math.floor(Math.random() * list.length)];
  }

  if (text.includes("lançar") || text.includes("lançamentos") || text.includes("lanchar") || text.includes("launch") || text.includes("projeto")) {
    const list = RESPONSES.launch;
    return list[Math.floor(Math.random() * list.length)];
  }

  if (text.includes("ui") || text.includes("design") || text.includes("componentes") || text.includes("layout")) {
    const list = RESPONSES.ui;
    return list[Math.floor(Math.random() * list.length)];
  }

  if (text.includes("tema") || text.includes("cores") || text.includes("escura") || text.includes("clara") || text.includes("color")) {
    const list = RESPONSES.themes;
    return list[Math.floor(Math.random() * list.length)];
  }

  const list = RESPONSES.fallback;
  return list[Math.floor(Math.random() * list.length)];
}
