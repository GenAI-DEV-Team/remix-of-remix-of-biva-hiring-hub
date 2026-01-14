export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora effect */}
      <div className="absolute inset-0">
        {/* Aurora layer 1 - Main green/cyan */}
        <div 
          className="absolute top-0 left-0 right-0 h-[70vh] opacity-30 dark:opacity-40 animate-aurora"
          style={{
            background: `
              linear-gradient(
                180deg,
                transparent 0%,
                hsl(var(--accent-cyan) / 0.3) 20%,
                hsl(var(--accent-purple) / 0.4) 40%,
                hsl(var(--accent-blue) / 0.3) 60%,
                transparent 100%
              )
            `,
            filter: 'blur(60px)',
            transform: 'translateY(-20%)',
          }}
        />
        
        {/* Aurora layer 2 - Purple/pink accent */}
        <div 
          className="absolute top-0 left-1/4 right-0 h-[60vh] opacity-25 dark:opacity-35 animate-aurora-slow"
          style={{
            background: `
              linear-gradient(
                160deg,
                transparent 0%,
                hsl(var(--accent-pink) / 0.4) 30%,
                hsl(var(--accent-purple) / 0.5) 50%,
                hsl(var(--accent-blue) / 0.3) 70%,
                transparent 100%
              )
            `,
            filter: 'blur(80px)',
            animationDelay: '-5s',
          }}
        />
        
        {/* Aurora layer 3 - Blue/cyan wave */}
        <div 
          className="absolute top-10 -left-1/4 right-1/4 h-[50vh] opacity-20 dark:opacity-30 animate-aurora-reverse"
          style={{
            background: `
              linear-gradient(
                200deg,
                transparent 0%,
                hsl(var(--accent-blue) / 0.5) 25%,
                hsl(var(--accent-cyan) / 0.4) 50%,
                hsl(var(--accent-purple) / 0.3) 75%,
                transparent 100%
              )
            `,
            filter: 'blur(70px)',
            animationDelay: '-10s',
          }}
        />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Animated gradient orbs for depth */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-blue/10 blur-3xl animate-float-slow" />
      <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-accent-cyan/15 to-accent-blue/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-accent-pink/15 to-accent-purple/10 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      {/* Stars/sparkles effect */}
      <div className="absolute inset-0 dark:opacity-60 opacity-30">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse-glow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.3 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>
      
      {/* Radial gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, transparent 0%, hsl(var(--background) / 0.5) 50%, hsl(var(--background)) 100%)',
        }}
      />
      
      {/* Bottom fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-60"
        style={{
          background: 'linear-gradient(to top, hsl(var(--background)), transparent)',
        }}
      />
    </div>
  );
}
