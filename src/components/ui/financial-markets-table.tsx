"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

export interface TechifyCountryMarket {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  growthYtd: number; // YTD Growth %
  activeProjects: number; // Active custom sites & systems
  clientSatisfaction: number; // Client rating or satisfaction index
  totalBilling: number; // Lifetime total billing (in Millions)
  volume: number; // Active site traffic / API requests index
  chartData: number[]; // Trend line data points
  monthlyRevenue: number; // Active Monthly Recurring Revenue (MRR)
  monthlyChange: number; // Change of the month in value
  monthlyChangePercent: number; // Change of the month in %
}

interface FinancialTableProps {
  title?: string;
  indices?: TechifyCountryMarket[];
  onIndexSelect?: (id: string) => void;
  className?: string;
}

const defaultMarkets: TechifyCountryMarket[] = [
  {
    id: "1",
    name: "Techify North America",
    country: "United States",
    countryCode: "US",
    growthYtd: 28.40,
    activeProjects: 18,
    clientSatisfaction: 99.12,
    totalBilling: 0.62, // $620K
    volume: 22.4, // 22.4k requests
    chartData: [15.2, 15.6, 16.0, 16.5, 17.0, 16.8, 17.2, 17.8, 18.1, 18.4],
    monthlyRevenue: 18400, // $18,400 MRR
    monthlyChange: 820,
    monthlyChangePercent: 4.66
  },
  {
    id: "2",
    name: "Techify Latin America",
    country: "Brazil",
    countryCode: "BR",
    growthYtd: 44.50,
    activeProjects: 32,
    clientSatisfaction: 98.80,
    totalBilling: 0.42, // $420K
    volume: 41.2,
    chartData: [8.5, 9.0, 9.2, 9.1, 9.5, 9.8, 10.2, 10.5, 10.8, 11.2],
    monthlyRevenue: 11200, // $11,200 MRR
    monthlyChange: 1150,
    monthlyChangePercent: 11.44
  },
  {
    id: "3",
    name: "Techify UK & IE",
    country: "United Kingdom",
    countryCode: "GB",
    growthYtd: 19.80,
    activeProjects: 7,
    clientSatisfaction: 98.50,
    totalBilling: 0.21, // $210K
    volume: 12.8,
    chartData: [5.8, 5.9, 6.1, 6.2, 6.3, 6.4, 6.6, 6.8, 7.0, 7.2],
    monthlyRevenue: 7200, // $7,200 MRR
    monthlyChange: 450,
    monthlyChangePercent: 6.67
  },
  {
    id: "4",
    name: "Techify Europe mainland",
    country: "Portugal",
    countryCode: "PT",
    growthYtd: 32.10,
    activeProjects: 6,
    clientSatisfaction: 98.20,
    totalBilling: 0.14, // $140K
    volume: 9.2,
    chartData: [3.6, 3.8, 3.9, 4.0, 4.1, 4.0, 4.2, 4.3, 4.4, 4.5],
    monthlyRevenue: 4500, // $4,500 MRR
    monthlyChange: 280,
    monthlyChangePercent: 6.64
  },
  {
    id: "5",
    name: "Techify Canada",
    country: "Canada",
    countryCode: "CA",
    growthYtd: 15.60,
    activeProjects: 5,
    clientSatisfaction: 97.40,
    totalBilling: 0.12, // $120K
    volume: 8.4,
    chartData: [4.4, 4.5, 4.6, 4.7, 4.8, 4.7, 4.9, 5.0, 5.1, 5.2],
    monthlyRevenue: 5200, // $5,200 MRR
    monthlyChange: 180,
    monthlyChangePercent: 3.58
  },
  {
    id: "6",
    name: "Techify LATAM North",
    country: "Mexico",
    countryCode: "MX",
    growthYtd: 26.40,
    activeProjects: 9,
    clientSatisfaction: 98.00,
    totalBilling: 0.18, // $180K
    volume: 14.2,
    chartData: [4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.7, 4.8, 4.9],
    monthlyRevenue: 4900, // $4,900 MRR
    monthlyChange: 220,
    monthlyChangePercent: 4.70
  }
];

