import * as React from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

// Custom Hook to manage theme states
export function useThemeSystem() {
  const [theme, setThemeState] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    // Check local storage or document class
    const isDark = document.documentElement.classList.contains("dark") || 
                   (!localStorage.getItem("theme") ? true : localStorage.getItem("theme") === "dark");
    
    if (isDark) {
      document.documentElement.classList.add("dark");
      setThemeState("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setThemeState("light");
    }

    const observer = new MutationObserver(() => {
      const darkActive = document.documentElement.classList.contains("dark");
      setThemeState(darkActive ? "dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = (newTheme: "light" | "dark") => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    setThemeState(newTheme);
  };

  return { theme, toggleTheme };
}

interface ThemeSwitcherProps {
  maskGifUrl?: string;
  duration?: string;
}

export function ThemeSwitcher({
  maskGifUrl = "https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif",
  duration = "1.5s",
}: ThemeSwitcherProps) {
  const { theme, toggleTheme } = useThemeSystem();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setIsOpen(false);
    if (newTheme === theme) return;

    if (!(document as any).startViewTransition) {
      toggleTheme(newTheme);
      return;
    }

    (document as any).startViewTransition(() => {
      flushSync(() => {
        toggleTheme(newTheme);
      });
    });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* View Transition Mask Styling */}
      <style>{`
        :root {
          --expo-in: linear(
            0 0%, 0.0085 31.26%, 0.0167 40.94%,
            0.0289 48.86%, 0.0471 55.92%,
            0.0717 61.99%, 0.1038 67.32%,
            0.1443 72.07%, 0.1989 76.7%,
            0.2659 80.89%, 0.3465 84.71%,
            0.4419 88.22%, 0.554 91.48%,
            0.6835 94.51%, 0.8316 97.34%, 1 100%
          );
        }

        ::view-transition-group(root) {
          animation-timing-function: var(--expo-in);
        }

        ::view-transition-new(root) {
          -webkit-mask: url('${maskGifUrl}') center / 0 no-repeat;
          mask: url('${maskGifUrl}') center / 0 no-repeat;
          animation: scale ${duration};
          animation-fill-mode: both;
        }

        ::view-transition-old(root),
        .dark::view-transition-old(root) {
          animation: scale ${duration};
          animation-fill-mode: both;
        }

        ::view-transition-old(root),
        ::view-transition-new(root) {
          mix-blend-mode: normal;
        }

        @keyframes scale {
          0% {
            -webkit-mask-size: 0;
            mask-size: 0;
          }
          10% {
            -webkit-mask-size: 50vmax;
            mask-size: 50vmax;
          }
          90% {
            -webkit-mask-size: 50vmax;
            mask-size: 50vmax;
          }
          100% {
            -webkit-mask-size: 2000vmax;
            mask-size: 2000vmax;
          }
        }

        /* View Transition effects are enabled across all screen sizes */
      `}</style>

      {/* Button Switcher Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9.5 w-9.5 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-black/5 text-neutral-800 shadow-sm transition-all hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-neutral-200 dark:hover:bg-white/10 p-2"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-lg border border-black/10 bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:border-white/10 dark:bg-black z-[200]">
          <button
            onClick={() => handleThemeChange("light")}
            className={cn(
              "flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
              theme === "light"
                ? "bg-primary text-black dark:bg-primary dark:text-black"
                : "text-zinc-600 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
            )}
          >
            Light
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className={cn(
              "flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
              theme === "dark"
                ? "bg-primary text-black dark:bg-primary dark:text-black"
                : "text-zinc-600 hover:bg-black/5 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
            )}
          >
            Dark
          </button>
        </div>
      )}
    </div>
  );
}
