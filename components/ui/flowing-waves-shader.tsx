import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface InteractiveWaveShaderProps {
  colorMode?: 'red' | 'blue' | 'green' | 'neutral';
  disableDimming?: boolean;
}

const InteractiveWaveShader = ({ colorMode = 'red', disableDimming = true }: InteractiveWaveShaderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1) Renderer + Scene + Camera + Clock
    let renderer: THREE.WebGLRenderer;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
      renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.error('WebGL not supported', err);
      container.innerHTML = '<p style="color:white;text-align:center;">Sorry, WebGL isn’t available.</p>';
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const clock = new THREE.Clock();

    // 2) Shaders
    const vertexShader = `
      varying vec2 vTextureCoord;
      void main() {
        vTextureCoord = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform int colorMode; // 0: neutral, 1: red, 2: blue, 3: green
      uniform bool disableCenterDimming;
      uniform bool isMobile;
      varying vec2 vTextureCoord;

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
        vec2 uv = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

        // Center dimming logic
        vec2 center = iResolution.xy * 0.5;
        float dist = distance(fragCoord, center);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        float centerDim = disableCenterDimming ? 1.0 : smoothstep(radius * 0.3, radius * 0.5, dist);

        // Wave logic - Reduced iterations on mobile
        float iterations = isMobile ? 5.0 : 10.0;
        for(float i = 1.0; i < 10.0; i++){
          if (isMobile && i >= 6.0) break;
          uv.x += 0.6 / i * cos(i * 2.5 * uv.y + iTime * 0.5);
          uv.y += 0.6 / i * cos(i * 1.5 * uv.x + iTime * 0.5);
        }
        
        vec3 baseColor;
        if (colorMode == 1) { // Red - Vibrant
          baseColor = vec3(0.8, 0.05, 0.05);
        } else if (colorMode == 2) { // Blue
          baseColor = vec3(0.1, 0.3, 0.6);
        } else if (colorMode == 3) { // Green
          baseColor = vec3(0.1, 0.5, 0.2);
        } else { // Neutral
          baseColor = vec3(0.1, 0.1, 0.1);
        }

        // Plasma effect - high contrast
        float sinVal = sin(iTime * 0.8 - uv.y * 2.0 - uv.x * 2.0);
        float intensity = 0.08 / (abs(sinVal) + 0.005);
        intensity = pow(intensity, 1.4); 
        
        // Vibrant red output
        vec3 finalColor = baseColor * intensity * 2.0;
        fragColor = vec4(finalColor, min(intensity, 1.0));
        
        // Sharp white glow
        float highlights = smoothstep(0.9, 1.0, intensity * 0.15);
        fragColor.rgb += vec3(highlights * 0.8);
        fragColor.a += highlights * 0.5;
        
        if (!disableCenterDimming) {
          fragColor.rgb = mix(fragColor.rgb * 0.3, fragColor.rgb, centerDim);
        }
      }

      void main() {
        vec4 color;
        mainImage(color, vTextureCoord * iResolution);
        gl_FragColor = color;
      }
    `;

    // 3) Material, Geometry, Mesh
    const modeMap = { neutral: 0, red: 1, blue: 2, green: 3 };
    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      iMouse: { value: new THREE.Vector2() },
      colorMode: { value: modeMap[colorMode] },
      disableCenterDimming: { value: disableDimming },
      isMobile: { value: isMobile }
    };

    const material = new THREE.ShaderMaterial({ 
      vertexShader, 
      fragmentShader, 
      uniforms,
      transparent: true,
      blending: THREE.AdditiveBlending 
    });
    materialRef.current = material;
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // 4) Resize and Mouse Move Handlers
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      renderer.setPixelRatio(isMobile ? Math.max(dpr, 1.5) : Math.min(dpr, 2));
      renderer.setSize(w, h);
      uniforms.iResolution.value.set(w, h);
    };
    
    const onMouseMove = (event: MouseEvent) => {
      uniforms.iMouse.value.set(event.clientX, event.clientY);
    };

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    onResize();

    // 5) Animation Loop
    renderer.setAnimationLoop(() => {
      uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    });

    // 6) Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      renderer.setAnimationLoop(null);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    };
  }, [colorMode, disableDimming]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none"
      aria-label="Interactive wave animation"
    />
  );
};

export default InteractiveWaveShader;
