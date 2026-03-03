import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, UserPlus, Phone, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { phone: "", password: "" },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      toast({ title: "注册成功", description: "欢迎您！请完成测评问卷" });
      navigate("/survey");
    },
    onError: (err: Error) => {
      let msg = "注册失败，请重试";
      if (err.message.includes("409")) {
        msg = "该手机号已注册，请直接登录";
      } else {
        try {
          const jsonStr = err.message.replace(/^\d+:\s*/, "");
          const parsed = JSON.parse(jsonStr);
          msg = parsed.message || msg;
        } catch { msg = err.message.replace(/^\d+:\s*/, ""); }
      }
      toast({ title: "注册失败", description: msg, variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-muted-foreground text-sm mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <Card>
          <CardHeader className="text-center pb-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mx-auto mb-3">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <CardTitle className="text-xl">注册账号</CardTitle>
            <CardDescription>输入手机号和密码完成注册</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-5">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>手机号</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="请输入手机号"
                            className="pl-10"
                            maxLength={11}
                            {...field}
                            data-testid="input-phone"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="设置密码（至少6位）"
                            className="pl-10"
                            {...field}
                            data-testid="input-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  size="lg"
                  className="w-full py-6"
                  disabled={registerMutation.isPending}
                  data-testid="button-register"
                >
                  {registerMutation.isPending ? "注册中..." : "注册并开始测评"}
                </Button>
              </form>
            </Form>
            <p className="text-center text-xs text-muted-foreground mt-5">
              已有账号？
              <button
                className="text-primary ml-1 underline underline-offset-2"
                onClick={() => navigate("/login")}
                data-testid="link-to-login"
              >
                直接登录
              </button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
