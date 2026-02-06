import { useState, useEffect, useRef, useCallback } from 'react';
import { MatrixRain } from './components/MatrixRain';
import { GameStep } from './components/GameStep';
import { steps } from './data/steps';

export function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<'boot' | 'ascii' | 'game'>('boot');
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const bootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootIndexRef = useRef(0);

  const bootSequence = [
    '[OK] Загрузка ядра системы...',
    '[OK] Инициализация терминалов...',
    '[OK] Подключение к серверу 21...',
    '[OK] Загрузка профиля пира...',
    '[OK] Обнаружено 2 терминала...',
    '[OK] Обнаружено 2 пира...',
    '[!!] ВНИМАНИЕ: один пир — лжец',
    '[OK] Загрузка модуля логики...',
    '[OK] Активация помощника 🦆...',
    '',
    '> СИСТЕМА ГОТОВА. ЗАПУСК ЗАГАДКИ...',
  ];

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setShowCursor(v => !v), 500);
    return () => clearInterval(interval);
  }, []);

  // Boot sequence - using refs to avoid StrictMode issues
  const addBootLine = useCallback(() => {
    if (bootIndexRef.current < bootSequence.length) {
      const line = bootSequence[bootIndexRef.current];
      bootIndexRef.current++;
      setBootLines(prev => [...prev, line]);
      bootTimerRef.current = setTimeout(addBootLine, 300);
    } else {
      bootTimerRef.current = setTimeout(() => {
        setPhase('ascii');
        bootTimerRef.current = setTimeout(() => {
          setPhase('game');
        }, 2000);
      }, 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bootIndexRef.current = 0;
    setBootLines([]);
    bootTimerRef.current = setTimeout(addBootLine, 500);
    return () => {
      if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
    };
  }, [addBootLine]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipBoot = () => {
    if (bootTimerRef.current) clearTimeout(bootTimerRef.current);
    setPhase('game');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] relative overflow-hidden" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* CRT Scanline overlay */}
      <div className="crt-overlay" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="border-b border-[#00ff41]/20 bg-[#0a0a0a]/90 sticky top-0 z-50" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Pixel duck icon */}
              <svg viewBox="0 0 16 16" className="w-6 h-6" style={{ imageRendering: 'pixelated' }}>
                <rect x="4" y="2" width="6" height="2" fill="#333" />
                <rect x="5" y="0" width="4" height="2" fill="#333" />
                <rect x="4" y="4" width="8" height="6" fill="#FFD700" />
                <rect x="3" y="5" width="1" height="4" fill="#FFD700" />
                <rect x="12" y="5" width="1" height="4" fill="#FFD700" />
                <rect x="10" y="6" width="1" height="1" fill="#000" />
                <rect x="12" y="7" width="3" height="1" fill="#FF8C00" />
                <rect x="12" y="8" width="2" height="1" fill="#FF8C00" />
                <rect x="4" y="10" width="8" height="4" fill="#FFD700" />
                <rect x="5" y="14" width="2" height="2" fill="#FF8C00" />
                <rect x="9" y="14" width="2" height="2" fill="#FF8C00" />
              </svg>
              <h1 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '10px' }} className="text-[#00ff41]">
                ЗАГАДКА_БАССЕЙНА.exe
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[#00ff41]/40 text-xs hidden md:block">
                [Школа 21]
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-[#00ff41]" style={{ animation: 'pulse 2s infinite' }} />
                <span className="text-[#00ff41]/60 text-xs">online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Boot sequence / ASCII / Game */}
        {phase !== 'game' ? (
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Skip button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={skipBoot}
                className="text-[#00ff41]/40 text-xs border border-[#00ff41]/20 px-3 py-1 rounded hover:text-[#00ff41] hover:border-[#00ff41]/50 transition-all"
              >
                [ESC] Пропустить
              </button>
            </div>

            <div className="bg-[#0a0a0a]/80 border border-[#00ff41]/20 rounded-lg p-6 shadow-lg" style={{ boxShadow: '0 0 20px rgba(0,255,65,0.05)' }}>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff0040]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#ffd700]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#00ff41]/80" />
                </div>
                <span className="text-[#00ff41]/40 text-xs ml-2">boot_sequence</span>
              </div>
              
              <div className="space-y-1 text-sm" style={{ minHeight: '300px' }}>
                {bootLines.map((line, i) => (
                  <div key={i} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.05}s` }}>
                    <span className={
                      line.includes('[!!]') ? 'text-[#ff0040]' :
                      line.includes('[OK]') ? 'text-[#00ff41]' :
                      line.startsWith('>') ? 'text-[#ffd700] font-bold' :
                      'text-[#00ff41]/60'
                    }>
                      {line}
                    </span>
                  </div>
                ))}
                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-[#00ff41] transition-opacity`}>▊</span>
              </div>
            </div>

            {/* ASCII art */}
            {(phase === 'ascii' || bootLines.length >= bootSequence.length) && (
              <pre className="text-[#00ff41]/20 mt-8 text-center leading-tight select-none animate-fadeInUp" style={{ fontSize: '8px' }}>
{`
    ██████╗  █████╗ ███████╗███████╗███████╗██╗███╗   ██╗
    ██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝██║████╗  ██║
    ██████╔╝███████║███████╗███████╗█████╗  ██║██╔██╗ ██║
    ██╔══██╗██╔══██║╚════██║╚════██║██╔══╝  ██║██║╚██╗██║
    ██████╔╝██║  ██║███████║███████║███████╗██║██║ ╚████║
    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝
`}
              </pre>
            )}
          </div>
        ) : (
          /* Game content */
          <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-[#0a0a0a]/80 border border-[#00ff41]/20 rounded-lg p-6 md:p-8 shadow-lg" style={{ backdropFilter: 'blur(8px)', boxShadow: '0 0 20px rgba(0,255,65,0.05)' }}>
              <GameStep
                key={currentStep}
                step={steps[currentStep]}
                onNext={handleNext}
                onPrev={handlePrev}
                isFirst={currentStep === 0}
                isLast={currentStep === steps.length - 1}
                totalSteps={steps.length}
              />
            </div>

            {/* Footer info */}
            <div className="mt-8 text-center space-y-2">
              <p className="text-[#00ff41]/20 text-xs">
                ╔══════════════════════════════════════╗
              </p>
              <p className="text-[#00ff41]/30 text-xs">
                Загадка Бассейна | Школа 21 | 2026
              </p>
              <p className="text-[#00ff41]/20 text-xs">
                Создано с 🦆 и {'<'}кодом{'>'}
              </p>
              <p className="text-[#00ff41]/20 text-xs">
                ╚══════════════════════════════════════╝
              </p>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
