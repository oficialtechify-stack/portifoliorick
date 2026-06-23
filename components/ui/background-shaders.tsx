import { Warp } from "@paper-design/shaders-react"

export default function BackgroundShaders() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <Warp
          style={{ width: "100%", height: "100%" }}
          proportion={0.45}
          softness={1}
          distortion={0.5}
          swirl={1.2}
          swirlIterations={15}
          shape="checks"
          shapeScale={0.15}
          scale={1.2}
          rotation={0}
          speed={1.5}
          colors={["hsl(0, 100%, 50%)", "hsl(350, 100%, 30%)", "hsl(10, 100%, 60%)", "hsl(340, 100%, 20%)"]}
        />
      </div>
    </div>
  )
}
