import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  isExplosion?: boolean;
}

interface ParticleTextProps {
  text?: string;
  particleSize?: number;
  animationSpeed?: number;
  mouseForce?: number;
  interactionMode?: 'attract' | 'repel';
  fontSize?: number;
  fontFamily?: string;
  className?: string;
  primaryColor?: [number, number, number]; // RGB
  secondaryColor?: [number, number, number];
  accentColor?: [number, number, number];
  glowColor?: [number, number, number];
  coreColor?: [number, number, number];
}

// WebGL Shader sources
const vertexShaderSource = `
  precision mediump float;
  
  attribute vec2 a_position;
  attribute float a_size;
  attribute float a_opacity;
  
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  
  varying float v_opacity;
  varying vec2 v_position;
  
  void main() {
    vec2 position = (a_position / u_resolution) * 2.0 - 1.0;
    position.y *= -1.0;
    
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = a_size;
    
    v_opacity = a_opacity;
    v_position = a_position;
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform vec3 u_accentColor;
  uniform vec3 u_glowColor;
  uniform vec3 u_coreColor;
  
  varying float v_opacity;
  varying vec2 v_position;
  
  void main() {
    vec2 coord = gl_PointCoord - 0.5;
    float dist = length(coord);
    
    if (dist > 0.5) {
      discard;
    }
    
    // Enhanced glow effect with multiple layers
    float innerGlow = 1.0 - smoothstep(0.0, 0.2, dist);
    float outerGlow = 1.0 - smoothstep(0.2, 0.5, dist);
    float glow = pow(innerGlow, 3.0) + pow(outerGlow, 1.5) * 0.6;
    
    // Mouse interaction effects
    float mouseDist = distance(v_position, u_mouse);
    float mouseGlow = 1.0 / (1.0 + mouseDist * 0.008);
    float mouseIntensity = smoothstep(300.0, 0.0, mouseDist);

    // Set colors from uniform colors
    vec3 primaryColor = u_primaryColor;
    vec3 secondaryColor = u_secondaryColor;
    vec3 accentColor = u_accentColor;
    vec3 glowColor = u_glowColor;
    vec3 coreColor = u_coreColor;
    
    // Multi-layered color mixing
    float timeWave = sin(u_time * 0.0008) * 0.5 + 0.5;
    float positionGradient = (v_position.x / u_resolution.x + v_position.y / u_resolution.y) * 0.5;
    
    vec3 baseColor = mix(primaryColor, secondaryColor, timeWave);
    baseColor = mix(baseColor, accentColor, positionGradient * 0.3);
    
    // Core particle color (bright center)
    vec3 color = mix(baseColor, coreColor, innerGlow * 0.8);
    
    // Mouse interaction coloring
    color = mix(color, glowColor, mouseGlow * mouseIntensity * 0.6);
    
    // Particle bloom effect
    float bloom = glow * (1.0 + mouseGlow * 0.8);
    float finalAlpha = bloom * v_opacity * (0.9 + mouseIntensity * 0.4);
    
    gl_FragColor = vec4(color, finalAlpha);
  }
`;

// Post-processing shader for bloom and film grain
const postVertexShader = `
  attribute vec2 a_position;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = (a_position + 1.0) * 0.5;
  }
`;

const postFragmentShader = `
  precision mediump float;
  
  uniform sampler2D u_texture;
  uniform vec2 u_texelSize;
  uniform float u_time;
  uniform vec2 u_resolution;
  
  varying vec2 v_texCoord;
  
  // Random function for film grain
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  // Film grain noise
  float filmGrain(vec2 uv, float time) {
    float grain = random(uv + time * 0.001);
    grain = pow(grain, 1.5);
    return grain * 0.08; // Grain intensity
  }
  
  void main() {
    vec4 color = texture2D(u_texture, v_texCoord);
    
    // Multi-pass bloom effect
    vec4 bloom = vec4(0.0);
    float totalWeight = 0.0;
    
    // Bloom sampling with gaussian weights
    for (int i = -4; i <= 4; i++) {
      for (int j = -4; j <= 4; j++) {
        vec2 offset = vec2(float(i), float(j)) * u_texelSize * 2.5;
        vec4 sample = texture2D(u_texture, v_texCoord + offset);
        
        float weight = exp(-float(i*i + j*j) * 0.2);
        bloom += sample * weight;
        totalWeight += weight;
      }
    }
    bloom /= totalWeight;
    
    // Enhanced bloom for bright particles
    vec4 brightPass = max(color - 0.4, 0.0) * 3.0;
    bloom = bloom + brightPass * 0.9;
    
    // Film grain
    float grain = filmGrain(v_texCoord * u_resolution, u_time);
    
    // Chromatic aberration for retro effect
    vec2 center = v_texCoord - 0.5;
    float aberration = length(center) * 0.015;
    
    vec4 r = texture2D(u_texture, v_texCoord + center * aberration * vec2(1.0, 0.0));
    vec4 g = texture2D(u_texture, v_texCoord);
    vec4 b = texture2D(u_texture, v_texCoord - center * aberration * vec2(0.0, 1.0));
    
    vec4 aberrated = vec4(r.r, g.g, b.b, g.a);
    
    // Vignette effect
    float vignette = 1.0 - length(center) * 0.8;
    vignette = smoothstep(0.3, 1.0, vignette);
    
    // Final composition
    vec4 final = aberrated + bloom * 0.6;
    final.rgb += grain;
    final.rgb *= vignette;
    
    // Color grading for cinematic look
    final.rgb = pow(final.rgb, vec3(0.9)); // Slight gamma adjustment
    final.rgb = mix(final.rgb, final.rgb * vec3(1.1, 0.95, 1.05), 0.3); // Color tint
    
    gl_FragColor = final;
  }
`;

