import React, { useEffect, useRef } from 'react';

const AdvancedGradient = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Add mouse movement effect for interactive gradient
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      const moveX = (x - 0.5) * 20;
      const moveY = (y - 0.5) * 20;
      
      containerRef.current.style.setProperty('--mouse-x', `${moveX}px`);
      containerRef.current.style.setProperty('--mouse-y', `${moveY}px`);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full"
      style={{
        '--mouse-x': '0px',
        '--mouse-y': '0px'
      }}
    >
      {/* Base gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
      
      {/* Animated gradient layers */}
      <div className="absolute inset-0">
        {/* Layer 1 - Primary animated gradient */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 8s ease-in-out infinite',
            transform: 'translate(var(--mouse-x), var(--mouse-y))'
          }}
        ></div>
        
        {/* Layer 2 - Secondary gradient */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            background: 'linear-gradient(-135deg, #ffecd2 0%, #fcb69f 25%, #a8edea 50%, #fed6e3 75%, #d299c2 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 12s ease-in-out infinite reverse',
            transform: 'translate(calc(var(--mouse-x) * -0.5), calc(var(--mouse-y) * -0.5))'
          }}
        ></div>
        
        {/* Layer 3 - Accent gradient */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 25%, #fecfef 50%, #c3cfe2 75%, #667eea 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease-in-out infinite',
            transform: 'translate(calc(var(--mouse-x) * 0.3), calc(var(--mouse-y) * 0.3))'
          }}
        ></div>
        
        {/* Floating orbs with mouse interaction */}
        <div 
          className="absolute top-1/4 left-1/4 w-40 h-40 bg-blue-400/40 rounded-full blur-2xl animate-float"
          style={{
            transform: 'translate(calc(var(--mouse-x) * 0.2), calc(var(--mouse-y) * 0.2))'
          }}
        ></div>
        <div 
          className="absolute top-3/4 right-1/4 w-32 h-32 bg-purple-400/40 rounded-full blur-2xl animate-float" 
          style={{
            animationDelay: '2s',
            transform: 'translate(calc(var(--mouse-x) * -0.3), calc(var(--mouse-y) * -0.3))'
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-pink-400/40 rounded-full blur-2xl animate-float" 
          style={{
            animationDelay: '4s',
            transform: 'translate(calc(var(--mouse-x) * 0.4), calc(var(--mouse-y) * 0.4))'
          }}
        ></div>
        <div 
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-cyan-400/40 rounded-full blur-2xl animate-float" 
          style={{
            animationDelay: '6s',
            transform: 'translate(calc(var(--mouse-x) * -0.2), calc(var(--mouse-y) * -0.2))'
          }}
        ></div>
        
        {/* Additional floating elements */}
        <div 
          className="absolute top-1/3 right-1/2 w-20 h-20 bg-yellow-400/30 rounded-full blur-xl animate-float" 
          style={{
            animationDelay: '1s',
            transform: 'translate(calc(var(--mouse-x) * 0.1), calc(var(--mouse-y) * 0.1))'
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/2 w-16 h-16 bg-green-400/30 rounded-full blur-xl animate-float" 
          style={{
            animationDelay: '3s',
            transform: 'translate(calc(var(--mouse-x) * -0.1), calc(var(--mouse-y) * -0.1))'
          }}
        ></div>
        
        {/* Mesh gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, #667eea 0%, transparent 50%), 
              radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%), 
              radial-gradient(circle at 40% 40%, #f093fb 0%, transparent 50%),
              radial-gradient(circle at 60% 60%, #4facfe 0%, transparent 50%)
            `,
            transform: 'translate(calc(var(--mouse-x) * 0.1), calc(var(--mouse-y) * 0.1))'
          }}
        ></div>
        
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay'
          }}
        ></div>
      </div>
    </div>
  );
};

export default AdvancedGradient;
