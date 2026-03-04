import { useState, useCallback, useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import QuizPage from "@/pages/quiz";
import LoadingPage from "@/pages/loading";
import AuthPage from "@/pages/auth";
import ResultPage from "@/pages/result";
import { calculateResult, type QuizResult } from "@/utils/calculateResult";

const ANSWERS_KEY = "quiz_answers";
const RESULT_KEY = "quiz_result";

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { type: "spring" as const, stiffness: 300, damping: 30 },
};

function loadAnswers(): number[] | null {
  try {
    const raw = sessionStorage.getItem(ANSWERS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function loadResult(): QuizResult | null {
  try {
    const raw = sessionStorage.getItem(RESULT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function Router() {
  const [location, navigate] = useLocation();
  const [quizAnswers, setQuizAnswers] = useState<number[] | null>(loadAnswers);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(loadResult);

  useEffect(() => {
    if (quizAnswers) {
      sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(quizAnswers));
    }
  }, [quizAnswers]);

  useEffect(() => {
    if (quizResult) {
      sessionStorage.setItem(RESULT_KEY, JSON.stringify(quizResult));
    }
  }, [quizResult]);

  const handleQuizComplete = useCallback((answers: number[]) => {
    setQuizAnswers(answers);
    const result = calculateResult(answers);
    setQuizResult(result);
    navigate("/loading");
  }, [navigate]);

  const handleLoadingDone = useCallback(() => {
    navigate("/auth");
  }, [navigate]);

  const handleAuthComplete = useCallback(() => {
    navigate("/result");
  }, [navigate]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        {...pageTransition}
        className="min-h-screen"
      >
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/quiz">
            <QuizPage onComplete={handleQuizComplete} />
          </Route>
          <Route path="/loading">
            {quizResult ? <LoadingPage onDone={handleLoadingDone} /> : <Redirect to="/" />}
          </Route>
          <Route path="/auth">
            {quizResult ? <AuthPage onComplete={handleAuthComplete} /> : <Redirect to="/" />}
          </Route>
          <Route path="/result">
            {quizResult ? <ResultPage result={quizResult} /> : <Redirect to="/" />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
