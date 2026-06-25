import { Warp } from "@paper-design/shaders-react"
import { useThemeSystem } from "./theme-switcher"

export default function BackgroundShaders({ isMobile }: { isMobile?: boolean }) {
  const { theme } = useThemeSystem();
  
  // Custom theme shades adjusting automatically
  // In light mode: Red & White / pinkish white gradients
  // In dark mode: Red & Black / dark red gradients
  const colors = theme === "dark"
    ? ["#FF1A00", "#220000", "#000000", "#FF0000"]
    : ["#E61900", "#FFF1EF", "#FFFFFF", "#CC1B0A"];

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-white dark:bg-black overflow-hidden transition-colors duration-500">
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes floatBlob1 {
            0% { transform: translate3d(0, 0, 0) scale(1); }
            50% { transform: translate3d(5vw, 5vh, 0) scale(1.05); }
            100% { transform: translate3d(0, 0, 0) scale(1); }
          }
          @keyframes floatBlob2 {
            0% { transform: translate3d(0, 0, 0) scale(1.05); }
            50% { transform: translate3d(-5vw, -5vh, 0) scale(0.95); }
            100% { transform: translate3d(0, 0, 0) scale(1.05); }
          }
          .animate-blob1 {
            animation: floatBlob1 15s infinite ease-in-out;
            will-change: transform;
          }
          .animate-blob2 {
            animation: floatBlob2 20s infinite ease-in-out;
            will-change: transform;
          }
        `}} />
        {/* Soft floating background light blobs (Hardware-accelerated) */}
        <div 
          className="absolute top-[-20%] right-[-10%] w-[100vw] h-[100vw] rounded-full bg-primary/[0.08] dark:bg-primary/[0.12] blur-[80px] pointer-events-none animate-blob1" 
        />
        <div 
          className="absolute bottom-[-25%] left-[-15%] w-[110vw] h-[110vw] rounded-full bg-primary/[0.04] dark:bg-primary/[0.06] blur-[100px] pointer-events-none animate-blob2" 
        />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-white dark:bg-black transition-colors duration-500">
      <Warp
        style={{ width: "100%", height: "100%" }}
        proportion={0.45}
        softness={0.9}
        distortion={0.3}
        swirl={0.8}
        swirlIterations={8}
        shape="checks"
        shapeScale={0.08}
        scale={1}
        rotation={0}
        speed={0.15}
        colors={colors}
        className="size-full opacity-65 dark:opacity-60 transition-all duration-500"
      />
    </div>
  )
}
