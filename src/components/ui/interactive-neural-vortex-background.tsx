import React, { useEffect, useRef } from 'react';

interface InteractiveNeuralVortexProps {
  /**
   * Optional custom color for the shader (RGB normalization 0-1)
   * Default is a vibrant red
   */
  primaryColor?: [number, number, number];
}

const InteractiveNeuralVortex: React.FC<InteractiveNeuralVortexProps> = ({ 
  primaryColor = [0.95, 0.05, 0.1]
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const gl = canvasEl.getContext('webgl') || canvasEl.getContext('experimental-webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    const vsSource = `
      precision mediump float;
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform float u_scroll_progress;
      uniform vec3 u_primary_color;
      
      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }
      
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2);
        }
        return res.x + res.y;
      }
      
      void main() {
        vec2 uv = .5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0., 1.);
        p = .5 * pow(1. - p, 2.);
        float t = .001 * u_time;
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.);
        noise += pow(noise, 10.);
        noise = max(.0, noise - .5);
        noise *= (1. - length(vUv - .5));
        
        vec3 color = u_primary_color;
        // Add some dynamic variation based on scroll and time
        color = mix(color, vec3(1.0, 0.2, 0.0), 0.2 * sin(u_time * 0.001 + u_scroll_progress));
        
        color = color * noise;
        gl_FragColor = vec4(color, noise);
      }
    `;

    const compileShader = (gl: WebGLRenderingContext, source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl as WebGLRenderingContext, vsSource, (gl as WebGLRenderingContext).VERTEX_SHADER);
    const fragmentShader = compileShader(gl as WebGLRenderingContext, fsSource, (gl as WebGLRenderingContext).FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    const program = (gl as WebGLRenderingContext).createProgram();
    if (!program) return;
    (gl as WebGLRenderingContext).attachShader(program, vertexShader);
    (gl as WebGLRenderingContext).attachShader(program, fragmentShader);
    (gl as WebGLRenderingContext).linkProgram(program);
    if (!(gl as WebGLRenderingContext).getProgramParameter(program, (gl as WebGLRenderingContext).LINK_STATUS)) {
      console.error('Program link error:', (gl as WebGLRenderingContext).getProgramInfoLog(program));
      return;
    }
    (gl as WebGLRenderingContext).useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = (gl as WebGLRenderingContext).createBuffer();
    (gl as WebGLRenderingContext).bindBuffer((gl as WebGLRenderingContext).ARRAY_BUFFER, vertexBuffer);
    (gl as WebGLRenderingContext).bufferData((gl as WebGLRenderingContext).ARRAY_BUFFER, vertices, (gl as WebGLRenderingContext).STATIC_DRAW);

    const positionLocation = (gl as WebGLRenderingContext).getAttribLocation(program, 'a_position');
    (gl as WebGLRenderingContext).enableVertexAttribArray(positionLocation);
    (gl as WebGLRenderingContext).vertexAttribPointer(positionLocation, 2, (gl as WebGLRenderingContext).FLOAT, false, 0, 0);

    const uTime = (gl as WebGLRenderingContext).getUniformLocation(program, 'u_time');
    const uRatio = (gl as WebGLRenderingContext).getUniformLocation(program, 'u_ratio');
    const uPointerPosition = (gl as WebGLRenderingContext).getUniformLocation(program, 'u_pointer_position');
    const uScrollProgress = (gl as WebGLRenderingContext).getUniformLocation(program, 'u_scroll_progress');
    const uPrimaryColor = (gl as WebGLRenderingContext).getUniformLocation(program, 'u_primary_color');

    const resizeCanvas = () => {
      const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
      canvasEl.width = window.innerWidth * devicePixelRatio;
      canvasEl.height = window.innerHeight * devicePixelRatio;
      (gl as WebGLRenderingContext).viewport(0, 0, canvasEl.width, canvasEl.height);
      (gl as WebGLRenderingContext).uniform1f(uRatio, canvasEl.width / canvasEl.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const currentTime = performance.now();
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.2;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.2;
      
      (gl as WebGLRenderingContext).uniform1f(uTime, currentTime);
      (gl as WebGLRenderingContext).uniform2f(uPointerPosition, 
        pointer.current.x / window.innerWidth, 
        1 - pointer.current.y / window.innerHeight
      );
      (gl as WebGLRenderingContext).uniform1f(uScrollProgress, window.pageYOffset / (2 * window.innerHeight));
      (gl as WebGLRenderingContext).uniform3f(uPrimaryColor, primaryColor[0], primaryColor[1], primaryColor[2]);
      
      (gl as WebGLRenderingContext).drawArrays((gl as WebGLRenderingContext).TRIANGLE_STRIP, 0, 4);
      animationRef.current = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      pointer.current.tX = e.clientX;
      pointer.current.tY = e.clientY;
    };

    window.addEventListener('pointermove', handleMouseMove as any);
    window.addEventListener('touchmove', ((e: TouchEvent) => {
      if (e.touches[0]) {
        pointer.current.tX = e.touches[0].clientX;
        pointer.current.tY = e.touches[0].clientY;
      }
    }) as any);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('pointermove', handleMouseMove as any);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      (gl as WebGLRenderingContext).deleteProgram(program);
      (gl as WebGLRenderingContext).deleteShader(vertexShader);
      (gl as WebGLRenderingContext).deleteShader(fragmentShader);
    };
  }, [primaryColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

export default InteractiveNeuralVortex;
