import React, { useEffect, useRef } from 'react';

interface TextOptions {
  size?: number;
  copy?: string;
  color?: string;
  delay?: number;
  font?: string;
}

class Text {
  size: number;
  copy: string;
  color: string;
  delay: number;
  basedelay: number;
  bound: TextMetrics & { height: number };
  x: number;
  y: number;
  data: ImageData;
  index: number;

  constructor(options: TextOptions = {}, canvasWidth: number, canvasHeight: number) {
    const pool = document.createElement('canvas');
    const buffer = pool.getContext('2d');
    if (!buffer) {
      throw new Error('Could not create 2D buffer context');
    }
    pool.width = canvasWidth;
    pool.height = canvasHeight;
    buffer.fillStyle = '#000000';
    buffer.fillRect(0, 0, pool.width, pool.height);

    this.size = options.size || 60;
    this.copy = (options.copy || `NOSSO AMANHÃ`) + ' ';
    this.color = options.color || '#ff4c2b';
    this.delay = options.delay || 2;
    this.basedelay = this.delay;
    
    buffer.font = options.font || `italic 900 ${this.size}px Inter, "Space Grotesk", sans-serif`;
    const metrics = buffer.measureText(this.copy);
    this.bound = Object.assign(metrics, { height: this.size * 1.5 });
    
    this.x = canvasWidth * 0.5 - this.bound.width * 0.5;
    this.y = canvasHeight * 0.5 - this.bound.height * 0.5;

    buffer.strokeStyle = this.color;
    buffer.lineWidth = 2;
    buffer.strokeText(this.copy, 0, this.bound.height * 0.82);
    this.data = buffer.getImageData(0, 0, this.bound.width, this.bound.height);
    this.index = 0;
  }

  update(
    thunder: Thunder[], 
    particles: Particles[], 
    options: { thunderColor?: string; thunderGlow?: string; sparkColor?: string } = {}
  ) {
    if (this.index >= this.bound.width) {
      this.index = 0;
      return;
    }
    
    const data = this.data.data;
    for (let i = this.index * 4; i < data.length; i += 4 * this.data.width) {
      const bitmap = data[i] + data[i + 1] + data[i + 2] + data[i + 3];
      if (bitmap > 255 && Math.random() > 0.94) {
        const x = this.x + this.index;
        const y = this.y + i / this.bound.width / 4;
        thunder.push(new Thunder({ 
          x, 
          y, 
          color: options.thunderColor || '#ffffff', 
          glow: options.thunderGlow || '#ff2800' 
        }));
        
        if (Math.random() > 0.3) {
          particles.push(new Particles({ 
            x, 
            y, 
            color: options.sparkColor || '#ff4c2b' 
          }));
        }
      }
    }
    
    if (this.delay-- < 0) {
      this.index += 2;
      this.delay += this.basedelay;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.data, this.x, this.y, 0, 0, this.index, this.bound.height);
  }
}

interface ThunderOptions {
  lifespan?: number;
  color?: string;
  glow?: string;
  x?: number;
  y?: number;
  width?: number;
  direct?: number;
  max?: number;
}

interface Segment {
  direct: number;
  length: number;
  change: number;
}

class Thunder {
  lifespan: number;
  maxlife: number;
  color: string;
  glow: string;
  x: number;
  y: number;
  width: number;
  direct: number;
  max: number;
  segments: Segment[];

  constructor(options: ThunderOptions = {}) {
    this.lifespan = options.lifespan || Math.round(Math.random() * 10 + 10);
    this.maxlife = this.lifespan;
    this.color = options.color || '#ffffff';
    this.glow = options.glow || '#ff2800';
    this.x = options.x !== undefined ? options.x : Math.random() * window.innerWidth;
    this.y = options.y !== undefined ? options.y : Math.random() * window.innerHeight;
    this.width = options.width || 2;
    this.direct = options.direct !== undefined ? options.direct : Math.random() * Math.PI * 2;
    this.max = options.max || Math.round(Math.random() * 8 + 12);
    this.segments = [...new Array(this.max)].map(() => ({
      direct: this.direct + (Math.PI * Math.random() * 0.2 - 0.1),
      length: Math.random() * 15 + 40,
      change: Math.random() * 0.04 - 0.02
    }));
  }

