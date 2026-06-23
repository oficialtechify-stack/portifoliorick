"use client"

import React from 'react'
import { cn } from '@/lib/utils'

const Wave = () => (
  <svg
    width="129"
    height="1387"
    viewBox="0 0 129 1387"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.2131 11L106.283 106.07M106.283 106.07L117.279 117.066M106.283 106.07L22.2962 190.003M106.283 106.07L116.688 95.6708M11.2962 200.997L22.2962 190.003M22.2962 190.003L11.2529 178.96M22.2962 190.003L106.323 274.03M106.323 274.03L117.319 285.026M106.323 274.03L22.4537 357.846M106.323 274.03L116.728 263.631M11.3361 368.957L22.4537 357.846M22.4537 357.846L11.5493 346.901M22.4537 357.846L106.44 442.149M106.44 442.149L117.416 453.166M106.44 442.149L22.2962 525.925M106.44 442.149L116.865 431.769M11.2756 536.897L22.2962 525.925M22.2962 525.925L11.2737 514.861M22.2962 525.925L106.165 610.109M106.165 610.109L117.14 621.126M106.165 610.109L11 704.857M106.165 610.109L116.59 599.729M11.2131 683L106.283 778.07M106.283 778.07L117.279 789.066M106.283 778.07L22.2962 862.003M106.283 778.07L116.688 767.671M11.2962 872.997L22.2962 862.003M22.2962 862.003L11.2529 850.96M22.2962 862.003L106.323 946.03M106.323 946.03L117.319 957.026M106.323 946.03L22.4537 1029.85M106.323 946.03L116.728 935.631M11.3361 1040.96L22.4537 1029.85M22.4537 1029.85L11.5493 1018.9M22.4537 1029.85L106.44 1114.15M106.44 1114.15L117.416 1125.17M106.44 1114.15L22.2962 1197.92M106.44 1114.15L116.865 1103.77M11.2756 1208.9L22.2962 1197.92M22.2962 1197.92L11.2737 1186.86M22.2962 1197.92L106.165 1282.11M106.165 1282.11L117.14 1293.13M106.165 1282.11L11 1376.86M106.165 1282.11L116.59 1271.73"
      stroke="currentColor"
      strokeWidth="31"
      className="opacity-20"
    />
  </svg>
)

const Cross = () => (
  <svg
    width="130"
    height="130"
    viewBox="0 0 130 130"
    fill="none"
    className={'scale-125'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11 11L118.899 119M11.101 119L119 11" stroke="currentColor" strokeWidth="31" className="opacity-20" />
  </svg>
)

export const PricingWrapper: React.FC<{
  children: React.ReactNode
  type?: 'waves' | 'crosses'
  contactHref: string
  className?: string
  color?: string
}> = ({ children, contactHref, className, type = 'waves', color = 'bg-primary' }) => (
  <article
    className={cn(
      'min-h-[400px] h-full max-w-sm w-full relative overflow-hidden rounded-[2.5rem] text-white p-8 group transition-all duration-500 border border-white/5 hover:border-white/10',
      color,
      className
    )}
  >
    <div className="relative z-10 h-full flex flex-col justify-between">
      <div className="space-y-6">
        {children}
      </div>
      
      <div className={'w-full pt-8'}>
        <a 
          href={contactHref} 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            'flex items-center justify-center h-14 w-full rounded-2xl font-black uppercase italic tracking-wider transition-all duration-300 active:scale-95',
            color.includes('bg-primary') ? 'bg-white text-black hover:bg-neutral-100' : 'bg-primary text-black hover:brightness-110'
          )}
        >
          VER PROJETO
        </a>
      </div>
    </div>

    {type === 'waves' && (
      <div className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden">
        <div className={'w-fit h-fit absolute -top-[106px] left-4 waves z-0 animate-[waves_20s_linear_infinite]'}>
          <Wave />
        </div>
        <div className={'w-fit h-fit absolute -top-[106px] right-4 waves z-0 animate-[waves_25s_linear_infinite]'}>
          <Wave />
        </div>
      </div>
    )}
    
    {type === 'crosses' && (
      <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
        <div className={'w-fit h-fit absolute top-10 -left-10 z-0 animate-[spin_15s_linear_infinite]'}>
          <Cross />
        </div>
        <div className={'w-fit h-fit absolute top-1/2 -right-12 z-0 animate-[spin_20s_linear_infinite]'}>
          <Cross />
        </div>
        <div className={'w-fit h-fit absolute top-[85%] -left-5 z-0 animate-[spin_10s_linear_infinite]'}>
          <Cross />
        </div>
      </div>
    )}
  </article>
)

export const Heading: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <h3 className={cn('text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none', className)}>
    {children}
  </h3>
)

export const Price: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <div
    className={cn('text-xl font-bold opacity-60 tracking-wider uppercase', className)}
  >
    {children}
  </div>
)

export const Paragraph: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => (
  <p className={cn('text-sm md:text-base font-medium leading-relaxed opacity-70', className)}>
    {children}
  </p>
)
