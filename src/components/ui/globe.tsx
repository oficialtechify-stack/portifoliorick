import React from "react";

const Globe: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes earthRotate {
            0% { background-position: 0 0; }
            100% { background-position: 400px 0; }
          }
          @keyframes twinkling { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-slow { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-long { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
          @keyframes twinkling-fast { 0%,100% { opacity:0.1; } 50% { opacity:1; } }
        `}
      </style>
      <div className="relative group">
        {/* Glow Atmosphere (Added for glassy look) */}
        <div className="absolute inset-[-60px] rounded-full bg-blue-400/10 blur-[80px] opacity-40 animate-pulse" />
        <div className="absolute inset-[-30px] rounded-full bg-blue-500/10 blur-[40px] opacity-30" />
        
        {/* Main Globe */}
        <div
          className="relative w-[280px] h-[280px] rounded-full overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.9),inset_0_0_40px_rgba(195,244,255,0.4),0_0_30px_rgba(255,255,255,0.1),inset_0_40px_60px_rgba(255,255,255,0.2)] bg-black"
          style={{
            backgroundImage: "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/globe.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "left",
            animation: "earthRotate 30s linear infinite",
          }}
        >
          {/* Glassy reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-white/25 pointer-events-none" />
          <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-white/20 rounded-full blur-2xl rotate-45" />

          {/* Stars */}
          <div
            className="absolute left-[10px] top-[40px] w-1 h-1 bg-white rounded-full opacity-50"
            style={{ animation: "twinkling 3s infinite" }}
          />
          <div
            className="absolute left-[180px] top-[120px] w-1 h-1 bg-white rounded-full opacity-60"
            style={{ animation: "twinkling-slow 5s infinite" }}
          />
          <div
            className="absolute right-[40px] top-[60px] w-0.5 h-0.5 bg-white rounded-full"
            style={{ animation: "twinkling-fast 2s infinite" }}
          />
        </div>
      </div>
    </>
  );
};

export default Globe;
