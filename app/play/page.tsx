"use client";
import React from "react";
import Wave from "react-wavify";
const progress = 50;
const MedicalTerminologyQuizUI = () => {
  return (
    <div className="min-h-screen flex font-sans text-[16px] leading-[26px] bg-[#F6F7FB]">
      {/* Left Menu with Raindrops */}
      <div
        className="w-16 relative overflow-hidden"
        style={{ backgroundColor: "rgb(44, 186, 223)" }}
      >
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
          <img
            src="https://www.pngegg.com/en/png-nllmb/download"
            alt="Logo"
            className="w-20 h-12"
          />
        </div>
        {/* Static Raindrops */}
        <div
          className="Hero6-drop-1"
          style={{ left: "10%", animationDelay: "0s" }}
        >
          <RaindropSVG />
        </div>
        <div
          className="Hero6-drop-1"
          style={{ left: "30%", animationDelay: "0s" }}
        >
          <RaindropSVG />
        </div>
        <div
          className="Hero6-drop-3"
          style={{ left: "50%", animationDelay: "1s" }}
        >
          <RaindropSVG />
        </div>
        <div
          className="Hero6-drop-2"
          style={{ left: "70%", animationDelay: "1.5s" }}
        >
          <RaindropSVG />
        </div>
        <div
          className="Hero6-drop-3"
          style={{ left: "90%", animationDelay: "2s" }}
        >
          <RaindropSVG />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-full">
          <div
            className="absolute bottom-0 w-full"
            style={{ height: `${progress}%` }}
          >
            <Wave
              fill="
              rgba(1, 83, 121, 0.8)"
              paused={false}
              options={{
                height: 10,
                amplitude: 10,
                speed: 0.15,
                points: 3,
              }}
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
              }}
            />
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* ... (header and main content remain unchanged) ... */}
      </div>
      <style jsx>{`
        .Hero6-drop-1 {
          position: absolute;
          bottom: 844px;
          width: 15px;
          height: 75px;
          color: white;
          opacity: 0.6;
          animation: animation-1dftcq5 3.2s linear infinite;
          pointer-events: none;
          user-select: none;
          font-size: 20px;
          line-height: 30px;
          font-weight: 400;
          font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          -webkit-font-smoothing: antialiased;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .Hero6-drop-2 {
          position: absolute;
          bottom: 844px;
          width: 25px;
          height: 100px;
          color: rgb(1, 83, 121);
          opacity: 0.6;
          animation: animation-1dftcq5 3.2s linear infinite;
          pointer-events: none;
          user-select: none;
          font-size: 20px;
          line-height: 30px;
          font-weight: 400;
          font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          -webkit-font-smoothing: antialiased;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        .Hero6-drop-3 {
          position: absolute;
          bottom: 844px;
          width: 30px;
          height: 150px;
          color: white;
          opacity: 0.6;
          animation: animation-1dftcq5 3.2s linear infinite;
          pointer-events: none;
          user-select: none;
          font-size: 20px;
          line-height: 30px;
          font-weight: 400;
          font-family: -apple-system, "system-ui", "Segoe UI", Roboto, Helvetica,
            Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
          -webkit-font-smoothing: antialiased;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        @keyframes animation-1dftcq5 {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(calc(100vh + 150px));
          }
        }
      `}</style>
    </div>
  );
};

const RaindropSVG = () => (
  <svg className="Hero6-symbol" viewBox="0 0 512 512">
    <path d="M414.21,226.014L256,0L97.791,226.014c-65.493,93.56-29.274,224.629,75.837,269.286C198.933,506.053,226.772,512,256,512s57.067-5.947,82.373-16.699C443.484,450.643,479.701,319.574,414.21,226.014z" />
  </svg>
);

export default MedicalTerminologyQuizUI;
