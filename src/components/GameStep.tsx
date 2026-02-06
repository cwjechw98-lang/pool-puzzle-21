import { useState } from 'react';
import type { Step } from '../data/steps';
import { TerminalWindow } from './TerminalWindow';
import { PixelDuck } from './PixelDuck';

interface GameStepProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  totalSteps: number;
}

export function GameStep({ step, onNext, onPrev, isFirst, isLast, totalSteps }: GameStepProps) {
  const [showCode, setShowCode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleInteraction = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
  };

  const renderInteraction = () => {
    switch (step.interaction) {
      case 'intro':
        return (
          <button
            onClick={() => { setShowCode(true); }}
            className="animate-pulse-glow rounded"
            style={{
              padding: '16px 32px',
              background: 'transparent',
              border: '2px solid #00ff41',
              color: '#00ff41',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#00ff41'; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#00ff41'; }}
          >
            {'>'} ЗАПУСТИТЬ ПРОТОКОЛ {'<'}
          </button>
        );
      
      case 'choice':
        return (
          <div className="space-y-4">
            <p className="text-sm mb-4" style={{ color: 'rgba(0,255,65,0.7)' }}>
              Можно ли просто спросить пира: «Какой терминал счастливый?»
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => handleInteraction('yes')}
                className={selectedAnswer === 'yes' ? 'animate-shake' : ''}
                style={{
                  padding: '12px 24px',
                  border: `2px solid ${selectedAnswer === 'yes' ? '#ff0040' : 'rgba(0,255,65,0.5)'}`,
                  background: selectedAnswer === 'yes' ? 'rgba(255,0,64,0.2)' : 'transparent',
                  color: selectedAnswer === 'yes' ? '#ff0040' : 'rgba(0,255,65,0.7)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                [Y] Да, этого достаточно
              </button>
              <button
                onClick={() => { handleInteraction('no'); setShowCode(true); }}
                style={{
                  padding: '12px 24px',
                  border: `2px solid ${selectedAnswer === 'no' ? '#00ff41' : 'rgba(0,255,65,0.5)'}`,
                  background: selectedAnswer === 'no' ? 'rgba(0,255,65,0.2)' : 'transparent',
                  color: selectedAnswer === 'no' ? '#00ff41' : 'rgba(0,255,65,0.7)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                [N] Нет, это не сработает
              </button>
            </div>
            {showResult && selectedAnswer === 'yes' && (
              <div className="animate-fadeInUp" style={{ marginTop: '16px', padding: '12px', border: '1px solid rgba(255,0,64,0.5)', borderRadius: '6px', background: 'rgba(255,0,64,0.1)' }}>
                <p style={{ color: '#ff0040', fontSize: '14px' }}>
                  ✗ Неверно! Если пир — лжец, он укажет на провальный терминал. 
                  Мы не знаем, кто перед нами, значит ответ бесполезен.
                </p>
              </div>
            )}
            {showResult && selectedAnswer === 'no' && (
              <div className="animate-fadeInUp" style={{ marginTop: '16px', padding: '12px', border: '1px solid rgba(0,255,65,0.5)', borderRadius: '6px', background: 'rgba(0,255,65,0.1)' }}>
                <p style={{ color: '#00ff41', fontSize: '14px' }}>
                  ✓ Верно! Прямой вопрос не даёт гарантии. Нужна хитрость!
                </p>
              </div>
            )}
          </div>
        );

      case 'question':
        return (
          <div className="space-y-4">
            <p className="text-sm mb-4" style={{ color: 'rgba(0,255,65,0.7)' }}>
              Выбери правильный мета-вопрос:
            </p>
            <div className="space-y-3">
              {[
                { id: 'a', text: '«Ты врёшь или говоришь правду?»', correct: false },
                { id: 'b', text: '«Какой терминал, по мнению ВТОРОГО пира, ведёт к успешной сдаче?»', correct: true },
                { id: 'c', text: '«Какой терминал ведёт к провалу?»', correct: false },
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => { handleInteraction(option.id); if (option.correct) setShowCode(true); }}
                  className={selectedAnswer === option.id && !option.correct ? 'animate-shake' : ''}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    border: `1px solid ${
                      selectedAnswer === option.id
                        ? option.correct ? '#00ff41' : '#ff0040'
                        : 'rgba(0,255,65,0.3)'
                    }`,
                    borderRadius: '6px',
                    background: selectedAnswer === option.id
                      ? option.correct ? 'rgba(0,255,65,0.2)' : 'rgba(255,0,64,0.2)'
                      : 'transparent',
                    color: selectedAnswer === option.id
                      ? option.correct ? '#00ff41' : '#ff0040'
                      : 'rgba(0,255,65,0.7)',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'block',
                  }}
                >
                  [{option.id.toUpperCase()}] {option.text}
                </button>
              ))}
            </div>
            {showResult && selectedAnswer && selectedAnswer !== 'b' && (
              <div className="animate-fadeInUp" style={{ marginTop: '16px', padding: '12px', border: '1px solid rgba(255,0,64,0.5)', borderRadius: '6px', background: 'rgba(255,0,64,0.1)' }}>
                <p style={{ color: '#ff0040', fontSize: '14px' }}>
                  ✗ Этот вопрос не использует двойную инверсию. Попробуй другой!
                </p>
              </div>
            )}
            {showResult && selectedAnswer === 'b' && (
              <div className="animate-fadeInUp" style={{ marginTop: '16px', padding: '12px', border: '1px solid rgba(0,255,65,0.5)', borderRadius: '6px', background: 'rgba(0,255,65,0.1)' }}>
                <p style={{ color: '#00ff41', fontSize: '14px' }}>
                  ✓ Именно! Мета-вопрос задействует ОБОИХ пиров, создавая двойную инверсию!
                </p>
              </div>
            )}
          </div>
        );

      case 'analysis':
      case 'liar':
        return (
          <div className="space-y-4">
            <button
              onClick={() => setShowCode(true)}
              style={{
                padding: '12px 24px',
                border: '2px solid #00d4ff',
                color: '#00d4ff',
                background: 'transparent',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {'>'} Показать разбор в коде
            </button>
            {step.interaction === 'analysis' && (
              <div style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(255,215,0,0.3)', borderRadius: '6px', background: 'rgba(255,215,0,0.05)' }}>
                <p style={{ color: '#ffd700', fontSize: '14px' }}>
                  💡 Правдивый пир честно скажет, что лжец указал бы на ПРОВАЛЬНЫЙ.
                  <br />Ответ: «ПРОВАЛЬНЫЙ» → выбираем противоположный!
                </p>
              </div>
            )}
            {step.interaction === 'liar' && (
              <div style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(180,74,255,0.3)', borderRadius: '6px', background: 'rgba(180,74,255,0.05)' }}>
                <p style={{ color: '#b44aff', fontSize: '14px' }}>
                  💡 Лжец соврёт, что правдивый указал бы на ПРОВАЛЬНЫЙ.
                  <br />Ответ: «ПРОВАЛЬНЫЙ» → тот же результат!
                </p>
              </div>
            )}
          </div>
        );

      case 'solution':
        return (
          <div className="space-y-4">
            <button
              onClick={() => setShowCode(true)}
              style={{
                padding: '12px 24px',
                border: '2px solid #b44aff',
                color: '#b44aff',
                background: 'transparent',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,74,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {'>'} Показать доказательство
            </button>
            <div className="animate-fadeInUp" style={{ marginTop: '16px', padding: '16px', border: '1px solid rgba(0,255,65,0.3)', borderRadius: '6px', background: 'rgba(0,255,65,0.05)' }}>
              <div className="space-y-2" style={{ fontSize: '14px' }}>
                <p style={{ color: '#00ff41' }}>📐 Математически:</p>
                <p style={{ color: '#00d4ff', marginLeft: '16px' }}>Правда(Ложь(x)) = НЕ(x)</p>
                <p style={{ color: '#b44aff', marginLeft: '16px' }}>Ложь(Правда(x)) = НЕ(x)</p>
                <p style={{ color: '#ffd700', marginTop: '8px' }}>Оба случая = инверсия!</p>
              </div>
            </div>
          </div>
        );

      case 'finale':
        return (
          <div className="space-y-6">
            {showConfetti && (
              <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${Math.random() * 100}%`,
                      top: `-20px`,
                      width: '10px',
                      height: '10px',
                      background: ['#00ff41', '#ffd700', '#00d4ff', '#b44aff', '#ff0040'][i % 5],
                      borderRadius: i % 2 === 0 ? '50%' : '0',
                      animation: `confetti-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s forwards`,
                    }}
                  />
                ))}
              </div>
            )}
            <button
              onClick={() => { setShowCode(true); setShowConfetti(true); }}
              className="animate-pulse-glow"
              style={{
                padding: '16px 32px',
                background: '#00ff41',
                color: '#000',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '11px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ffd700'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#00ff41'; }}
            >
              🦆 ПОКАЗАТЬ ФИНАЛЬНОЕ РЕШЕНИЕ
            </button>
            {showCode && (
              <div className="animate-fadeInUp" style={{ marginTop: '16px', padding: '24px', border: '2px solid #00ff41', borderRadius: '6px', background: 'rgba(0,255,65,0.05)' }}>
                <div className="text-center space-y-3">
                  <p style={{ color: '#ffd700', fontSize: '18px', fontWeight: 'bold' }}>🎓 ЗАГАДКА РЕШЕНА!</p>
                  <div style={{ color: '#00ff41', fontSize: '14px' }} className="space-y-2">
                    <p>1️⃣ Подойди к ЛЮБОМУ пиру</p>
                    <p>2️⃣ Спроси: «Что скажет ВТОРОЙ пир?»</p>
                    <p>3️⃣ Выбери ПРОТИВОПОЛОЖНЫЙ терминал</p>
                  </div>
                  <p style={{ color: '#00d4ff', fontSize: '12px', marginTop: '16px' }}>{'>'} Двойная инверсия гарантирует успех {'<'}</p>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="animate-fadeInUp space-y-6">
      {/* Step title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '11px', color: '#00ff41' }}>
            [{step.id + 1}/{totalSteps}]
          </span>
          <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '12px', color: '#00ff41' }}>
            {step.title}
          </h2>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', background: 'rgba(0,255,65,0.1)', height: '4px', borderRadius: '4px', overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            background: '#00ff41', 
            transition: 'width 0.5s', 
            borderRadius: '4px',
            width: `${((step.id + 1) / totalSteps) * 100}%`,
          }}
        />
      </div>

      {/* Duck assistant */}
      <PixelDuck message={step.duckMessage} size="md" />

      {/* Interactive section */}
      <div style={{ paddingLeft: '16px', borderLeft: '2px solid rgba(0,255,65,0.3)' }}>
        {renderInteraction()}
      </div>

      {/* Code terminal */}
      {showCode && step.interaction !== 'finale' && (
        <div style={{ marginTop: '24px' }}>
          <TerminalWindow 
            title={step.codeTitle} 
            code={step.code} 
            typingSpeed={10}
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center" style={{ paddingTop: '16px', borderTop: '1px solid rgba(0,255,65,0.2)' }}>
        <button
          onClick={() => { onPrev(); }}
          disabled={isFirst}
          style={{
            padding: '8px 16px',
            border: `1px solid ${isFirst ? 'rgba(0,255,65,0.2)' : 'rgba(0,255,65,0.5)'}`,
            color: isFirst ? 'rgba(0,255,65,0.2)' : '#00ff41',
            background: 'transparent',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: isFirst ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
          }}
        >
          {'<'} Назад
        </button>
        
        <span style={{ color: 'rgba(0,255,65,0.4)', fontSize: '12px' }}>
          шаг {step.id + 1} из {totalSteps}
        </span>

        <button
          onClick={() => { onNext(); }}
          disabled={isLast}
          style={{
            padding: '8px 16px',
            border: `1px solid ${isLast ? 'rgba(0,255,65,0.2)' : 'rgba(0,255,65,0.5)'}`,
            color: isLast ? 'rgba(0,255,65,0.2)' : '#00ff41',
            background: 'transparent',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: isLast ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s',
          }}
        >
          Далее {'>'}
        </button>
      </div>
    </div>
  );
}
