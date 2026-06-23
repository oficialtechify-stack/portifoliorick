import { Warp } from "@paper-design/shaders-react"
import { useThemeSystem } from "./theme-switcher"

export default function BackgroundShaders({ isMobile }: { isMobile?: boolean }) {
  const { theme } = useThemeSystem();
  
  // Custom theme shades adjusting automatically
  // In light mode: Red & White / pinkish white gradients
  // In dark mode: Red & Black / dark red gradients
  const colors = theme === "dark"
    ? ["#FF1A00", "#220000", "#000000", "#FF0000"]
    : ["#FF1A00", "#FFF4F2", "#FFFFFF", "#FF3322"];

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-white dark:bg-black transition-colors duration-500">
      {!isMobile ? (
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
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      )}
    </div>
  )
}
