import { useState, useEffect, useRef } from 'react';

interface PixelDuckProps {
  message: string;
  isThinking?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PixelDuck({ message, isThinking = false, size = 'md' }: PixelDuckProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current <= message.length) {
        setDisplayedText(message.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [message]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  const sizeMap = {
    sm: 64,
    md: 96,
    lg: 128,
  };
  const px = sizeMap[size];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px', margin: '16px 0' }}>
      {/* Duck */}
      <div className="animate-float" style={{ flexShrink: 0, width: px, height: px, position: 'relative' }}>
        <svg viewBox="0 0 32 32" style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}>
          {/* Body */}
          <rect x="8" y="18" width="16" height="10" fill="#FFD700" />
          <rect x="6" y="20" width="2" height="6" fill="#FFD700" />
          <rect x="24" y="20" width="2" height="6" fill="#FFD700" />
          
          {/* Head */}
          <rect x="10" y="8" width="12" height="12" fill="#FFD700" />
          <rect x="8" y="10" width="2" height="8" fill="#FFD700" />
          <rect x="22" y="10" width="2" height="8" fill="#FFD700" />
          
          {/* Eye */}
          <rect x="18" y="12" width="2" height="2" fill="#000000" />
          <rect x="19" y="11" width="1" height="1" fill="#FFFFFF" />
          
          {/* Beak */}
          <rect x="22" y="14" width="6" height="2" fill="#FF8C00" />
          <rect x="22" y="16" width="4" height="2" fill="#FF8C00" />
          
          {/* Wing */}
          <rect x="8" y="20" width="6" height="4" fill="#E6C200" />
          
          {/* Feet */}
          <rect x="10" y="28" width="4" height="2" fill="#FF8C00" />
          <rect x="18" y="28" width="4" height="2" fill="#FF8C00" />
          <rect x="8" y="30" width="6" height="2" fill="#FF8C00" />
          <rect x="16" y="30" width="6" height="2" fill="#FF8C00" />
          
          {/* Hacker hat */}
          <rect x="8" y="6" width="14" height="2" fill="#333" />
          <rect x="10" y="4" width="10" height="2" fill="#333" />
          <rect x="12" y="2" width="6" height="2" fill="#333" />
          
          {/* Matrix green reflection on hat */}
          <rect x="12" y="5" width="2" height="1" fill="#00ff41" />
          <rect x="16" y="5" width="1" height="1" fill="#00ff41" />
        </svg>
        
        {/* Glowing eyes effect when thinking */}
        {isThinking && (
          <div className="animate-blink" style={{
            position: 'absolute',
            top: '37%',
            right: '34%',
            width: '8px',
            height: '8px',
            background: '#00ff41',
            borderRadius: '50%',
            opacity: 0.8,
          }} />
        )}
      </div>

      {/* Speech bubble */}
      <div className="animate-bubble" style={{ maxWidth: '500px', position: 'relative' }}>
        {/* Arrow */}
        <div style={{
          position: 'absolute',
          left: '-12px',
          bottom: '16px',
          width: 0,
          height: 0,
          borderTop: '8px solid transparent',
          borderRight: '12px solid #1a1a2e',
          borderBottom: '8px solid transparent',
        }} />
        <div style={{
          background: '#1a1a2e',
          border: '1px solid rgba(0,255,65,0.3)',
          borderRadius: '8px',
          padding: '16px',
          boxShadow: '0 0 15px rgba(0,255,65,0.1)',
        }}>
          <p style={{ fontSize: '14px', color: '#00ff41', lineHeight: 1.6 }}>
            {isThinking ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="animate-blink">{'>'}</span>
                <span>Обрабатываю данные...</span>
              </span>
            ) : (
              <>
                {displayedText}
                <span style={{ opacity: showCursor ? 1 : 0, transition: 'opacity 0.1s' }}>▊</span>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
