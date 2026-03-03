import { useState, useCallback, useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import RegisterPage from "@/pages/register";
import LoginPage from "@/pages/login";
import QuizPage from "@/pages/quiz";
import LoadingPage from "@/pages/loading";
import ResultPage from "@/pages/result";
import { calculateResult, type QuizResult } from "@/utils/calculateResult";

const ANSWERS_KEY = "quiz_answers";
const RESULT_KEY = "quiz_result";

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
  const [, navigate] = useLocation();
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
    if (quizResult) {
      navigate("/result");
    } else {
      navigate("/");
    }
  }, [quizResult, navigate]);

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/quiz">
        <QuizPage onComplete={handleQuizComplete} />
      </Route>
      <Route path="/loading">
        {quizResult ? <LoadingPage onDone={handleLoadingDone} /> : <Redirect to="/" />}
      </Route>
      <Route path="/result">
        {quizResult ? <ResultPage result={quizResult} /> : <Redirect to="/" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
