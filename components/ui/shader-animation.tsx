'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ShaderAnimationProps {
  phrases?: string[];
  onComplete?: () => void;
}

const ShaderAnimation = ({ phrases = [], onComplete }: ShaderAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const [currentPhraseIdx, setCurrentPhraseIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobile(mobileRegex.test(navigator.userAgent) || window.innerWidth < 1024);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Vertex shader source
    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment shader source with animated gradients
    const fragmentShaderSource = `
      precision mediump float;
      
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform bool u_isMobile;
      
      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263, 0.416, 0.557);
        
        return a + b * cos(6.28318 * (c * t + d));
      }
      
      float noise(vec2 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0);
      }
      
      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 uv0 = uv;
        uv = uv * 2.0 - 1.0;
        uv.x *= u_resolution.x / u_resolution.y;
        
        float d = length(uv);
        vec3 col = vec3(0.0);
        
        // Mobile optimization: fewer layers and simplified math
        int maxLayers = u_isMobile ? 1 : 4;
        
        // Create multiple animated layers
        for(int i = 0; i < 4; i++) {
          if (i >= maxLayers) break;
          float fi = float(i);
          uv = fract(uv * 1.5) - 0.5;
          
          float d_layer = length(uv) * exp(-length(uv0));
          vec3 color = palette(length(uv0) + fi * 0.4 + u_time * 0.01);
          
          d_layer = sin(d_layer * 4.0 + u_time) / 36.0;
          d_layer = pow(0.005 / max(d_layer, 0.0001), 1.2);
          
          col += color * d_layer;
        }
        
        // Add wave distortion
        float wave = sin(uv0.x * 2.0 + u_time) * 0.01;
        col += vec3(wave);
        
        // Add gradient overlay
        vec3 gradient1 = vec3(0.1, 0.0, 0.0); // Slightly more red
        vec3 gradient2 = vec3(0.4, 0.0, 0.1); // Deep red
        vec3 gradientMix = mix(gradient1, gradient2, uv0.y + sin(u_time) * 0.2);
        col = mix(col, gradientMix, 0.4);
        
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Create and compile shaders
    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      return;
    }

    // Set up geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const isMobileLocation = gl.getUniformLocation(program, 'u_isMobile');

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - (e.clientY / window.innerHeight);
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const startTime = Date.now();
    
    const render = () => {
      const currentTime = (Date.now() - startTime) * 0.001;
      
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, currentTime);
      gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1i(isMobileLocation, isMobile ? 1 : 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Cinematic sequence logic
  useEffect(() => {
    if (!phrases || phrases.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setCurrentPhraseIdx((prev) => {
        if (prev < phrases.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          // Wait a bit before completing
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 2000);
          return prev;
        }
      });
    }, 4000); // 4 seconds per phrase

    return () => clearInterval(timer);
  }, [phrases, onComplete]);

  return (
    <div className="fixed inset-0 z-[500] bg-black overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      
      <div className="relative z-10 w-full max-w-4xl px-8 text-center mt-[-5vh]">
        <AnimatePresence mode="wait">
          {phrases[currentPhraseIdx] && (
            <motion.div
              key={currentPhraseIdx}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center gap-6"
            >
              <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white cinema-text-shadow leading-[1.0] md:leading-[0.9] break-words max-w-[90vw]">
                {phrases[currentPhraseIdx]}
              </h2>
              <div className="w-12 md:w-16 h-[2px] bg-primary animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative cinema bars */}
      <div className="absolute top-0 left-0 w-full h-[15vh] bg-black z-20" />
      <div className="absolute bottom-0 left-0 w-full h-[15vh] bg-black z-20" />
    </div>
  );
};

export default ShaderAnimation;