export function FinancialTable({
  title = "Sede / Operação",
  indices: initialIndices = defaultMarkets,
  onIndexSelect,
  className = ""
}: FinancialTableProps = {}) {
  const [indices, setIndices] = useState<TechifyCountryMarket[]>(initialIndices);
  const [selectedIndex, setSelectedIndex] = useState<string | null>("1");
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { theme } = useTheme();
  
  // High contrast fallback matching rickzinxx primary color scheme (#ff2800)
  const isDark = true; 

  useEffect(() => {
    setMounted(true);
    setIndices(initialIndices);
  }, [initialIndices]);

  const handleIndexSelect = (indexId: string) => {
    setSelectedIndex(indexId);
    if (onIndexSelect) {
      onIndexSelect(indexId);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatLargeNumber = (amount: number, unit: string) => {
    return `$${amount.toFixed(2)}${unit}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
  };

  const getPerformanceColor = (value: number) => {
    const isPositive = value >= 0;
    const color = isPositive ? "#ff2800" : "#ef4444";
    const bgColor = isPositive ? "bg-primary/10" : "bg-red-500/10";
    const borderColor = isPositive ? "border-primary/30" : "border-red-500/30";
    const textColor = isPositive ? "text-primary" : "text-red-400";
    
    return { color, bgColor, borderColor, textColor };
  };

  const getCountryFlag = (countryCode: string) => {
    switch (countryCode) {
      case "US":
        return (
          <svg width="32" height="32" viewBox="0 0 130 120" fill="none" className="scale-125">
            <rect y="0" fill="#DC4437" width="130" height="13.3"/>
            <rect y="26.7" fill="#DC4437" width="130" height="13.3"/>
            <rect y="80" fill="#DC4437" width="130" height="13.3"/>
            <rect y="106.7" fill="#DC4437" width="130" height="13.3"/>
            <rect y="53.3" fill="#DC4437" width="130" height="13.3"/>
            <rect y="13.3" fill="#FFFFFF" width="130" height="13.3"/>
            <rect y="40" fill="#FFFFFF" width="130" height="13.3"/>
            <rect y="93.3" fill="#FFFFFF" width="130" height="13.3"/>
            <rect y="66.7" fill="#FFFFFF" width="130" height="13.3"/>
            <rect y="0" fill="#2A66B7" width="70" height="66.7"/>
            <polygon fill="#FFFFFF" points="13.5,4 15.8,8.9 21,9.7 17.2,13.6 18.1,19 13.5,16.4 8.9,19 9.8,13.6 6,9.7 11.2,8.9"/>
            <polygon fill="#FFFFFF" points="34,4 36.3,8.9 41.5,9.7 37.8,13.6 38.6,19 34,16.4 29.4,19 30.2,13.6 26.5,9.7 31.7,8.9"/>
            <polygon fill="#FFFFFF" points="54.5,4 56.8,8.9 62,9.7 58.2,13.6 59.1,19 54.5,16.4 49.9,19 50.8,13.6 47,9.7 52.2,8.9"/>
            <polygon fill="#FFFFFF" points="24,24 26.3,28.9 31.5,29.7 27.8,33.6 28.6,39 24,36.4 19.4,39 20.2,33.6 16.5,29.7 21.7,28.9"/>
            <polygon fill="#FFFFFF" points="44.5,24 46.8,28.9 52,29.7 48.2,33.6 49.1,39 44.5,36.4 39.9,39 40.8,33.6 37,29.7 42.2,28.9"/>
            <polygon fill="#FFFFFF" points="13.5,45.2 15.8,50.1 21,50.9 17.2,54.7 18.1,60.2 13.5,57.6 8.9,60.2 9.8,54.7 6,50.9 11.2,50.1"/>
            <polygon fill="#FFFFFF" points="34,45.2 36.3,50.1 41.5,50.9 37.8,54.7 38.6,60.2 34,57.6 29.4,60.2 30.2,54.7 26.5,50.9 31.7,50.1"/>
            <polygon fill="#FFFFFF" points="54.5,45.2 56.8,50.1 62,50.9 58.2,54.7 59.1,60.2 54.5,57.6 49.9,60.2 50.8,54.7 47,50.9 52.2,50.1"/>
          </svg>
        );
      case "CA":
        return (
          <svg width="32" height="32" viewBox="0 0 90 60" fill="none" className="scale-150">
            <rect width="90" height="60" fill="#FF0000"/>
            <rect x="30" width="30" height="60" fill="#FFFFFF"/>
            <polygon fill="#FF0000" points="45,15 50,20 45,25 40,20"/>
            <polygon fill="#FF0000" points="45,35 50,40 45,45 40,40"/>
          </svg>
        );
      case "MX":
        return (
          <svg width="32" height="32" viewBox="0 0 90 60" fill="none" className="scale-150">
            <rect width="30" height="60" fill="#006847"/>
            <rect x="30" width="30" height="60" fill="#FFFFFF"/>
            <rect x="60" width="30" height="60" fill="#CE1126"/>
          </svg>
        );
      case "BR":
        return (
          <svg width="32" height="32" viewBox="0 0 90 60" fill="none" className="scale-150">
            <rect width="90" height="60" fill="#009639"/>
            <polygon fill="#FEDD00" points="45,30 20,15 20,45"/>
            <circle cx="45" cy="30" r="8" fill="#002776"/>
          </svg>
        );
      case "GB":
        return (
          <svg width="32" height="32" viewBox="0 0 60 30" fill="none" className="scale-150">
            <rect width="60" height="30" fill="#00247D"/>
            <path d="M0,0 L60,30 M0,30 L60,0" stroke="#FFFFFF" strokeWidth="6"/>
            <path d="M0,0 L60,30 M0,30 L60,0" stroke="#CF142B" strokeWidth="4"/>
            <path d="M30,0 L30,30 M0,15 L60,15" stroke="#FFFFFF" strokeWidth="10"/>
            <path d="M30,0 L30,30 M0,15 L60,15" stroke="#CF142B" strokeWidth="6"/>
          </svg>
        );
      case "PT":
        return (
          <svg width="32" height="32" viewBox="0 0 60 40" fill="none" className="scale-150">
            <rect width="24" height="40" fill="#006600"/>
            <rect x="24" width="36" height="40" fill="#FF0000"/>
            <circle cx="24" cy="20" r="7" fill="#FEDD00"/>
            <rect x="22" y="17" width="4" height="6" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5"/>
          </svg>
        );
      default:
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="scale-125">
            <rect width="32" height="32" fill="#1f1f23" rx="4" stroke="#ffffff/10" strokeWidth="1"/>
            <text x="16" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ff2800">🌐</text>
          </svg>
        );
    }
  };

  const renderSparkline = (data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const createPath = (dataPoints: number[]) => {
      return dataPoints.map((value, index) => {
        const x = (index / (dataPoints.length - 1)) * 60;
        const y = 20 - ((value - min) / range) * 15;
        return `${x},${y}`;
      }).join(' ');
    };

    const fullPath = createPath(data);

    return (
      <div className="w-16 h-6">
        <motion.svg 
          width="60" 
          height="20" 
          viewBox="0 0 60 20" 
          className="overflow-visible"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 25,
            duration: shouldReduceMotion ? 0.2 : 0.5
          }}
        >
          {fullPath && (
            <motion.polyline
              points={fullPath}
              fill="none"
              stroke="#ff2800"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: shouldReduceMotion ? 0.3 : 0.8,
                ease: "easeOut",
                delay: 0.2
              }}
            />
          )}
        </motion.svg>
      </div>
    );
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    }
  };

  const rowVariants: any = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98,
      filter: "blur(4px)" 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.7,
      },
    },
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      {/* Mobile view -- Card list (only visible on mobile screens) */}
      <div className="md:hidden flex flex-col gap-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4"
        >
          {indices.map((index, indexNum) => {
            const { bgColor, borderColor, textColor } = getPerformanceColor(index.monthlyChangePercent);
            const ytdStyle = getPerformanceColor(index.growthYtd);
            return (
              <motion.div
                key={index.id}
                variants={rowVariants}
                onClick={() => handleIndexSelect(index.id)}
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                  selectedIndex === index.id
                    ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20"
                    : "bg-black/40 border-white/5 active:bg-white/[0.02]"
                }`}
              >
                {/* Background light gradient glow for active card */}
                {selectedIndex === index.id && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-xl rounded-full pointer-events-none" />
                )}

                {/* Card Header: Flag & Name */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900 shrink-0">
                      <div className="w-full h-full flex items-center justify-center scale-90">
                        {getCountryFlag(index.countryCode)}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-xs tracking-wider uppercase truncate max-w-[170px]">
                        {index.name}
                      </h5>
                      <p className="text-[9px] font-black text-white/30 tracking-widest uppercase">
                        {index.country}
                      </p>
                    </div>
                  </div>
                  
                  {/* YTD Growth badge */}
                  <div className={`px-2 py-0.5 rounded-md text-[9px] font-black font-mono border ${ytdStyle.bgColor} ${ytdStyle.borderColor} ${ytdStyle.textColor}`}>
                    YTD {formatPercentage(index.growthYtd)}
                  </div>
                </div>

                {/* Card Body: Principal values */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                  <div>
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block mb-0.5">Mensal (MRR)</span>
                    <span className="font-black text-white text-sm font-mono block">
                      {formatCurrency(index.monthlyRevenue)}
                    </span>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[8px] font-black text-white/40 uppercase tracking-widest block mb-0.5">Variação Mensal</span>
                    <div className="flex items-center justify-end gap-1.5">
                      <span className={`font-bold text-xs font-mono ${getPerformanceColor(index.monthlyChange).textColor}`}>
                        {index.monthlyChange >= 0 ? "+" : ""}{formatCurrency(index.monthlyChange)}
                      </span>
                      <span className={`px-1 py-0.5 rounded text-[8px] font-black font-mono border ${bgColor} ${borderColor} ${textColor}`}>
                        {formatPercentage(index.monthlyChangePercent)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secondary details row */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5">
                  <div>
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block">Projetos</span>
                    <span className="font-black text-white/90 text-xs font-mono">{index.activeProjects}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block">Satisfação</span>
                    <span className="font-black text-primary text-xs font-mono">{index.clientSatisfaction.toFixed(1)}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest block">Decorrente</span>
                    <span className="font-bold text-white/80 text-xs font-mono">{formatLargeNumber(index.totalBilling, "M")}</span>
                  </div>
                </div>

                {/* Sparkline overlay/bottom indicator for a cool background trace vibe */}
                <div className="absolute right-4 top-5 opacity-40">
                  {renderSparkline(index.chartData)}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Desktop view -- Table Container with horizontal scroll (hidden on mobile) */}
      <div className="hidden md:block bg-black/50 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-2xl">
        <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[1050px]">
            {/* Table Headers */}
            <div 
              className="px-8 py-4 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] bg-zinc-950/80 border-b border-white/5 text-left"
              style={{
                display: 'grid',
                gridTemplateColumns: '260px 110px 100px 105px 115px 105px 100px 110px 1fr',
                columnGap: '12px',
                alignItems: 'center'
              }}
            >
              <div style={{ textAlign: 'left' }}>{title}</div>
              <div style={{ textAlign: 'left' }}>MENSAL (MRR)</div>
              <div style={{ textAlign: 'left' }}>CRESCIMENTO YTD</div>
              <div style={{ textAlign: 'left' }}>SISTEMAS ATIVOS</div>
              <div style={{ textAlign: 'left' }}>SATISFAÇÃO</div>
              <div style={{ textAlign: 'left' }}>DECORRENTE TOTAL</div>
              <div style={{ textAlign: 'left' }}>REQUISIÇÕES / MÊS</div>
              <div style={{ textAlign: 'left' }}>GRÁFICO RENDIMENTO</div>
              <div style={{ textAlign: 'right' }} className="pr-4">MUDANÇA MENSAL</div>
            </div>

            {/* Table Rows */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {indices.map((index, indexNum) => (
                <motion.div key={index.id} variants={rowVariants}>
                  <div
                    className={`px-8 py-5 cursor-pointer group relative transition-all duration-300 ${
                      selectedIndex === index.id 
                        ? "bg-primary/5 border-l-2 border-primary" 
                        : "hover:bg-white/[0.02]"
                    } border-b border-white/5`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '260px 110px 100px 105px 115px 105px 100px 110px 1fr',
                      columnGap: '12px',
                      alignItems: 'center'
                    }}
                    onClick={() => handleIndexSelect(index.id)}
                  >
                    {/* Operation Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 flex items-center justify-center bg-zinc-900 shrink-0">
                        <div className="w-full h-full flex items-center justify-center">
                          {getCountryFlag(index.countryCode)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-xs tracking-wider uppercase truncate group-hover:text-primary transition-colors duration-300">
                          {index.name}
                        </div>
                        <div className="text-[10px] font-bold text-white/40 tracking-widest uppercase">
                          {index.country}
                        </div>
                      </div>
                    </div>

                    {/* Monthly Revenue */}
                    <div className="flex items-center">
                      <span className="font-black text-white text-xs font-mono">
                        {formatCurrency(index.monthlyRevenue)}
                      </span>
                    </div>

                    {/* YTD Growth */}
                    <div className="flex items-center">
                      {(() => {
                        const { bgColor, borderColor, textColor } = getPerformanceColor(index.growthYtd);
                        return (
                          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black font-mono border ${bgColor} ${borderColor} ${textColor}`}>
                            {formatPercentage(index.growthYtd)}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Systems Active */}
                    <div className="flex items-center">
                      <span className="font-bold text-white/80 text-xs font-mono ml-4">
                        {index.activeProjects}
                      </span>
                    </div>

                    {/* Satisfaction */}
                    <div className="flex items-center">
                      <span className="font-black text-primary text-xs font-mono">
                        {index.clientSatisfaction.toFixed(2)}%
                      </span>
                    </div>

                    {/* Total Billing */}
                    <div className="flex items-center">
                      <span className="font-bold text-white text-xs font-mono">
                        {formatLargeNumber(index.totalBilling, "M")}
                      </span>
                    </div>

                    {/* Volume (Traffic) */}
                    <div className="flex items-center">
                      <span className="font-bold text-white/60 text-xs font-mono">
                        {index.volume.toFixed(1)}k
                      </span>
                    </div>

                    {/* Sparkline chart */}
                    <div className="flex items-center">
                      <div className="px-2">
                        {renderSparkline(index.chartData)}
                      </div>
                    </div>

                    {/* Monthly Change */}
                    <div className="flex items-center gap-2 justify-end pr-4 text-right">
                      <span className={`font-semibold text-xs font-mono ${getPerformanceColor(index.monthlyChange).textColor}`}>
                        {index.monthlyChange >= 0 ? "+" : ""}{formatCurrency(index.monthlyChange)}
                      </span>
                      {(() => {
                        const { bgColor, borderColor, textColor } = getPerformanceColor(index.monthlyChangePercent);
                        return (
                          <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black font-mono border ${bgColor} ${borderColor} ${textColor}`}>
                            {formatPercentage(index.monthlyChangePercent)}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Full Dashboard with simulation
export default function TechifyDashboard() {
  const [indices, setIndices] = useState<TechifyCountryMarket[]>(defaultMarkets);

  // Live simulation of active requests and billing stream
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prev => prev.map(index => {
        // Slight random variation in billing fluctuation / metrics to showcase live active presence
        const lastRevenue = index.monthlyRevenue;
        // Moderate proportional variation (up to ±0.8% per interval, slightly positive biased)
        const variation = (Math.random() - 0.47) * (lastRevenue * 0.008);
        const newRevenue = Math.max(1000, lastRevenue + variation);
        
        const newChartData = [...index.chartData.slice(1), index.chartData[index.chartData.length - 1] + (variation / 110)];
        const trafficIncrement = (Math.random() - 0.44) * 0.4;
        
        return {
          ...index,
          chartData: newChartData,
          monthlyRevenue: newRevenue,
          volume: Math.min(250, Math.max(2, index.volume + trafficIncrement)),
          monthlyChange: index.monthlyChange + variation,
          monthlyChangePercent: ((index.monthlyChange + variation) / newRevenue) * 100
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <FinancialTable 
        title="Escritório / Mercado"
        indices={indices}
      />
    </div>
  );
}
