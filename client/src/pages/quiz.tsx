import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { questions } from "@/data/questions";
import ProgressBar from "@/components/ProgressBar";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface QuizPageProps {
  onComplete: (answers: number[]) => void;
}

export default function QuizPage({ onComplete }: QuizPageProps) {
  const [, navigate] = useLocation();
  const { user, isLoading } = useAuth();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [direction, setDirection] = useState(1);
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
        setDirection(1);
        setCurrentQ(currentQ + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 300);
  }, [selecting, answers, currentQ, onComplete]);

  const handleBack = () => {
    if (currentQ > 0) {
      setDirection(-1);
      setCurrentQ(currentQ - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-white/40 animate-pulse">加载中...</div>
      </div>
    );
  }

  const question = questions[currentQ];
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/5 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>

      <div className="relative z-10 sticky top-0 bg-[#0a0e1a]/90 backdrop-blur-md px-5 pt-4 pb-3 border-b border-white/5">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-3">
            {currentQ > 0 && (
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-white/50"
                data-testid="button-quiz-back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex-1">
              <ProgressBar current={currentQ} total={questions.length} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col px-5 py-6 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQ}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -60 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-[10px] text-white/40 font-medium mb-4 uppercase tracking-wider">
                Q{currentQ + 1}
              </div>
              <h2 className="text-lg font-semibold leading-relaxed text-white/90" data-testid="text-question">
                {question.text}
              </h2>
            </div>

            <div className="space-y-3 flex-1">
              {question.options.map((option, idx) => {
                const isSelected = selecting === idx;
                const wasAnswered = answers[currentQ] === idx;

                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-500/20 border-blue-400/50 text-white"
                        : wasAnswered
                          ? "bg-white/[0.06] border-white/15 text-white/80"
                          : "bg-white/[0.03] border-white/[0.06] text-white/70"
                    }`}
                    data-testid={`button-option-${idx}`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-white/10 text-white/40"
                        }`}
                      >
                        {optionLabels[idx]}
                      </span>
                      <span className="text-sm leading-relaxed pt-0.5">
                        {option.text}
                      </span>
                    </div>
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
