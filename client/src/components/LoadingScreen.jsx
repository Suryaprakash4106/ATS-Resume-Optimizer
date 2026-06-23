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
          40%     { transform: translateY(-10px) scale(1.08); }
          60%     { transform: translateY(-6px) scale(1.04); }
        }
        @keyframes ats-fade-label {
          0%,100% { opacity: 0.4; }
          50%     { opacity: 1; }
        }
        @keyframes ats-progress {
          0%   { width: 0%;   margin-left: 0; }
          50%  { width: 65%; }
          100% { width: 0%;   margin-left: 100%; }
        }
        @keyframes ats-float-particle {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 0.4; }
          100% { transform: translateY(-420px) scale(0.4); opacity: 0; }
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
        <div style={{ position: 'relative', width: 230, height: 230, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Ring 1 */}
          <div style={{
            position: 'absolute', width: 230, height: 230, borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#818cf8', borderRightColor: '#818cf8',
            boxShadow: '0 0 18px rgba(129,140,248,0.3)',
            animation: 'ats-spin 2.5s linear infinite',
          }} />

          {/* Ring 2 */}
          <div style={{
            position: 'absolute', width: 178, height: 178, borderRadius: '50%',
            border: '2px solid transparent',
            borderBottomColor: '#c084fc', borderLeftColor: '#c084fc',
            boxShadow: '0 0 14px rgba(192,132,252,0.3)',
            animation: 'ats-spin 2s linear infinite reverse',
          }} />

          {/* Ring 3 */}
          <div style={{
            position: 'absolute', width: 126, height: 126, borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#67e8f9', borderRightColor: '#67e8f9',
            boxShadow: '0 0 12px rgba(103,232,249,0.3)',
            animation: 'ats-spin 1.4s linear infinite',
          }} />

          {/* Center ATS text */}
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { letter: 'A', color: '#818cf8', shadow: 'rgba(129,140,248,0.5)', delay: '0s' },
                { letter: 'T', color: '#c084fc', shadow: 'rgba(192,132,252,0.5)', delay: '0.15s' },
                { letter: 'S', color: '#67e8f9', shadow: 'rgba(103,232,249,0.5)', delay: '0.3s' },
              ].map(({ letter, color, shadow, delay }) => (
                <span key={letter} style={{
                  fontSize: 46, fontWeight: 900, letterSpacing: 2,
                  color,
                  textShadow: `0 0 20px ${color}, 0 0 40px ${shadow}`,
                  animation: `ats-letter-bounce 1.4s ease-in-out ${delay} infinite`,
                  display: 'inline-block',
                }}>
                  {letter}
                </span>
              ))}
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 4, textTransform: 'uppercase', marginTop: 3 }}>
              Resume
            </span>
          </div>
        </div>

        {/* Loading label */}
        <div style={{
          marginTop: 38, fontSize: 12,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: 3, textTransform: 'uppercase',
          animation: 'ats-fade-label 1.5s ease-in-out infinite',
        }}>
          Loading
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: 12, width: 160, height: 3,
          background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden',
        }}>
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