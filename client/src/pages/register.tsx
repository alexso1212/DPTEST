import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Phone, Lock } from "lucide-react";
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
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col items-center justify-center px-5 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-white/40 text-sm mb-8"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">注册账号</h1>
          <p className="text-sm text-white/40">注册后即可开始交易员能力评测</p>
        </div>

        <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-5">
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">手机号</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="tel"
                placeholder="请输入手机号"
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                maxLength={11}
                {...form.register("phone")}
                data-testid="input-phone"
              />
            </div>
            {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="text-xs text-white/50 mb-1.5 block">密码</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="password"
                placeholder="设置密码（至少6位）"
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
                {...form.register("password")}
                data-testid="input-password"
              />
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full h-12 rounded-xl font-semibold text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white active:scale-[0.98] transition-transform disabled:opacity-50"
            data-testid="button-register"
          >
            {registerMutation.isPending ? "注册中..." : "注册并开始测评"}
          </button>
        </form>

        <p className="text-center text-xs text-white/30 mt-6">
          已有账号？
          <button
            className="text-blue-400 ml-1 underline underline-offset-2"
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
