import { useState, useCallback, useRef } from "react";
import { questions } from "@/data/questions";
import { dimensionLabels } from "@/data/questions";
import ProgressBar from "@/components/ProgressBar";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface QuizPageProps {
  onComplete: (answers: number[]) => void;
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selecting, setSelecting] = useState<number | null>(null);
  const [xpFlash, setXpFlash] = useState<string | null>(null);
  const xpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = useCallback((optionIndex: number) => {
    if (selecting !== null) return;
    setSelecting(optionIndex);

    const question = questions[currentQ];
    const mainDim = question.dimension;

    if (xpTimerRef.current) clearTimeout(xpTimerRef.current);
    setXpFlash(`+${dimensionLabels[mainDim]}`);

    xpTimerRef.current = setTimeout(() => {
      setXpFlash(null);
      xpTimerRef.current = null;
    }, 1000);

    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQ] = optionIndex;
      setAnswers(newAnswers);
      setSelecting(null);

      if (currentQ < questions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 400);
  }, [selecting, answers, currentQ, onComplete]);

  const question = questions[currentQ];
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-0)' }}>
      <div className="sticky top-0 z-20 px-5 pt-4 pb-3" style={{ background: 'var(--bg-0)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>
              <span className="font-num">{currentQ + 1}/{questions.length}</span>
            </span>
          </div>
          <ProgressBar current={currentQ} total={questions.length} />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 py-6 max-w-lg mx-auto w-full relative" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex-1 flex flex-col gpu-accelerate"
          >
            <div className="mb-8">
              <h2 className="text-lg font-bold leading-relaxed" style={{ color: 'var(--text-strong)' }} data-testid="text-question">
                {question.text}
              </h2>
            </div>

            <div className="space-y-3 flex-1">
              {question.options.map((option, idx) => {
                const isSelected = selecting === idx;

                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut", delay: idx * 0.05 }}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(idx)}
                    className="w-full text-left p-4 rounded-2xl flex items-start gap-3 gpu-accelerate transition-colors duration-200"
                    style={{
                      background: isSelected ? 'var(--primary-soft)' : 'var(--bg-1)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                    }}
                    data-testid={`button-option-${idx}`}
                  >
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-200"
                      style={{
                        background: isSelected ? 'var(--primary)' : 'transparent',
                        color: isSelected ? '#fff' : 'var(--primary)',
                        border: isSelected ? 'none' : '1.5px solid var(--primary)',
                      }}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : optionLabels[idx]}
                    </span>
                    <span className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--text-strong)' }}>
                      {option.text}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {xpFlash && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed bottom-8 left-0 right-0 flex justify-center z-30 pointer-events-none"
            >
              <div
                className="px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{
                  background: 'var(--primary-soft)',
                  color: 'var(--primary)',
                  border: '1px solid rgba(var(--primary-rgb), 0.3)',
                  backdropFilter: 'blur(8px)',
                }}
                data-testid="text-xp-flash"
              >
                {xpFlash}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
