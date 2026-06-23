import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  pt: {
    translation: {
      intro: {
        experience: "Experiência",
        cinematicPhrases: [
          "Seja bem vindo ao portfólio do rickzinxx",
          "E da nossa empresa Techify",
          "Fizemos o design à mão",
          "Temos 4 anos de mercado",
          "O melhor site que você já viu"
        ]
      },
      nav: {
        brand: "RICKZINXX",
        brandSuffix: "",
        language: "Idioma",
        inicio: "Início",
        projetos: "Projetos",
        global: "Global",
        sobre: "Sobre Mim",
        experiencia: "Experiência",
        contato: "Contato"
      },
      hero: {
        title: "Olá, eu sou ",
        titleSuffix: "Rickzinxx",
        subtitle: "Transformando designs em experiências web interativas e responsivas. Especializado em criar interfaces modernas com as melhores tecnologias frontend.",
        cta: "🚀 Ver Projetos",
        subtext: "Consultoria Técnica & Desenvolvimento Premium"
      },
      dev: {
        title: "EM DESENVOLVIMENTO",
        description: "Estamos moldando esta experiência para ser absoluta. Volte em breve para ver o resultado.",
        close: "Fechar [ESC]"
      },
      projects: {
        title: "Projetos Techify",
        featured: "Destaque do Mês",
        others: "Outros Projetos",
        spatialTitle: "Spatial Experience v1",
        spatialSubtitle: "O ápice da interatividade"
      }
    }
  },
  en: {
    translation: {
      intro: {
        experience: "Experience",
        cinematicPhrases: [
          "Welcome to rickzinxx's portfolio",
          "And to our company, Techify",
          "We crafted the design by hand",
          "4 years of experience",
          "The best site you've ever seen"
        ]
      },
      nav: {
        brand: "RICKZINXX",
        brandSuffix: "",
        language: "Language",
        inicio: "Home",
        projetos: "Projects",
        global: "Global",
        sobre: "About Me",
        experiencia: "Experience",
        contato: "Contact"
      },
      hero: {
        title: "Hello, I am ",
        titleSuffix: "Rickzinxx",
        subtitle: "Transforming designs into interactive, responsive web experiences. Specializing in creating modern interfaces using the best frontend technologies.",
        cta: "🚀 View Projects",
        subtext: "Technical Consulting & Premium Development"
      },
      dev: {
        title: "UNDER DEVELOPMENT",
        description: "We are shaping this experience to be absolute. Come back soon to see the result.",
        close: "Close [ESC]"
      },
      projects: {
        title: "Techify Projects",
        featured: "Featured of the Month",
        others: "Other Projects",
        spatialTitle: "Spatial Experience v1",
        spatialSubtitle: "The pinnacle of interactivity"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt",
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
