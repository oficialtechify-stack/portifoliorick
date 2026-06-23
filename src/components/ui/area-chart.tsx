"use client";

import { localPoint } from "@visx/event";
import { curveMonotoneX } from "@visx/curve";
import { GridColumns, GridRows } from "@visx/grid";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime, type scaleBand } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { bisector } from "d3-array";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useSpring,
} from "motion/react";
import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactElement,
  type ReactNode,
  type RefObject,
  type SetStateAction,
} from "react";
import useMeasure from "react-use-measure";
import { createPortal } from "react-dom";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const chartCssVars = {
  background: "var(--chart-background)",
  foreground: "var(--chart-foreground)",
  foregroundMuted: "var(--chart-foreground-muted)",
  label: "var(--chart-label)",
  linePrimary: "var(--chart-line-primary)",
  lineSecondary: "var(--chart-line-secondary)",
  crosshair: "var(--chart-crosshair)",
  grid: "var(--chart-grid)",
  indicatorColor: "var(--chart-indicator-color)",
  indicatorSecondaryColor: "var(--chart-indicator-secondary-color)",
  markerBackground: "var(--chart-marker-background)",
  markerBorder: "var(--chart-marker-border)",
  markerForeground: "var(--chart-marker-foreground)",
  badgeBackground: "var(--chart-marker-badge-background)",
  badgeForeground: "var(--chart-marker-badge-foreground)",
  segmentBackground: "var(--chart-segment-background)",
  segmentLine: "var(--chart-segment-line)",
};

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface TooltipData {
  point: Record<string, unknown>;
  index: number;
  x: number;
  yPositions: Record<string, number>;
}

export interface LineConfig {
  dataKey: string;
  stroke: string;
  strokeWidth: number;
}

export interface ChartContextValue {
  data: Record<string, unknown>[];
  xScale: ReturnType<typeof scaleTime<number>>;
  yScale: ReturnType<typeof scaleLinear<number>>;
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  columnWidth: number;
  tooltipData: TooltipData | null;
  setTooltipData: Dispatch<SetStateAction<TooltipData | null>>;
  containerRef: RefObject<HTMLDivElement | null>;
  lines: LineConfig[];
  isLoaded: boolean;
  animationDuration: number;
  xAccessor: (d: Record<string, unknown>) => Date;
  dateLabels: string[];
}

const ChartContext = createContext<ChartContextValue | null>(null);

function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within AreaChart");
  return ctx;
}

export function AreaChart({
  data,
  xDataKey = "date",
  margin = { top: 40, right: 40, bottom: 40, left: 40 },
  animationDuration = 1100,
  aspectRatio = "2 / 1",
  className = "",
  children,
}: {
  data: Record<string, unknown>[];
  xDataKey?: string;
  margin?: Margin;
  animationDuration?: number;
  aspectRatio?: string;
  className?: string;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full", className)}
      style={{ aspectRatio }}
    >
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <ChartInner
            width={width}
            height={height}
            data={data}
            xDataKey={xDataKey}
            margin={margin}
            animationDuration={animationDuration}
            containerRef={containerRef}
            tooltipData={tooltipData}
            setTooltipData={setTooltipData}
            isLoaded={isLoaded}
          >
            {children}
          </ChartInner>
        )}
      </ParentSize>
    </div>
  );
}