// Helper function to convert hex to RGB array
export const hexToRGB = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
};

export const ParticleText: React.FC<ParticleTextProps> = ({
  text = 'RICKZINXX',
  particleSize = 0.04,
  animationSpeed = 1.8,
  mouseForce = 180,
  interactionMode = 'repel',
  fontSize,
  fontFamily = 'Inter, Montserrat, sans-serif',
  className = '',
  primaryColor = [1.0, 0.157, 0.0],   // Brand Red (#ff2800)
  secondaryColor = [1.0, 0.333, 0.2], // Lighter Orange-Red (#ff5533)
  accentColor = [0.8, 0.125, 0.0],    // Darker Red (#cc2000)
  glowColor = [1.0, 0.4, 0.0],        // Warm Glow
  coreColor = [1.0, 1.0, 1.0],        // Pure White Core
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webglCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const particlesRef = useRef<Particle[]>([]);
  const actualFontSizeRef = useRef<number>(75);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const postProgramRef = useRef<WebGLProgram | null>(null);
  const framebufferRef = useRef<WebGLFramebuffer | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);
  const buffersRef = useRef<{
    position: WebGLBuffer | null;
    size: WebGLBuffer | null;
    opacity: WebGLBuffer | null;
  }>({ position: null, size: null, opacity: null });
  
  const [webglFailed, setWebglFailed] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [, setPerformance] = useState({
    fps: 60,
    particleCount: 0
  });

  // WebGL helper functions
  const createShader = useCallback((gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
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
  }, []);

  const createProgram = useCallback((gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null => {
    const program = gl.createProgram();
    if (!program) return null;
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    
    return program;
  }, []);

  const initWebGL = useCallback(() => {
    const canvas = webglCanvasRef.current;
    if (!canvas) return false;

    const gl = canvas.getContext('webgl', { 
      alpha: true, 
      premultipliedAlpha: false,
      antialias: true,
      preserveDrawingBuffer: false
    });
    
    if (!gl) {
      console.error('WebGL not supported');
      return false;
    }

    glRef.current = gl;

    // Create main rendering program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    if (!vertexShader || !fragmentShader) return false;
    
    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return false;
    
    programRef.current = program;

    // Create post-processing program
    const postVertex = createShader(gl, gl.VERTEX_SHADER, postVertexShader);
    const postFragment = createShader(gl, gl.FRAGMENT_SHADER, postFragmentShader);
    
    if (!postVertex || !postFragment) return false;
    
    const postProgram = createProgram(gl, postVertex, postFragment);
    if (!postProgram) return false;
    
    postProgramRef.current = postProgram;

    // Setup framebuffer for post-processing
    const framebuffer = gl.createFramebuffer();
    const texture = gl.createTexture();
    
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      console.error('Framebuffer not complete');
      return false;
    }
    
    framebufferRef.current = framebuffer;
    textureRef.current = texture;

    // Create buffers
    buffersRef.current = {
      position: gl.createBuffer(),
      size: gl.createBuffer(),
      opacity: gl.createBuffer()
    };

    // Setup WebGL state
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return true;
  }, [createShader, createProgram]);

  const createParticlesFromText = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    particlesRef.current = [];

    const isMobileDevice = window.innerWidth < 768;
    const dpr = window.devicePixelRatio || 1;

    // Calculate the ideal CSS font size first
    let cssFontSize = fontSize || (isMobileDevice ? Math.max(34, Math.min(52, window.innerWidth / 7.5)) : Math.min(100, window.innerWidth / 8));
    
    // Use a temporary context in CSS-scale size to measure and fit text
    const testCanvas = document.createElement('canvas');
    const testCtx = testCanvas.getContext('2d');
    let textWidth = 0;
    if (testCtx) {
      testCtx.font = `italic 900 ${cssFontSize}px ${fontFamily}`;
      const maxAllowedCSSWidth = window.innerWidth * 0.85;
      let textCSSWidth = testCtx.measureText(text).width;
      
      while (textCSSWidth > maxAllowedCSSWidth && cssFontSize > 18) {
        cssFontSize -= 2;
        testCtx.font = `italic 900 ${cssFontSize}px ${fontFamily}`;
        textCSSWidth = testCtx.measureText(text).width;
      }
      textWidth = textCSSWidth;
    } else {
      textWidth = cssFontSize * text.length * 0.6;
    }

    // Now convert the calculated CSS font size into our real high-DPI canvas font size
    const finalCanvasFontSize = cssFontSize * dpr;
    actualFontSizeRef.current = cssFontSize; // Save the base size for scaling references

    ctx.font = `italic 900 ${finalCanvasFontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Re-measure with genuine context
    const textCanvasWidth = ctx.measureText(text).width;

    const startX = canvas.width / 2;
    const startY = canvas.height / 2;

    // Create temporary canvas for text pixel analysis at physical DPI
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = textCanvasWidth + 100 * dpr;
    tempCanvas.height = finalCanvasFontSize + 50 * dpr;

    tempCtx.font = ctx.font;
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.textAlign = 'center';
    tempCtx.textBaseline = 'middle';
    tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);

    // Sample pixels to create particles (optimized for performance)
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;

    // Use step = 4 * dpr on mobile to prevent dense over-crowding, 2 * dpr on desktop
    const step = Math.max(1, Math.round((isMobileDevice ? 4 : 2) * dpr));
    for (let y = 0; y < tempCanvas.height; y += step) {
      for (let x = 0; x < tempCanvas.width; x += step) {
        const index = (y * tempCanvas.width + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 128) {
          const particleX = startX + x - tempCanvas.width / 2;
          const particleY = startY + y - tempCanvas.height / 2;
          
          particlesRef.current.push({
            x: particleX + (Math.random() - 0.5) * (isMobileDevice ? 20 * dpr : 60 * dpr),
            y: particleY + (Math.random() - 0.5) * (isMobileDevice ? 20 * dpr : 60 * dpr),
            targetX: particleX,
            targetY: particleY,
            originalX: particleX,
            originalY: particleY,
            vx: 0,
            vy: 0,
            size: particleSize + Math.random() * 1.5,
            opacity: Math.random() * 0.4 + 0.6,
            life: 1
          });
        }
      }
    }

    setPerformance(prev => ({ ...prev, particleCount: particlesRef.current.length }));
  }, [text, particleSize, fontSize, fontFamily]);

  const updateParticle = useCallback((particle: Particle) => {
    const mouse = mouseRef.current;
    const dpr = window.devicePixelRatio || 1;
    
    if (particle.isExplosion) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
      particle.life -= 0.025;
      particle.opacity = Math.max(0, particle.life);
      return;
    }

    // Optimized mouse interaction physics
    const dx = mouse.x - particle.x;
    const dy = mouse.y - particle.y;
    const distanceSquared = dx * dx + dy * dy;
    
    const mouseForceScaled = mouseForce * dpr;
    const mouseForceSquared = mouseForceScaled * mouseForceScaled;

    if (distanceSquared < mouseForceSquared) {
      const distance = Math.sqrt(distanceSquared);
      const force = (mouseForceScaled - distance) / mouseForceScaled;
      const angle = Math.atan2(dy, dx);
      const forceMultiplier = interactionMode === 'attract' ? 1 : -1;
      
      particle.vx += Math.cos(angle) * force * 3 * dpr * forceMultiplier;
      particle.vy += Math.sin(angle) * force * 3 * dpr * forceMultiplier;
    }

    // Return to target position
    const returnForceX = (particle.targetX - particle.x) * 0.04 * animationSpeed * dpr;
    const returnForceY = (particle.targetY - particle.y) * 0.04 * animationSpeed * dpr;

    particle.vx += returnForceX;
    particle.vy += returnForceY;

    // Apply friction
    particle.vx *= 0.94;
    particle.vy *= 0.94;

    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;
  }, [mouseForce, animationSpeed, interactionMode]);

  // Read uniform color parameters safely
  const colorsMemo = useMemo(() => ({
    primaryColor,
    secondaryColor,
    accentColor,
    glowColor,
    coreColor
  }), [primaryColor, secondaryColor, accentColor, glowColor, coreColor]);

  const renderWebGL = useCallback((currentTime: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    const postProgram = postProgramRef.current;
    const canvas = webglCanvasRef.current;
    
    if (!gl || !program || !postProgram || !canvas) return;

    const particles = particlesRef.current;
    if (particles.length === 0) return;

    // PASS 1: Render particles to framebuffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebufferRef.current);
    const dpr = window.devicePixelRatio || 1;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0); // Transparent black back
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    // Set uniforms for particle rendering
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
    const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
    const timeLocation = gl.getUniformLocation(program, 'u_time');

    // Add color uniforms
    const primaryColorLocation = gl.getUniformLocation(program, 'u_primaryColor');
    const secondaryColorLocation = gl.getUniformLocation(program, 'u_secondaryColor');
    const accentColorLocation = gl.getUniformLocation(program, 'u_accentColor');
    const glowColorLocation = gl.getUniformLocation(program, 'u_glowColor');
    const coreColorLocation = gl.getUniformLocation(program, 'u_coreColor');

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform2f(mouseLocation, mouseRef.current.x, mouseRef.current.y);
    gl.uniform1f(timeLocation, currentTime);
    gl.uniform3fv(primaryColorLocation, colorsMemo.primaryColor);
    gl.uniform3fv(secondaryColorLocation, colorsMemo.secondaryColor);
    gl.uniform3fv(accentColorLocation, colorsMemo.accentColor);
    gl.uniform3fv(glowColorLocation, colorsMemo.glowColor);
    gl.uniform3fv(coreColorLocation, colorsMemo.coreColor);

    // Prepare particle data
    const positions = new Float32Array(particles.length * 2);
    const sizes = new Float32Array(particles.length);
    const opacities = new Float32Array(particles.length);

    const isMobileDevice = window.innerWidth < 768;
    const sizeScaleFactor = actualFontSizeRef.current / 100;

    for (let i = 0; i < particles.length; i++) {
      positions[i * 2] = particles[i].x;
      positions[i * 2 + 1] = particles[i].y;
      sizes[i] = particles[i].size * 4 * sizeScaleFactor * dpr; // Scaled nicely to avoid bloated blobs
      opacities[i] = particles[i].opacity;
    }

    // Bind and update buffers
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const sizeLocation = gl.getAttribLocation(program, 'a_size');
    const opacityLocation = gl.getAttribLocation(program, 'a_opacity');

    // Position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.position);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Size buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.size);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(sizeLocation);
    gl.vertexAttribPointer(sizeLocation, 1, gl.FLOAT, false, 0, 0);

    // Opacity buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffersRef.current.opacity);
    gl.bufferData(gl.ARRAY_BUFFER, opacities, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(opacityLocation);
    gl.vertexAttribPointer(opacityLocation, 1, gl.FLOAT, false, 0, 0);

    // Draw particles to framebuffer
    gl.drawArrays(gl.POINTS, 0, particles.length);

    // PASS 2: Post-processing (bloom + film grain)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0); // Keep it alpha transparent
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(postProgram);

    // Create full-screen quad
    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
       1,  1
    ]);

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const postPositionLocation = gl.getAttribLocation(postProgram, 'a_position');
    gl.enableVertexAttribArray(postPositionLocation);
    gl.vertexAttribPointer(postPositionLocation, 2, gl.FLOAT, false, 0, 0);

    // Bind framebuffer texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureRef.current);

    // Set post-processing uniforms
    const textureLocation = gl.getUniformLocation(postProgram, 'u_texture');
    const texelSizeLocation = gl.getUniformLocation(postProgram, 'u_texelSize');
    const postTimeLocation = gl.getUniformLocation(postProgram, 'u_time');
    const postResolutionLocation = gl.getUniformLocation(postProgram, 'u_resolution');

    gl.uniform1i(textureLocation, 0);
    gl.uniform2f(texelSizeLocation, 1.0 / canvas.width, 1.0 / canvas.height);
    gl.uniform1f(postTimeLocation, currentTime);
    gl.uniform2f(postResolutionLocation, canvas.width, canvas.height);

    // Disable blending for post-processing
    gl.disable(gl.BLEND);

    // Draw full-screen quad with post-processing
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Re-enable blending for next frame
    gl.enable(gl.BLEND);

    // Clean up
    gl.deleteBuffer(quadBuffer);
  }, [colorsMemo]);

  const lastTimeRef = useRef<number>(0);

  const animate = useCallback((currentTime: number) => {
    // Calculate FPS
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    const fps = Math.round(1000 / (deltaTime || 16));
    setPerformance(prev => ({ ...prev, fps }));

    // Update particles
    particlesRef.current = particlesRef.current.filter(particle => {
      updateParticle(particle);
      return !particle.isExplosion || particle.life > 0;
    });

    // Render with WebGL
    renderWebGL(currentTime);

    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticle, renderWebGL]);

  const handleCanvasResize = useCallback(() => {
    const canvas = canvasRef.current;
    const webglCanvas = webglCanvasRef.current;
    if (!canvas || !webglCanvas) return;

    const parentNode = webglCanvas.parentElement;
    const w = parentNode ? parentNode.clientWidth : window.innerWidth;
    const h = parentNode ? parentNode.clientHeight : 220;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    webglCanvas.width = w * dpr;
    webglCanvas.height = h * dpr;
    
    // Update WebGL viewport and framebuffer
    const gl = glRef.current;
    if (gl && textureRef.current) {
      gl.viewport(0, 0, webglCanvas.width, webglCanvas.height);
      
      // Resize framebuffer texture
      gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, webglCanvas.width, webglCanvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    
    createParticlesFromText();
  }, [createParticlesFromText]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = webglCanvasRef.current?.getBoundingClientRect();
    if (rect) {
      const dpr = window.devicePixelRatio || 1;
      mouseRef.current.x = (e.clientX - rect.left) * dpr;
      mouseRef.current.y = (e.clientY - rect.top) * dpr;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const rect = webglCanvasRef.current?.getBoundingClientRect();
    if (rect && e.touches.length > 0) {
      const dpr = window.devicePixelRatio || 1;
      const touch = e.touches[0];
      mouseRef.current.x = (touch.clientX - rect.left) * dpr;
      mouseRef.current.y = (touch.clientY - rect.top) * dpr;
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const rect = webglCanvasRef.current?.getBoundingClientRect();
    if (rect && e.touches.length > 0) {
      const dpr = window.devicePixelRatio || 1;
      const touch = e.touches[0];
      mouseRef.current.x = (touch.clientX - rect.left) * dpr;
      mouseRef.current.y = (touch.clientY - rect.top) * dpr;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const mouse = mouseRef.current;
    if (mouse.x === -9999) return;
    const dpr = window.devicePixelRatio || 1;
    
    // Create explosion effect
    const explosionParticles = 60;
    for (let i = 0; i < explosionParticles; i++) {
      const angle = (Math.PI * 2 * i) / explosionParticles;
      const velocity = (2 + Math.random() * 20) * dpr;
      
      particlesRef.current.push({
        x: mouse.x,
        y: mouse.y,
        targetX: mouse.x,
        targetY: mouse.y,
        originalX: mouse.x,
        originalY: mouse.y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: particleSize * 0.4,
        opacity: 1,
        life: 1,
        isExplosion: true
      });
    }

    // Affect nearby particles
    const explosionRadius = 120 * dpr;
    particlesRef.current.forEach(particle => {
      if (particle.isExplosion) return;
      
      const dx = particle.x - mouse.x;
      const dy = particle.y - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < explosionRadius) {
        const force = (explosionRadius - distance) / explosionRadius;
        const angle = Math.atan2(dy, dx);
        particle.vx += Math.cos(angle) * force * 30 * dpr;
        particle.vy += Math.sin(angle) * force * 30 * dpr;
      }
    });
  }, [particleSize]);

  useEffect(() => {
    if (initWebGL()) {
      handleCanvasResize();
      window.addEventListener('resize', handleCanvasResize);
      
      return () => {
        window.removeEventListener('resize', handleCanvasResize);
      };
    } else {
      setWebglFailed(true);
    }
  }, [initWebGL, handleCanvasResize]);

  useEffect(() => {
    if (!isMobileDevice && !webglFailed) {
      createParticlesFromText();
    }
  }, [createParticlesFromText, isMobileDevice, webglFailed]);

  useEffect(() => {
    if (!isMobileDevice && !webglFailed) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, isMobileDevice, webglFailed]);

  if (isMobileDevice || webglFailed) {
    return (
      <div className={`flex items-center justify-center w-full min-h-[50px] md:min-h-[80px] py-1 select-none ${className}`}>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-sans font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-500 to-primary drop-shadow-[0_0_15px_rgba(255,40,0,0.25)]">
          {text}
        </h1>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[150px] md:h-[220px] overflow-hidden ${className}`}>
      {/* Hidden canvas for text rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
      />
      
      {/* WebGL canvas for particle rendering */}
      <canvas
        ref={webglCanvasRef}
        className="particle-canvas absolute inset-0 w-full h-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      />
    </div>
  );
};
