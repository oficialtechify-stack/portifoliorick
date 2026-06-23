import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export const Hero3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2.5;
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // CUSTOM SHADER MATERIAL
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        vPosition = position;
        
        // Displace vertices for organic feel
        vec3 pos = position;
        pos.x += sin(pos.y * 3.0 + uTime * 0.5) * 0.1;
        pos.y += cos(pos.x * 2.0 + uTime * 0.4) * 0.1;
        pos.z += sin(pos.z * 4.0 + uTime * 0.6) * 0.1;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      uniform float uTime;
      uniform vec3 uColor;

      void main() {
        // Fresnel effect
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - dot(vNormal, viewDirection), 3.0);
        
        // Neon glow based on time and position
        float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
        vec3 glow = (uColor * 1.2) * fresnel * (0.8 + pulse * 0.2);
        
        // Subtle scanlines or wireframe hint
        float scanline = sin(vUv.y * 100.0 + uTime) * 0.05;
        
        gl_FragColor = vec4(glow + scanline, fresnel * 0.9);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#FF2800') },
      },
      transparent: true,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    materialRef.current = material;

    // GEOMETRY
    const geometry = new THREE.IcosahedronGeometry(1.2, 32);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // ANIMATION
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !materialRef.current) return;
      
      const time = performance.now() * 0.001;
      materialRef.current.uniforms.uTime.value = time;
      
      if (meshRef.current) {
        meshRef.current.rotation.y = time * 0.2;
        meshRef.current.rotation.x = time * 0.15;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestAnimationFrame(animate);
    };
    animate();

    // GSAP MOUSE INTERACTION
    const onMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      if (meshRef.current) {
        gsap.to(meshRef.current.position, {
          x: mouseX * 0.5,
          y: mouseY * 0.5,
          duration: 1.5,
          ease: 'power2.out'
        });
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    // RESIZE
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none opacity-100"
    />
  );
};
