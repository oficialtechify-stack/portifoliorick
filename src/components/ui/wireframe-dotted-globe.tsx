"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import * as topojson from "topojson-client"

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
}

export default function RotatingEarth({ width = 800, height = 600, className = "" }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext("2d")
    if (!context) return

    // Pre-calculate responsivity
    const containerWidth = width || 800
    const containerHeight = height || 600
    const radius = Math.min(containerWidth, containerHeight) / 2.2

    const dpr = window.devicePixelRatio || 1
    canvas.width = containerWidth * dpr
    canvas.height = containerHeight * dpr
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`
    context.scale(dpr, dpr)

    const projection = d3.geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90)

    const path = d3.geoPath().projection(projection).context(context)
    
    let worldData: any = null
    let dots: [number, number][] = []

    const generateDots = () => {
      dots = []
      // Use a denser grid for fallback if no worldData
      const step = worldData ? 3 : 5
      for (let lat = -90; lat <= 90; lat += step) {
        for (let lng = -180; lng <= 180; lng += step) {
          dots.push([lng, lat])
        }
      }
    }

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight)
      const currentScale = projection.scale()
      
      // Atmospheric glow
      const glow = context.createRadialGradient(
        containerWidth / 2, containerHeight / 2, currentScale,
        containerWidth / 2, containerHeight / 2, currentScale * 1.3
      )
      glow.addColorStop(0, "rgba(59, 130, 246, 0.2)")
      glow.addColorStop(1, "rgba(59, 130, 246, 0)")
      context.fillStyle = glow
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale * 1.3, 0, 2 * Math.PI)
      context.fill()

      // Ocean/Inner Core
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fillStyle = "rgba(5, 10, 30, 0.95)"
      context.fill()

      // Rotating grid rings (Visual interest fallback)
      if (!worldData) {
        context.beginPath()
        path(d3.geoGraticule()())
        context.strokeStyle = "rgba(59, 130, 246, 0.1)"
        context.stroke()
      }

      // Glass reflection
      const reflection = context.createRadialGradient(
        containerWidth / 2 - currentScale * 0.4, containerHeight / 2 - currentScale * 0.4, currentScale * 0.1,
        containerWidth / 2, containerHeight / 2, currentScale
      )
      reflection.addColorStop(0, "rgba(100, 200, 255, 0.3)")
      reflection.addColorStop(0.5, "rgba(59, 130, 246, 0.05)")
      reflection.addColorStop(1, "rgba(0, 0, 0, 0.7)")
      context.fillStyle = reflection
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.fill()

      context.save()
      const pRotate = projection.rotate()
      
      dots.forEach(([lng, lat]) => {
        const projected = projection([lng, lat])
        if (!projected) return

        // Simple back-face check
        if (d3.geoDistance([lng, lat], [-pRotate[0], -pRotate[1]]) >= Math.PI / 2) return

        const isLand = worldData ? d3.geoContains(worldData, [lng, lat]) : false
        // Draw a grid if no worldData, or only land if worldData exists
        const shouldDraw = worldData ? isLand : (lat % 6 === 0 && lng % 6 === 0)
        
        if (shouldDraw) {
          const dx = projected[0] - containerWidth / 2
          const dy = projected[1] - containerHeight / 2
          const dist = Math.sqrt(dx * dx + dy * dy)
          const perspective = Math.max(0.2, 1 - dist / (currentScale * 1.1))

          context.beginPath()
          context.arc(projected[0], projected[1], (worldData ? 2 : 1.2) * perspective, 0, 2 * Math.PI)
          
          if (worldData) {
            context.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.6 * perspective})`
            context.shadowBlur = 10 * perspective
            context.shadowColor = "rgba(59, 130, 246, 0.8)"
          } else {
            context.fillStyle = `rgba(100, 150, 255, ${0.2 * perspective})`
          }
          
          context.fill()
          context.shadowBlur = 0
        }
      })
      context.restore()

      // Border and grid
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI)
      context.strokeStyle = worldData ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.05)"
      context.lineWidth = 1
      context.stroke()
    }

    const loadWorld = async () => {
      const urls = [
        "https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json",
        "https://unpkg.com/world-atlas@2.0.2/land-110m.json",
        "https://raw.githubusercontent.com/d3/d3.github.com/master/world-110m.v1.json",
        "https://gist.githubusercontent.com/mbostock/4090846/raw/dcae8157581fbcf70643d99527fe28126ca36ede/world-110m.json"
      ]

      for (const url of urls) {
        try {
          const res = await fetch(url)
          if (!res.ok) continue
          
          const data = await res.json()
          
          if (url.endsWith('.json') && data.objects) {
            // It's TopoJSON
            worldData = topojson.feature(data, data.objects.land)
          } else {
            // It's GeoJSON
            worldData = data
          }
          
          generateDots()
          render()
          setError(null)
          return // Success
        } catch (err) {
          console.warn(`Failed to load from ${url}:`, err)
        }
      }

      console.error("All Earth data sources failed")
      setError("load-failed")
      // Fallback: generate some dots even without land data to show a "digital" grid
      generateDots()
      render()
    }

    const rotation = [0, 0]
    const timer = d3.timer(() => {
      rotation[0] += 0.5
      projection.rotate(rotation as [number, number])
      render()
    })

    loadWorld()

    return () => timer.stop()
  }, [width, height])

  return (
    <div className={`relative ${className} pointer-events-none`}>
      <canvas ref={canvasRef} className="w-full h-auto bg-transparent" />
    </div>
  )
}