function ChartInner({
  width,
  height,
  data,
  xDataKey,
  margin,
  animationDuration,
  children,
  containerRef,
  tooltipData,
  setTooltipData,
  isLoaded,
}: any) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xAccessor = useCallback(
    (d: any) => (d[xDataKey] instanceof Date ? d[xDataKey] : new Date(d[xDataKey])),
    [xDataKey]
  );

  const lines = useMemo(() => {
    const configs: LineConfig[] = [];
    Children.forEach(children, (child: any) => {
      if (isValidElement(child) && (child.props as any).dataKey) {
        configs.push({
          dataKey: (child.props as any).dataKey,
          stroke: (child.props as any).stroke || (child.props as any).fill || "var(--chart-line-primary)",
          strokeWidth: (child.props as any).strokeWidth || 2,
        });
      }
    });
    return configs;
  }, [children]);

  const xScale = useMemo(() => {
    const dates = data.map(xAccessor);
    return scaleTime({
      range: [0, innerWidth],
      domain: [Math.min(...dates.map(d => d.getTime())), Math.max(...dates.map(d => d.getTime()))],
    });
  }, [innerWidth, data, xAccessor]);

  const yScale = useMemo(() => {
    const max = Math.max(...data.map(d => Math.max(...lines.map(l => (d[l.dataKey] as number) || 0))));
    return scaleLinear({
      range: [innerHeight, 0],
      domain: [0, max * 1.1],
      nice: true,
    });
  }, [innerHeight, data, lines]);

  const bisectDate = useMemo(() => bisector<any, Date>(xAccessor).left, [xAccessor]);

  const handleMouseMove = useCallback(
    (event: any) => {
      const point = localPoint(event);
      if (!point) return;
      const x0 = xScale.invert(point.x - margin.left);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;
      if (d1 && x0.getTime() - xAccessor(d0).getTime() > xAccessor(d1).getTime() - x0.getTime()) {
        d = d1;
      }
      if (!d) return;

      const yPositions: any = {};
      lines.forEach(l => {
        yPositions[l.dataKey] = yScale(d[l.dataKey] as number);
      });

      setTooltipData({
        point: d,
        index: data.indexOf(d),
        x: xScale(xAccessor(d)),
        yPositions,
      });
    },
    [xScale, yScale, data, margin.left, bisectDate, xAccessor, lines, setTooltipData]
  );

  const contextValue = {
    data,
    xScale,
    yScale,
    width,
    height,
    innerWidth,
    innerHeight,
    margin,
    columnWidth: innerWidth / (data.length - 1),
    tooltipData,
    setTooltipData,
    containerRef,
    lines,
    isLoaded,
    animationDuration,
    xAccessor,
    dateLabels: data.map(d => xAccessor(d).toLocaleDateString()),
  };

  return (
    <ChartContext.Provider value={contextValue}>
      <svg width={width} height={height} onMouseMove={handleMouseMove} onMouseLeave={() => setTooltipData(null)}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {children}
        </g>
      </svg>
    </ChartContext.Provider>
  );
}

export function Grid({ horizontal = true }: { horizontal?: boolean }) {
  const { yScale, innerWidth } = useChart();
  return horizontal ? <GridRows scale={yScale} width={innerWidth} stroke="var(--chart-grid)" strokeDasharray="4,4" /> : null;
}

export function Area({ dataKey, fill = "var(--chart-line-primary)", fillOpacity = 0.3, strokeWidth = 2 }: any) {
  const { data, xScale, yScale, xAccessor } = useChart();
  return (
    <>
      <AreaClosed
        data={data}
        x={d => xScale(xAccessor(d))}
        y={d => yScale(d[dataKey] as number)}
        yScale={yScale}
        fill={fill}
        fillOpacity={fillOpacity}
        curve={curveMonotoneX}
      />
      <LinePath
        data={data}
        x={d => xScale(xAccessor(d))}
        y={d => yScale(d[dataKey] as number)}
        stroke={fill}
        strokeWidth={strokeWidth}
        curve={curveMonotoneX}
      />
    </>
  );
}

export function XAxis() {
  const { xScale, innerHeight } = useChart();
  const ticks = xScale.ticks(5);
  return (
    <g transform={`translate(0,${innerHeight})`}>
      {ticks.map(t => (
        <text key={t.getTime()} x={xScale(t)} y={20} fill="var(--chart-label)" fontSize={10} textAnchor="middle">
          {t.toLocaleDateString()}
        </text>
      ))}
    </g>
  );
}

export function YAxis({ formatValue }: { formatValue?: (val: number) => string }) {
  const { yScale } = useChart();
  const ticks = yScale.ticks(5);
  return (
    <g>
      {ticks.map(t => (
        <text key={t} x={-10} y={yScale(t)} fill="var(--chart-label)" fontSize={10} textAnchor="end" alignmentBaseline="middle">
          {formatValue ? formatValue(t) : t.toLocaleString()}
        </text>
      ))}
    </g>
  );
}

export function ChartTooltip() {
  const { tooltipData, containerRef, margin } = useChart();
  if (!tooltipData || !containerRef.current) return null;

  return createPortal(
    <div
      className="absolute pointer-events-none bg-popover text-popover-foreground p-2 rounded shadow-lg border text-xs"
      style={{
        left: tooltipData.x + margin.left + 10,
        top: tooltipData.yPositions[Object.keys(tooltipData.yPositions)[0]] + margin.top - 40,
      }}
    >
      <div className="font-bold">{new Date(tooltipData.point.date as any).toLocaleDateString()}</div>
      {Object.entries(tooltipData.yPositions).map(([key, _val]: any) => (
        <div key={key} className="flex justify-between gap-4">
          <span>{key}:</span>
          <span>{tooltipData.point[key] as any}</span>
        </div>
      ))}
    </div>,
    containerRef.current
  );
}
