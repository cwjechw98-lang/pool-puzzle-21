import { useState, useEffect, useRef } from 'react';

interface TerminalWindowProps {
  title?: string;
  code: string;
  typingSpeed?: number;
  onComplete?: () => void;
}

const C_KEYWORDS = ['include', 'define', 'if', 'else', 'return', 'int', 'void', 'char', 'bool', 'printf', 'scanf', 'while', 'for', 'struct', 'typedef', 'enum', 'true', 'false', 'UNKNOWN'];

export function TerminalWindow({ title = 'terminal', code, typingSpeed = 15, onComplete }: TerminalWindowProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedCode('');
    setIsComplete(false);
    indexRef.current = 0;

    const interval = setInterval(() => {
      indexRef.current++;
      if (indexRef.current <= code.length) {
        setDisplayedCode(code.slice(0, indexRef.current));
        if (codeRef.current) {
          codeRef.current.scrollTop = codeRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, typingSpeed);
    return () => clearInterval(interval);
  }, [code, typingSpeed, onComplete]);

  // Simple syntax highlighter for C
  const highlightCode = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      const isComment = line.trimStart().startsWith('//');
      if (isComment) {
        return (
          <div key={lineIdx}>
            <span style={{ color: 'rgba(0,255,65,0.4)' }}>{line}</span>
          </div>
        );
      }

      // Tokenize the line
      const tokens: { text: string; color: string }[] = [];
      let remaining = line;
      
      while (remaining.length > 0) {
        // Check for inline comment
        const commentIdx = remaining.indexOf('//');
        if (commentIdx === 0) {
          tokens.push({ text: remaining, color: 'rgba(0,255,65,0.4)' });
          remaining = '';
          continue;
        }

        // Check for string
        const strIdx = remaining.indexOf('"');
        if (strIdx === 0) {
          const endStr = remaining.indexOf('"', 1);
          if (endStr !== -1) {
            tokens.push({ text: remaining.slice(0, endStr + 1), color: '#00d4ff' });
            remaining = remaining.slice(endStr + 1);
            continue;
          }
        }

        // Check for preprocessor
        if (remaining.trimStart().startsWith('#')) {
          const spaceIdx = remaining.indexOf(' ');
          if (spaceIdx !== -1) {
            tokens.push({ text: remaining.slice(0, spaceIdx), color: '#b44aff' });
            remaining = remaining.slice(spaceIdx);
            continue;
          }
        }

        // Check for keyword
        const wordMatch = remaining.match(/^([a-zA-Z_]\w*)/);
        if (wordMatch) {
          const word = wordMatch[1];
          if (C_KEYWORDS.includes(word)) {
            tokens.push({ text: word, color: '#b44aff' });
          } else {
            tokens.push({ text: word, color: 'rgba(0,255,65,0.9)' });
          }
          remaining = remaining.slice(word.length);
          continue;
        }

        // Check for numbers
        const numMatch = remaining.match(/^(\d+)/);
        if (numMatch) {
          tokens.push({ text: numMatch[1], color: '#00d4ff' });
          remaining = remaining.slice(numMatch[1].length);
          continue;
        }

        // Check for braces/brackets
        if ('{}[]()'.includes(remaining[0])) {
          tokens.push({ text: remaining[0], color: '#ffd700' });
          remaining = remaining.slice(1);
          continue;
        }

        // Take one character
        const nextSpecial = Math.min(
          ...[commentIdx, strIdx, remaining.search(/[a-zA-Z_\d{}[\]()]/)]
            .filter(i => i > 0)
            .concat([remaining.length])
        );
        tokens.push({ text: remaining.slice(0, Math.max(1, nextSpecial)), color: 'rgba(0,255,65,0.9)' });
        remaining = remaining.slice(Math.max(1, nextSpecial));
      }

      return (
        <div key={lineIdx}>
          {tokens.map((t, i) => (
            <span key={i} style={{ color: t.color }}>{t.text}</span>
          ))}
        </div>
      );
    });
  };

  return (
    <div className="animate-fadeInUp" style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,255,65,0.2)', boxShadow: '0 0 20px rgba(0,255,65,0.05)' }}>
      {/* Title bar */}
      <div style={{ background: '#1a1a1a', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(0,255,65,0.2)' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(255,0,64,0.8)' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(255,215,0,0.8)' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(0,255,65,0.8)' }} />
        </div>
        <span style={{ color: 'rgba(0,255,65,0.6)', fontSize: '12px', marginLeft: '8px' }}>{title}</span>
        <span style={{ color: 'rgba(0,255,65,0.3)', fontSize: '12px', marginLeft: 'auto' }}>C</span>
      </div>
      
      {/* Code area */}
      <div ref={codeRef} style={{ background: '#0d0d0d', padding: '16px', maxHeight: '320px', overflowY: 'auto' }}>
        <pre style={{ fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap', margin: 0 }}>
          {highlightCode(displayedCode)}
          {!isComplete && <span className="animate-blink" style={{ color: '#00ff41' }}>▊</span>}
        </pre>
      </div>
      
      {/* Status bar */}
      <div style={{ background: '#1a1a1a', padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(0,255,65,0.2)' }}>
        <span style={{ color: 'rgba(0,255,65,0.4)', fontSize: '11px' }}>
          {isComplete ? '✓ compiled' : '⟳ compiling...'}
        </span>
        <span style={{ color: 'rgba(0,255,65,0.3)', fontSize: '11px', marginLeft: 'auto' }}>
          {displayedCode.length}/{code.length} bytes
        </span>
      </div>
    </div>
  );
}
