import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/ThemeProvider";
import { ArrowLeft, Phone, Lock, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import logoImg from "@assets/IMG_2951_1772566874804.jpeg";

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { phone: "", password: "" },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertUser) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      await queryClient.refetchQueries({ queryKey: ["/api/me"] });
      toast({ title: "注册成功", description: "开始你的交易员能力测评！" });
      navigate("/quiz");
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

  const errors = form.formState.errors;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} /> : <Moon className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm mb-8"
          style={{ color: 'var(--text-secondary)' }}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="text-center mb-8">
          <img src={logoImg} alt="Deltapex" className="h-8 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>注册账号</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>注册后即可开始交易员能力评测</p>
        </div>

        <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-5">
          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>手机号</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
              <input
                type="tel"
                placeholder="请输入手机号"
                className="w-full h-12 pl-11 pr-4 rounded-xl text-sm focus:outline-none transition-colors"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                maxLength={11}
                {...form.register("phone")}
                data-testid="input-phone"
              />
            </div>
            {errors.phone && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.phone.message}</p>}
          </div>

          <div>
            <label className="text-xs mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>密码</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
              <input
                type="password"
                placeholder="设置密码（至少6位）"
                className="w-full h-12 pl-11 pr-4 rounded-xl text-sm focus:outline-none transition-colors"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
                {...form.register("password")}
                data-testid="input-password"
              />
            </div>
            {errors.password && <p className="text-xs mt-1" style={{ color: 'var(--danger)' }}>{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full h-12 rounded-xl font-bold text-sm text-black active:scale-[0.97] transition-transform disabled:opacity-50"
            style={{ background: 'var(--accent-gold)' }}
            data-testid="button-register"
          >
            {registerMutation.isPending ? "注册中..." : "注册并开始测评"}
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--text-secondary)' }}>
          已有账号？
          <button
            className="ml-1 underline underline-offset-2"
            style={{ color: 'var(--accent-blue)' }}
            onClick={() => navigate("/login")}
            data-testid="link-to-login"
          >
            直接登录
          </button>
        </p>
      </motion.div>
    </div>
  );
}