  update(index: number, array: Thunder[]) {
    this.segments.forEach(s => {
      s.direct += s.change;
      if (Math.random() > 0.96) s.change *= -1;
    });
    if (this.lifespan > 0) {
      this.lifespan--;
    } else {
      this.remove(index, array);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.lifespan <= 0) return;
    
    ctx.save();
    ctx.beginPath();
    ctx.globalAlpha = this.lifespan / this.maxlife;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.shadowBlur = 24;
    ctx.shadowColor = this.glow;
    ctx.moveTo(this.x, this.y);
    
    let prev = { x: this.x, y: this.y };
    this.segments.forEach(s => {
      const x = prev.x + Math.cos(s.direct) * s.length;
      const y = prev.y + Math.sin(s.direct) * s.length;
      prev = { x, y };
      ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
    
    const strength = Math.random() * 60 + 30;
    const light = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, strength);
    light.addColorStop(0, 'rgba(255, 76, 43, 0.4)');
    light.addColorStop(0.2, 'rgba(255, 76, 43, 0.1)');
    light.addColorStop(0.5, 'rgba(255, 76, 43, 0.02)');
    light.addColorStop(0.8, 'rgba(255, 76, 43, 0)');
    
    ctx.beginPath();
    ctx.fillStyle = light;
    ctx.arc(this.x, this.y, strength, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  remove(index: number, array: Thunder[]) {
    array.splice(index, 1);
  }
}

interface SparkOptions {
  x?: number;
  y?: number;
  v?: { direct: number; weight: number; friction: number };
  a?: { change: number; min: number; max: number };
  g?: { direct: number; weight: number };
  width?: number;
  lifespan?: number;
  color?: string;
}

class Spark {
  x: number;
  y: number;
  v: { direct: number; weight: number; friction: number };
  a: { change: number; min: number; max: number };
  g: { direct: number; weight: number };
  width: number;
  lifespan: number;
  maxlife: number;
  color: string;
  prev: { x: number; y: number };

  constructor(options: SparkOptions = {}) {
    this.x = options.x !== undefined ? options.x : window.innerWidth * 0.5;
    this.y = options.y !== undefined ? options.y : window.innerHeight * 0.5;
    this.v = options.v || {
      direct: Math.random() * Math.PI * 2,
      weight: Math.random() * 8 + 2,
      friction: 0.90
    };
    this.a = options.a || {
      change: Math.random() * 0.4 - 0.2,
      min: this.v.direct - Math.PI * 0.4,
      max: this.v.direct + Math.PI * 0.4
    };
    this.g = options.g || {
      direct: Math.PI * 0.5 + (Math.random() * 0.4 - 0.2),
      weight: Math.random() * 0.2 + 0.1
    };
    this.width = options.width || Math.random() * 2 + 0.5;
    this.lifespan = options.lifespan || Math.round(Math.random() * 15 + 25);
    this.maxlife = this.lifespan;
    this.color = options.color || '#ff4c2b';
    this.prev = { x: this.x, y: this.y };
  }

  update(index: number, array: Spark[]) {
    this.prev = { x: this.x, y: this.y };
    this.x += Math.cos(this.v.direct) * this.v.weight;
    this.x += Math.cos(this.g.direct) * this.g.weight;
    this.y += Math.sin(this.v.direct) * this.v.weight;
    this.y += Math.sin(this.g.direct) * this.g.weight;
    
    if (this.v.weight > 0.2) {
      this.v.weight *= this.v.friction;
    }
    
    this.v.direct += this.a.change;
    if (this.v.direct > this.a.max || this.v.direct < this.a.min) {
      this.a.change *= -1;
    }
    
    if (this.lifespan > 0) {
      this.lifespan--;
    } else {
      this.remove(index, array);
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.lifespan <= 0) return;
    
    ctx.beginPath();
    ctx.globalAlpha = this.lifespan / this.maxlife;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.width;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.prev.x, this.prev.y);
    ctx.stroke();
    ctx.closePath();
  }

  remove(index: number, array: Spark[]) {
    array.splice(index, 1);
  }
}

class Particles {
  max: number;
  sparks: Spark[];

  constructor(options: SparkOptions = {}) {
    this.max = Math.round(Math.random() * 8 + 6);
    this.sparks = [...new Array(this.max)].map(() => new Spark(options));
  }

  update() {
    this.sparks.forEach((s, i) => s.update(i, this.sparks));
  }

  render(ctx: CanvasRenderingContext2D) {
    this.sparks.forEach(s => s.render(ctx));
  }
}

interface LightningTextProps {
  text?: string;
  size?: number;
  textColor?: string;
  thunderColor?: string;
  thunderGlow?: string;
  sparkColor?: string;
  className?: string;
  height?: number;
}

const LightningText: React.FC<LightningTextProps> = ({
  text = 'NOSSO AMANHÃ',
  size = 64,
  textColor = '#ff4c2b',
  thunderColor = '#ffffff',
  thunderGlow = '#ff2800',
  sparkColor = '#ff4c2b',
  className = '',
  height = 180
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const thunderRef = useRef<Thunder[]>([]);
  const particlesRef = useRef<Particles[]>([]);
  const textRef = useRef<Text | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = height;
      
      canvas.width = w;
      canvas.height = h;
      
      const adjustedSize = Math.max(28, Math.min(size, w / 11));

      textRef.current = new Text({ 
        copy: text,
        size: adjustedSize,
        color: textColor,
        font: `italic 900 ${adjustedSize}px Inter, "Outfit", sans-serif`
      }, w, h);
    };

    resizeCanvas();

    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      // Update
      if (textRef.current) {
        textRef.current.update(thunderRef.current, particlesRef.current, {
          thunderColor,
          thunderGlow,
          sparkColor
        });
      }
      
      thunderRef.current.forEach((l, i) => l.update(i, thunderRef.current));
      particlesRef.current.forEach(p => p.update());
      
      // Render
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#050202'; // Ultra dark red-black corresponding to design
      ctx.fillRect(0, 0, w, h);
      
      ctx.globalCompositeOperation = 'screen';
      if (textRef.current) {
        textRef.current.render(ctx);
      }
      thunderRef.current.forEach(l => l.render(ctx));
      particlesRef.current.forEach(p => p.render(ctx));
      
      animationRef.current = requestAnimationFrame(loop);
    };

    loop();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [text, size, textColor, thunderColor, thunderGlow, sparkColor, height]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      thunderRef.current.push(new Thunder({ x, y, color: thunderColor, glow: thunderGlow }));
      particlesRef.current.push(new Particles({ x, y, color: sparkColor }));
    }
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl ${className}`} style={{ height }}>
      <canvas 
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="block w-full h-full cursor-crosshair"
      />
    </div>
  );
};

export default LightningText;
