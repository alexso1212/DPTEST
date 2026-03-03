import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { questions } from "@/data/questions";
import ProgressBar from "@/components/ProgressBar";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface QuizPageProps {
  onComplete: (answers: number[]) => void;
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selecting, setSelecting] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/register");
    }
  }, [user, isLoading, navigate]);

  const handleSelect = useCallback((optionIndex: number) => {
    if (selecting !== null) return;
    setSelecting(optionIndex);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="animate-pulse" style={{ color: 'var(--text-secondary)' }}>加载中...</div>
      </div>
    );
  }

  const question = questions[currentQ];
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <div className="sticky top-0 z-20 px-5 pt-4 pb-3" style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              第 <span className="font-num">{currentQ + 1}/{questions.length}</span> 题
            </span>
          </div>
          <ProgressBar current={currentQ} total={questions.length} />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 py-6 max-w-lg mx-auto w-full" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col gpu-accelerate"
          >
            <div className="mb-8">
              <h2 className="text-lg font-bold leading-relaxed" style={{ color: 'var(--text-primary)' }} data-testid="text-question">
                {question.text}
              </h2>
            </div>

            <div className="space-y-3 flex-1">
              {question.options.map((option, idx) => {
                const isSelected = selecting === idx;

                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.3 }}
                    onClick={() => handleSelect(idx)}
                    className="w-full text-left p-4 rounded-xl transition-all duration-200 flex items-start gap-3 active:scale-[0.98] gpu-accelerate"
                    style={{
                      background: isSelected ? 'rgba(var(--accent-gold-rgb), 0.1)' : 'var(--bg-card)',
                      border: isSelected ? '1px solid var(--accent-gold)' : '1px solid var(--border-color)',
                    }}
                    data-testid={`button-option-${idx}`}
                  >
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors"
                      style={{
                        background: isSelected ? 'var(--accent-gold)' : 'transparent',
                        color: isSelected ? '#000' : 'var(--accent-gold)',
                        border: isSelected ? 'none' : '1.5px solid var(--accent-gold)',
                      }}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : optionLabels[idx]}
                    </span>
                    <span className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--text-primary)' }}>
                      {option.text}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
