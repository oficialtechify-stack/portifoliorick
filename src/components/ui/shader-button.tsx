import { Warp } from "@paper-design/shaders-react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "@/lib/utils"
import { useThemeSystem } from "./theme-switcher"
import React from "react"

interface ShaderButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode
  shaderClassName?: string
  lightMode?: boolean
}

export const ShaderButton = React.forwardRef<HTMLButtonElement, ShaderButtonProps>(
  ({ children, className, shaderClassName, lightMode = false, ...props }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const { theme } = useThemeSystem();
    const isDark = theme === "dark";
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(navigator.userAgent) || window.innerWidth < 768);
    }, []);

    return (
      <motion.button
        ref={ref}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.95 }}
        animate={isHovered ? {
          scale: [1, 1.02, 1],
          boxShadow: [
            "0 0 0px rgba(255, 0, 0, 0)",
            "0 0 20px rgba(255, 0, 0, 0.3)",
            "0 0 0px rgba(255, 0, 0, 0)"
          ]
        } : { 
          scale: 1,
          boxShadow: "0 0 0px rgba(255, 0, 0, 0)"
        }}
        transition={isHovered ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {
          duration: 0.3
        }}
        className={cn(
          "relative overflow-hidden group rounded-[2rem] transition-all duration-300",
          className
        )}
        {...props}
      >
        {/* Click Flash effect */}
        <motion.div 
          className="absolute inset-0 z-20 bg-white opacity-0"
          initial={false}
          whileTap={{ opacity: [0, 0.2, 0], transition: { duration: 0.3 } }}
        />

        {/* Shader Background */}
        <div className={cn("absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity", shaderClassName)}>
          {!lightMode && !isMobile ? (
            <Warp
              style={{ width: "100%", height: "100%" }}
              proportion={0.5}
              softness={0.7}
              distortion={0.3}
              swirl={1.2}
              swirlIterations={10}
              shape="checks"
              shapeScale={0.08}
              scale={1.5}
              rotation={0}
              speed={isHovered ? 2.5 : 1.2}
              colors={isDark ? ["#FF0000", "#CC0000", "#FF4444", "#000000"] : ["#E61900", "#CC1B0A", "#FF3B26", "#FFFFFF"]}
            />
          ) : (
            <div className={cn(
              "w-full h-full bg-gradient-to-r",
              isDark ? "from-[#FF1A00] via-[#CC0000] to-[#FF4444]" : "from-[#E61900] via-[#CC1B0A] to-[#FF3B26]"
            )} />
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>

        {/* Overlay to darken slightly or add contrast if needed */}
        <div className="absolute inset-0 z-[5] bg-black/10 group-hover:bg-transparent transition-colors" />
      </motion.button>
    )
  }
)

ShaderButton.displayName = "ShaderButton"
