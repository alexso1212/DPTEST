import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSurveySchema, type InsertSurvey } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Send, Building2, User, Briefcase, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const industries = [
  "互联网/IT", "金融", "制造业", "教育", "医疗健康",
  "房地产", "零售/电商", "物流/供应链", "文化/传媒", "其他",
];

const companySizes = [
  "1-10人", "11-50人", "51-200人", "201-500人", "500人以上",
];

const challengeOptions = [
  "获客成本高", "团队管理效率低", "数字化转型困难",
  "品牌影响力不足", "供应链管理复杂", "人才招聘困难",
  "市场竞争激烈", "资金压力大",
];

const improvementOptions = [
  "营销获客", "团队管理", "产品研发", "品牌建设",
  "数字化转型", "财务管理", "战略规划", "人才培养",
];

const budgetOptions = [
  "5万以下", "5-20万", "20-50万", "50-100万", "100万以上",
];

const timelineOptions = [
  "1个月内", "1-3个月", "3-6个月", "6个月-1年", "1年以上",
];

const steps = [
  { title: "基本信息", icon: User, desc: "您的个人及公司信息" },
  { title: "业务挑战", icon: Target, desc: "当前面临的核心挑战" },
  { title: "精进目标", icon: Briefcase, desc: "未来发展方向规划" },
];

export default function SurveyPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/register");
    }
    if (!isLoading && user?.hasSurvey) {
      navigate("/complete");
    }
  }, [user, isLoading, navigate]);

  const form = useForm<InsertSurvey>({
    resolver: zodResolver(insertSurveySchema),
    defaultValues: {
      name: "",
      company: "",
      position: "",
      industry: "",
      companySize: "",
      challenges: [],
      improvementAreas: [],
      budget: "",
      timeline: "",
      additionalNotes: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertSurvey) => {
      const res = await apiRequest("POST", "/api/survey", data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "提交成功", description: "感谢您完成测评！" });
      navigate("/complete");
    },
    onError: (err: Error) => {
      const msg = err.message.replace(/^\d+:\s*/, "");
      toast({ title: "提交失败", description: msg, variant: "destructive" });
    },
  });

  const validateStep = async () => {
    if (step === 0) {
      const valid = await form.trigger(["name", "company", "position", "industry", "companySize"]);
      return valid;
    }
    if (step === 1) {
      const valid = await form.trigger(["challenges"]);
      return valid;
    }
    if (step === 2) {
      const valid = await form.trigger(["improvementAreas", "budget", "timeline"]);
      return valid;
    }
    return true;
  };

  const handleNext = async () => {
    const valid = await validateStep();
    if (valid && step < 2) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  const progress = ((step + 1) / 3) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b px-4 py-3">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">企业成长力测评</span>
            </div>
            <span className="text-xs text-muted-foreground">{step + 1} / 3</span>
          </div>
          <Progress value={progress} className="h-1.5" data-testid="progress-bar" />
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`flex-1 flex items-center gap-2 p-2.5 rounded-lg transition-colors ${
                i === step
                  ? "bg-primary/10 text-primary"
                  : i < step
                    ? "bg-accent/50 text-accent-foreground"
                    : "text-muted-foreground"
              }`}
            >
              <s.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-medium truncate hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => submitMutation.mutate(data))}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">{steps[0].title}</h2>
                    <p className="text-sm text-muted-foreground">{steps[0].desc}</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>姓名</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入您的姓名" {...field} data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>公司名称</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入公司名称" {...field} data-testid="input-company" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>职位</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入您的职位" {...field} data-testid="input-position" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>所在行业</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-industry">
                              <SelectValue placeholder="请选择行业" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {industries.map((ind) => (
                              <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>公司规模</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-company-size">
                              <SelectValue placeholder="请选择公司规模" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {companySizes.map((size) => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">{steps[1].title}</h2>
                    <p className="text-sm text-muted-foreground">{steps[1].desc}</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="challenges"
                    render={() => (
                      <FormItem>
                        <FormLabel>您当前面临的主要业务挑战（可多选）</FormLabel>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {challengeOptions.map((option) => (
                            <FormField
                              key={option}
                              control={form.control}
                              name="challenges"
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2 p-3 rounded-lg border bg-card/50 cursor-pointer transition-colors has-[:checked]:bg-primary/5 has-[:checked]:border-primary/30">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        field.onChange(
                                          checked
                                            ? [...current, option]
                                            : current.filter((v: string) => v !== option)
                                        );
                                      }}
                                      data-testid={`checkbox-challenge-${option}`}
                                    />
                                  </FormControl>
                                  <span className="text-sm leading-tight">{option}</span>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold">{steps[2].title}</h2>
                    <p className="text-sm text-muted-foreground">{steps[2].desc}</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="improvementAreas"
                    render={() => (
                      <FormItem>
                        <FormLabel>您希望精进的领域（可多选）</FormLabel>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {improvementOptions.map((option) => (
                            <FormField
                              key={option}
                              control={form.control}
                              name="improvementAreas"
                              render={({ field }) => (
                                <FormItem className="flex items-center gap-2 p-3 rounded-lg border bg-card/50 cursor-pointer transition-colors has-[:checked]:bg-primary/5 has-[:checked]:border-primary/30">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        field.onChange(
                                          checked
                                            ? [...current, option]
                                            : current.filter((v: string) => v !== option)
                                        );
                                      }}
                                      data-testid={`checkbox-improvement-${option}`}
                                    />
                                  </FormControl>
                                  <span className="text-sm leading-tight">{option}</span>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>预算范围</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-budget">
                              <SelectValue placeholder="请选择预算范围" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {budgetOptions.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>期望启动时间</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-timeline">
                              <SelectValue placeholder="请选择期望时间" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timelineOptions.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>其他补充说明（选填）</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="请描述您的具体需求或其他补充信息..."
                            className="resize-none min-h-[80px]"
                            {...field}
                            value={field.value ?? ""}
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-3 mt-8 pt-4 border-t">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  className="flex-1"
                  data-testid="button-prev"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  上一步
                </Button>
              )}
              {step < 2 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                  data-testid="button-next"
                >
                  下一步
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? "提交中..." : "提交问卷"}
                  <Send className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
