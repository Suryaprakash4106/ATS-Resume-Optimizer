import React, { useEffect, useRef } from 'react';

const LoadingScreen = () => {
  const particleRef = useRef(null);

  useEffect(() => {
    const container = particleRef.current;
    if (!container) return;
    const colors = [
      'rgba(129,140,248,0.4)',
      'rgba(192,132,252,0.4)',
      'rgba(103,232,249,0.4)',
    ];
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 5 + 3;
      p.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * 20}%;
        background: ${colors[i % 3]};
        animation: ats-float-particle ${Math.random() * 5 + 4}s linear ${Math.random() * 5}s infinite;
        pointer-events: none;
      `;
      container.appendChild(p);
    }
    return () => {
      while (container.firstChild) container.removeChild(container.firstChild);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes ats-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ats-letter-bounce {
          0%,100% { transform: translateY(0px) scale(1); }
          40%     { transform: translateY(-8px) scale(1.08); }
          60%     { transform: translateY(-4px) scale(1.04); }
        }
        @keyframes ats-fade-label {
          0%,100% { opacity: 0.4; }
          50%     { opacity: 1; }
        }
        @keyframes ats-progress {
          0%   { width: 0%;  margin-left: 0; }
          50%  { width: 65%; }
          100% { width: 0%;  margin-left: 100%; }
        }
        @keyframes ats-float-particle {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.4; }
          100% { transform: translateY(-420px) scale(0.4); opacity: 0; }
        }

        .ats-orbit-wrap {
          position: relative;
          width: min(230px, 55vmin);
          height: min(230px, 55vmin);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ats-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid transparent;
        }
        .ats-ring-1 {
          width: 100%; height: 100%;
          border-top-color: #818cf8; border-right-color: #818cf8;
          box-shadow: 0 0 18px rgba(129,140,248,0.3);
          animation: ats-spin 2.5s linear infinite;
        }
        .ats-ring-2 {
          width: 77%; height: 77%;
          border-bottom-color: #c084fc; border-left-color: #c084fc;
          box-shadow: 0 0 14px rgba(192,132,252,0.3);
          animation: ats-spin 2s linear infinite reverse;
        }
        .ats-ring-3 {
          width: 55%; height: 55%;
          border-top-color: #67e8f9; border-right-color: #67e8f9;
          box-shadow: 0 0 12px rgba(103,232,249,0.3);
          animation: ats-spin 1.4s linear infinite;
        }

        .ats-letter {
          font-size: clamp(28px, 10vmin, 46px);
          font-weight: 900;
          display: inline-block;
          animation: ats-letter-bounce 1.4s ease-in-out infinite;
        }
        .ats-tagline {
          font-size: clamp(9px, 2vmin, 11px);
          color: rgba(255,255,255,0.35);
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-top: 3px;
        }
        .ats-loading-label {
          margin-top: clamp(24px, 5vmin, 38px);
          font-size: clamp(10px, 2.5vmin, 12px);
          color: rgba(255,255,255,0.5);
          letter-spacing: 3px;
          text-transform: uppercase;
          animation: ats-fade-label 1.5s ease-in-out infinite;
        }
        .ats-progress-wrap {
          margin-top: 12px;
          width: min(160px, 40vw);
          height: 3px;
          background: rgba(255,255,255,0.08);
          border-radius: 10px;
          overflow: hidden;
        }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'linear-gradient(135deg, #0a0618, #1a1040, #0d0a2e)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif",
        overflow: 'hidden',
      }}>
        {/* Particles */}
        <div ref={particleRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

        {/* Orbit rings + center text */}
        <div className="ats-orbit-wrap">
          <div className="ats-ring ats-ring-1" />
          <div className="ats-ring ats-ring-2" />
          <div className="ats-ring ats-ring-3" />

          {/* Center ATS text */}
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: 'clamp(2px, 1vmin, 4px)' }}>
              {[
                { letter: 'A', color: '#818cf8', shadow: 'rgba(129,140,248,0.5)', delay: '0s' },
                { letter: 'T', color: '#c084fc', shadow: 'rgba(192,132,252,0.5)', delay: '0.15s' },
                { letter: 'S', color: '#67e8f9', shadow: 'rgba(103,232,249,0.5)', delay: '0.3s' },
              ].map(({ letter, color, shadow, delay }) => (
                <span key={letter} className="ats-letter" style={{
                  color,
                  textShadow: `0 0 20px ${color}, 0 0 40px ${shadow}`,
                  animationDelay: delay,
                }}>
                  {letter}
                </span>
              ))}
            </div>
            <span className="ats-tagline">Resume</span>
          </div>
        </div>

        {/* Loading label */}
        <div className="ats-loading-label">Loading</div>

        {/* Progress bar */}
        <div className="ats-progress-wrap">
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #818cf8, #c084fc, #67e8f9)',
            borderRadius: 10,
            boxShadow: '0 0 8px rgba(129,140,248,0.6)',
            animation: 'ats-progress 1.8s ease-in-out infinite',
          }} />
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;