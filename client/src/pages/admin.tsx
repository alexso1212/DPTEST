import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Plus, Trash2, Activity, Power, PowerOff, RefreshCw, Shield, ArrowLeft, X, BarChart3, Eye, UserPlus, MessageSquare, Users, TrendingUp, Pencil, Check, Clock, Copy, Search, Download, Phone, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SalesContact {
  id: number;
  name: string;
  url: string;
  enabled: boolean;
  lastHealthCheck: string | null;
  lastHealthStatus: string | null;
  createdAt: string;
}

interface StatsOverview {
  total_views: string;
  total_registers: string;
  total_wechat_clicks: string;
  total_assigns: string;
  total_quiz_completes: string;
  today_views: string;
  today_registers: string;
  today_wechat_clicks: string;
  week_views: string;
  week_registers: string;
  week_wechat_clicks: string;
  total_unique_visitors: string;
  today_unique_visitors: string;
}

interface ContactStat {
  contact_name: string;
  assign_count: string;
}

interface DailyTrend {
  date: string;
  views: string;
  registers: string;
  wechat_clicks: string;
}

interface FunnelData {
  step_view: string;
  step_register: string;
  step_quiz: string;
  step_wechat: string;
}

interface TraderType {
  type_code: string;
  count: string;
}

interface HourlyData {
  hour: string;
  count: string;
}

interface StatsData {
  overview: StatsOverview;
  contactStats: ContactStat[];
  dailyTrend: DailyTrend[];
  funnel: FunnelData;
  traderTypes: TraderType[];
  hourlyDistribution: HourlyData[];
}

interface AdminUser {
  id: number;
  phone: string;
  nickname: string | null;
  wechat_id: string | null;
  source: string | null;
  tier: number;
  login_days: number;
  last_login_date: string | null;
  last_active_at: string | null;
  created_at: string;
  trader_type_code: string | null;
  avg_score: number | null;
  rank_name: string | null;
  scores: Record<string, number> | null;
  quiz_completed_at: string | null;
}

const TRADER_TYPE_NAMES: Record<string, string> = {
  RS: "风险猎手", RM: "稳健策略师", RT: "技术分析师", RI: "直觉交易者",
  AS: "激进狙击手", AM: "平衡操盘手", AT: "量化分析师", AI: "灵感交易者",
  DS: "防守大师", DM: "保守管理者", DT: "数据矿工", DI: "感知守护者",
  ES: "情绪冲浪者", EM: "心态教练", ET: "系统执行者", EI: "市场哲学家",
};

function StatusDot({ status }: { status: string | null }) {
  const color = status === "ok" ? "#07C160" : status === "dead" ? "#EF4444" : "#6B7280";
  const label = status === "ok" ? "正常" : status === "dead" ? "异常" : "未检测";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span className="text-xs" style={{ color }}>{label}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subValue, color }: {
  icon: typeof Eye;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
}) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
      </div>
      <div className="text-xl font-bold" style={{ color: 'var(--text-strong)' }} data-testid={`stat-${label}`}>
        {value}
      </div>
      {subValue && (
        <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{subValue}</div>
      )}
    </div>
  );
}

function FunnelChart({ funnel }: { funnel: FunnelData }) {
  const steps = [
    { label: "浏览", value: parseInt(funnel.step_view) || 0, color: "#3B82F6" },
    { label: "注册", value: parseInt(funnel.step_register) || 0, color: "#07C160" },
    { label: "完成测评", value: parseInt(funnel.step_quiz) || 0, color: "#8B5CF6" },
    { label: "添加客服", value: parseInt(funnel.step_wechat) || 0, color: "#F59E0B" },
  ];
  const maxVal = Math.max(steps[0].value, 1);

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4" style={{ color: 'var(--gold)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>转化漏斗</span>
      </div>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const pct = (step.value / maxVal) * 100;
          const convRate = i > 0 && steps[i - 1].value > 0
            ? ((step.value / steps[i - 1].value) * 100).toFixed(1)
            : null;
          return (
            <div key={step.label} data-testid={`funnel-${step.label}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-strong)' }}>{step.label}</span>
                  {convRate && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
                      {convRate}%
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium" style={{ color: step.color }}>{step.value}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: step.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TraderTypeChart({ types }: { types: TraderType[] }) {
  if (types.length === 0) return null;
  const total = types.reduce((sum, t) => sum + (parseInt(t.count) || 0), 0);
  const colors = ["#F59E0B", "#3B82F6", "#07C160", "#8B5CF6", "#EF4444", "#EC4899", "#14B8A6", "#F97316"];

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-4 h-4" style={{ color: 'var(--gold)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>交易者类型分布</span>
      </div>
      <div className="space-y-2">
        {types.map((t, i) => {
          const count = parseInt(t.count) || 0;
          const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
          const color = colors[i % colors.length];
          const name = TRADER_TYPE_NAMES[t.type_code] || t.type_code;
          return (
            <div key={t.type_code} data-testid={`type-${t.type_code}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium" style={{ color }}>{t.type_code}</span>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{name}</span>
                </div>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${parseFloat(pct)}%` }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HourlyChart({ data }: { data: HourlyData[] }) {
  if (data.length === 0) return null;
  const hours = Array.from({ length: 24 }, (_, i) => {
    const found = data.find(d => parseInt(d.hour) === i);
    return { hour: i, count: found ? parseInt(found.count) || 0 : 0 };
  });
  const maxCount = Math.max(...hours.map(h => h.count), 1);

  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4" style={{ color: 'var(--gold)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>访问时段分布（近7天）</span>
      </div>
      <div className="flex items-end gap-[2px] h-20">
        {hours.map(h => {
          const heightPct = (h.count / maxCount) * 100;
          const isHigh = h.count >= maxCount * 0.7;
          return (
            <div key={h.hour} className="flex-1 flex flex-col items-center justify-end h-full" title={`${h.hour}:00 - ${h.count} 次`}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(heightPct, 2)}%` }}
                transition={{ duration: 0.4, delay: h.hour * 0.02 }}
                className="w-full rounded-t-sm"
                style={{ background: isHigh ? 'var(--gold)' : 'rgba(var(--gold-rgb), 0.3)', minHeight: '1px' }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>0:00</span>
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>6:00</span>
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>12:00</span>
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>18:00</span>
        <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>23:00</span>
      </div>
    </div>
  );
}

function StatsPanel({ stats, loading }: { stats: StatsData | null; loading: boolean }) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 mx-auto rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
        <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>加载统计数据...</p>
      </div>
    );
  }

  if (!stats) return null;

  const o = stats.overview;
  const totalViews = parseInt(o.total_views) || 0;
  const totalRegisters = parseInt(o.total_registers) || 0;
  const totalClicks = parseInt(o.total_wechat_clicks) || 0;
  const totalAssigns = parseInt(o.total_assigns) || 0;
  const totalQuiz = parseInt(o.total_quiz_completes) || 0;
  const todayViews = parseInt(o.today_views) || 0;
  const todayRegisters = parseInt(o.today_registers) || 0;
  const todayClicks = parseInt(o.today_wechat_clicks) || 0;
  const uniqueVisitors = parseInt(o.total_unique_visitors) || 0;

  return (
    <div className="space-y-4" data-testid="stats-panel">
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Eye}
          label="总浏览量"
          value={totalViews.toLocaleString()}
          subValue={`今日 ${todayViews} / 独立访客 ${uniqueVisitors}`}
          color="#3B82F6"
        />
        <StatCard
          icon={UserPlus}
          label="总注册量"
          value={totalRegisters.toLocaleString()}
          subValue={`今日 ${todayRegisters}`}
          color="#07C160"
        />
        <StatCard
          icon={MessageSquare}
          label="添加客服点击"
          value={totalClicks.toLocaleString()}
          subValue={`今日 ${todayClicks}`}
          color="#F59E0B"
        />
        <StatCard
          icon={Users}
          label="客服分配次数"
          value={totalAssigns.toLocaleString()}
          subValue={`测评完成 ${totalQuiz}`}
          color="#8B5CF6"
        />
      </div>

      {stats.funnel && <FunnelChart funnel={stats.funnel} />}

      {stats.contactStats.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4" style={{ color: 'var(--gold)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>顾问分配统计</span>
          </div>
          <div className="space-y-2">
            {stats.contactStats.map((cs) => {
              const count = parseInt(cs.assign_count) || 0;
              const maxCount = Math.max(...stats.contactStats.map(s => parseInt(s.assign_count) || 0), 1);
              const pct = (count / maxCount) * 100;
              return (
                <div key={cs.contact_name} data-testid={`stat-contact-${cs.contact_name}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text-strong)' }}>{cs.contact_name}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--gold)' }}>{count} 次</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: 'var(--gold)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {stats.traderTypes && <TraderTypeChart types={stats.traderTypes} />}
      {stats.hourlyDistribution && <HourlyChart data={stats.hourlyDistribution} />}

      {stats.dailyTrend.length > 0 && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4" style={{ color: 'var(--gold)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>近期趋势（最近7天）</span>
          </div>
          <div className="space-y-1.5">
            {stats.dailyTrend.slice(0, 7).map((d) => (
              <div key={d.date} className="flex items-center gap-3 text-[11px]" data-testid={`stat-day-${d.date}`}>
                <span className="w-20 shrink-0" style={{ color: 'var(--text-muted)' }}>
                  {new Date(d.date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                </span>
                <div className="flex items-center gap-3 flex-1">
                  <span style={{ color: '#3B82F6' }}>
                    <Eye className="w-3 h-3 inline mr-0.5" />{d.views}
                  </span>
                  <span style={{ color: '#07C160' }}>
                    <UserPlus className="w-3 h-3 inline mr-0.5" />{d.registers}
                  </span>
                  <span style={{ color: '#F59E0B' }}>
                    <MessageSquare className="w-3 h-3 inline mr-0.5" />{d.wechat_clicks}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-1 text-[10px]" style={{ color: '#3B82F6' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#3B82F6' }} /> 浏览
            </div>
            <div className="flex items-center gap-1 text-[10px]" style={{ color: '#07C160' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#07C160' }} /> 注册
            </div>
            <div className="flex items-center gap-1 text-[10px]" style={{ color: '#F59E0B' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} /> 添加客服
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const TIER_NAMES: Record<number, string> = { 0: "学徒", 1: "交易者", 2: "精英", 3: "职业操盘手" };

function UsersPanel({ users, loading, onRefresh }: { users: AdminUser[]; loading: boolean; onRefresh: () => void }) {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = users.filter(u => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.phone.includes(q) ||
      (u.nickname && u.nickname.toLowerCase().includes(q)) ||
      (u.wechat_id && u.wechat_id.toLowerCase().includes(q)) ||
      (u.trader_type_code && (TRADER_TYPE_NAMES[u.trader_type_code] || u.trader_type_code).toLowerCase().includes(q))
    );
  });

  const copyText = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(text);
      toast({ title: `${label} 已复制` });
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(text);
      toast({ title: `${label} 已复制` });
      setTimeout(() => setCopiedId(null), 1500);
    }
  }, [toast]);

  const exportCSV = useCallback(() => {
    const escapeCSV = (val: string | number | null | undefined): string => {
      if (val == null || val === "") return '""';
      const s = String(val);
      if (/^[=+\-@\t\r]/.test(s)) return `"'${s.replace(/"/g, '""')}"`;
      if (s.includes(",") || s.includes('"') || s.includes("\n")) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };
    const DIMENSION_NAMES: Record<string, string> = {
      EDGE: "认知格局", EXEC: "执行力", RISK: "风险管理",
      ADAPT: "市场适应", MENTAL: "交易心理", SYSTEM: "系统思维",
    };
    const DIMENSIONS = ["EDGE", "EXEC", "RISK", "ADAPT", "MENTAL", "SYSTEM"];
    const getWeakest = (scores: Record<string, number> | null) => {
      if (!scores) return "";
      const entries = DIMENSIONS.map(d => [d, scores[d] ?? 999] as const);
      const min = entries.reduce((a, b) => a[1] <= b[1] ? a : b);
      return DIMENSION_NAMES[min[0]] || min[0];
    };
    const header = "ID,手机号,昵称,微信号,来源,阶段,登录天数,交易者���型,综合评分,认知格局,执行力,风险管理,市场适应,交易心理,��统思维,薄弱维度,注册时间,测评时间,最��活跃";
    const rows = filtered.map(u => [
      u.id,
      escapeCSV(u.phone),
      escapeCSV(u.nickname),
      escapeCSV(u.wechat_id),
      escapeCSV(u.source),
      escapeCSV(TIER_NAMES[u.tier] || `T${u.tier}`),
      u.login_days,
      escapeCSV(u.trader_type_code ? (TRADER_TYPE_NAMES[u.trader_type_code] || u.trader_type_code) : ""),
      u.avg_score ?? "",
      u.scores?.EDGE ?? "",
      u.scores?.EXEC ?? "",
      u.scores?.RISK ?? "",
      u.scores?.ADAPT ?? "",
      u.scores?.MENTAL ?? "",
      u.scores?.SYSTEM ?? "",
      escapeCSV(getWeakest(u.scores)),
      u.created_at ? new Date(u.created_at).toLocaleDateString("zh-CN") : "",
      u.quiz_completed_at ? new Date(u.quiz_completed_at).toLocaleDateString("zh-CN") : "",
      u.last_active_at ? new Date(u.last_active_at).toLocaleDateString("zh-CN") : "",
    ].join(","));
    const csv = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `客户资料_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `已导出 ${filtered.length} 条记录` });
  }, [filtered, toast]);

  const formatDate = (d: string | null) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
  };

  if (loading && users.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 mx-auto rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="users-panel">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="搜索手机号 / 昵称 / 微信号"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs outline-none"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
            data-testid="input-search-users"
          />
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium shrink-0"
          style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', border: '1px solid rgba(var(--primary-rgb), 0.2)' }}
          data-testid="button-export-csv"
        >
          <Download className="w-3.5 h-3.5" />
          导出
        </button>
      </div>

      <div className="text-[11px] flex items-center justify-between" style={{ color: 'var(--text-muted)' }}>
        <span>共 {filtered.length} 位客户{search && ` (筛选自 ${users.length})`}</span>
        <button onClick={onRefresh} disabled={loading} className="flex items-center gap-1" data-testid="button-refresh-users">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{search ? "未找到匹配客户" : "暂无客户数据"}</p>
          </div>
        ) : (
          filtered.map(u => (
            <div
              key={u.id}
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}
              data-testid={`user-card-${u.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(var(--gold-rgb), 0.1)' }}>
                    <User className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>
                        {u.nickname || "未设置昵称"}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(var(--gold-rgb), 0.1)', color: 'var(--gold)' }}>
                        {TIER_NAMES[u.tier] || `T${u.tier}`}
                      </span>
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      注册 {formatDate(u.created_at)}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
                  #{u.id}
                </span>
              </div>

              <div className="space-y-1.5 ml-10">
                <CopyRow icon={<Phone className="w-3 h-3" />} label="手机" value={u.phone} onCopy={copyText} copiedId={copiedId} />
                {u.wechat_id && (
                  <CopyRow icon={<MessageSquare className="w-3 h-3" />} label="微信" value={u.wechat_id} onCopy={copyText} copiedId={copiedId} />
                )}
                {u.trader_type_code && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <span style={{ color: 'var(--text-muted)' }}>类型</span>
                    <span style={{ color: 'var(--primary)' }}>{TRADER_TYPE_NAMES[u.trader_type_code] || u.trader_type_code}</span>
                    {u.avg_score != null && (
                      <span style={{ color: 'var(--gold)' }}>{u.avg_score}分</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3 text-[11px] flex-wrap" style={{ color: 'var(--text-muted)' }}>
                  <span data-testid={`text-login-days-${u.id}`}>登录 {u.login_days} 天</span>
                  {u.source && <span data-testid={`text-source-${u.id}`}>来源: {u.source}</span>}
                  {u.quiz_completed_at && <span data-testid={`text-quiz-date-${u.id}`}>测评 {formatDate(u.quiz_completed_at)}</span>}
                  {u.last_active_at && <span data-testid={`text-active-${u.id}`}>活跃 {formatDate(u.last_active_at)}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CopyRow({ icon, label, value, onCopy, copiedId }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onCopy: (text: string, label: string) => void;
  copiedId: string | null;
}) {
  const isCopied = copiedId === value;
  return (
    <div className="flex items-center gap-2 text-[11px] group">
      <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span
        className="font-mono select-all cursor-pointer"
        style={{ color: 'var(--text-strong)' }}
        onClick={() => onCopy(value, label)}
        data-testid={`copy-${label}-${value}`}
      >
        {value}
      </span>
      <button
        onClick={() => onCopy(value, label)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: isCopied ? 'var(--success)' : 'var(--text-muted)' }}
        data-testid={`button-copy-${label}-${value}`}
      >
        {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      if (res.ok) {
        onLogin();
      } else {
        const data = await res.json();
        toast({ title: data.message || "登录失败", variant: "destructive" });
      }
    } catch {
      toast({ title: "网络错误", variant: "destructive" });
    }
    setLoading(false);
  }, [password, onLogin, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--bg-0)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(var(--gold-rgb), 0.12)' }}>
            <Shield className="w-7 h-7" style={{ color: 'var(--gold)' }} />
          </div>
          <h1 className="text-lg font-bold" style={{ color: 'var(--text-strong)' }}>管理后台</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>请输入管理员密码</p>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="password"
              placeholder="管理员密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
              data-testid="input-admin-password"
            />
          </div>
          <motion.button
            onClick={handleSubmit}
            disabled={loading || !password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{
              background: password ? 'var(--primary)' : 'rgba(var(--primary-rgb), 0.2)',
              color: password ? '#fff' : 'rgba(var(--primary-rgb), 0.5)',
            }}
            data-testid="button-admin-login"
          >
            {loading ? "验证中..." : "登录"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function AddContactForm({ onAdded }: { onAdded: () => void }) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!name || !url) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url }),
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: "顾问已添加" });
        setName("");
        setUrl("");
        setOpen(false);
        onAdded();
      } else {
        const data = await res.json();
        toast({ title: data.message || "添加失败", variant: "destructive" });
      }
    } catch {
      toast({ title: "网络错误", variant: "destructive" });
    }
    setLoading(false);
  }, [name, url, onAdded, toast]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        style={{ background: 'rgba(var(--gold-rgb), 0.1)', color: 'var(--gold)', border: '1px solid rgba(var(--gold-rgb), 0.2)' }}
        data-testid="button-add-contact"
      >
        <Plus className="w-4 h-4" />
        添加顾问
      </button>
    );
  }

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium" style={{ color: 'var(--text-strong)' }}>添加新顾问</span>
        <button onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)' }}>
          <X className="w-4 h-4" />
        </button>
      </div>
      <input
        placeholder="顾问名称"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
        data-testid="input-contact-name"
      />
      <input
        placeholder="企业微信链接 (https://work.weixin.qq.com/ca/...)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'var(--text-strong)' }}
        data-testid="input-contact-url"
      />
      <motion.button
        onClick={handleSubmit}
        disabled={loading || !name || !url}
        whileTap={{ scale: 0.98 }}
        className="w-full py-2 rounded-lg text-sm font-medium"
        style={{
          background: name && url ? 'var(--gold)' : 'rgba(var(--gold-rgb), 0.2)',
          color: name && url ? '#000' : 'rgba(var(--gold-rgb), 0.5)',
        }}
        data-testid="button-submit-contact"
      >
        {loading ? "添加中..." : "确认添加"}
      </motion.button>
    </div>
  );
}

function ContactCard({ contact, onUpdate, onDelete }: {
  contact: SalesContact;
  onUpdate: () => void;
  onDelete: () => void;
}) {
  const { toast } = useToast();
  const [checking, setChecking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(contact.name);
  const [editUrl, setEditUrl] = useState(contact.url);
  const [saving, setSaving] = useState(false);

  const toggleEnabled = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !contact.enabled }),
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: contact.enabled ? "已禁用" : "已启用" });
        onUpdate();
      }
    } catch {
      toast({ title: "操作失败", variant: "destructive" });
    }
  }, [contact, onUpdate, toast]);

  const runHealthCheck = useCallback(async () => {
    setChecking(true);
    try {
      const res = await fetch(`/api/admin/contacts/${contact.id}/health-check`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        toast({ title: data.status === "ok" ? "检测正常" : "检测异常" });
        onUpdate();
      }
    } catch {
      toast({ title: "检测失败", variant: "destructive" });
    }
    setChecking(false);
  }, [contact, onUpdate, toast]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/contacts/${contact.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: "已删除" });
        onDelete();
      }
    } catch {
      toast({ title: "删除失败", variant: "destructive" });
    }
    setDeleting(false);
    setConfirmDelete(false);
  }, [contact, onDelete, toast]);

  const handleSaveEdit = useCallback(async () => {
    if (!editName || !editUrl) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, url: editUrl }),
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: "已保存" });
        setEditing(false);
        onUpdate();
      } else {
        const data = await res.json();
        toast({ title: data.message || "保存失败", variant: "destructive" });
      }
    } catch {
      toast({ title: "网络错误", variant: "destructive" });
    }
    setSaving(false);
  }, [contact.id, editName, editUrl, onUpdate, toast]);

  const handleCancelEdit = useCallback(() => {
    setEditName(contact.name);
    setEditUrl(contact.url);
    setEditing(false);
  }, [contact]);

  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{
        background: contact.enabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.01)',
        border: `1px solid ${contact.enabled ? 'var(--border)' : 'rgba(255,255,255,0.04)'}`,
        opacity: contact.enabled ? 1 : 0.6,
      }}
      data-testid={`card-contact-${contact.id}`}
    >
      {editing ? (
        <div className="space-y-2.5">
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="顾问名称"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(var(--gold-rgb), 0.3)', color: 'var(--text-strong)' }}
            data-testid={`input-edit-name-${contact.id}`}
          />
          <input
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            placeholder="企业微信链接"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(var(--gold-rgb), 0.3)', color: 'var(--text-strong)' }}
            data-testid={`input-edit-url-${contact.id}`}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={saving || !editName || !editUrl}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'var(--gold)', color: '#000' }}
              data-testid={`button-save-edit-${contact.id}`}
            >
              <Check className="w-3 h-3" />
              {saving ? "保存中..." : "保存"}
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 rounded-lg text-xs"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
              data-testid={`button-cancel-edit-${contact.id}`}
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-strong)' }}>{contact.name}</span>
              <StatusDot status={contact.lastHealthStatus} />
            </div>
            <p className="text-xs truncate mb-1" style={{ color: 'var(--text-muted)' }}>{contact.url}</p>
            {contact.lastHealthCheck && (
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                上次检测: {new Date(contact.lastHealthCheck).toLocaleString('zh-CN')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => { setEditName(contact.name); setEditUrl(contact.url); setEditing(true); }}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}
              title="编辑"
              data-testid={`button-edit-${contact.id}`}
            >
              <Pencil className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
            </button>
            <button
              onClick={runHealthCheck}
              disabled={checking}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}
              title="健康检测"
              data-testid={`button-check-${contact.id}`}
            >
              <Activity className={`w-3.5 h-3.5 ${checking ? 'animate-pulse' : ''}`} style={{ color: 'var(--info)' }} />
            </button>
            <button
              onClick={toggleEnabled}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)' }}
              title={contact.enabled ? "禁用" : "启用"}
              data-testid={`button-toggle-${contact.id}`}
            >
              {contact.enabled ? (
                <Power className="w-3.5 h-3.5" style={{ color: '#07C160' }} />
              ) : (
                <PowerOff className="w-3.5 h-3.5" style={{ color: '#EF4444' }} />
              )}
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-2 py-1 rounded text-[10px] font-medium"
                  style={{ background: '#EF4444', color: '#fff' }}
                  data-testid={`button-confirm-delete-${contact.id}`}
                >
                  {deleting ? "..." : "确认"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 rounded text-[10px]"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)' }}
                title="删除"
                data-testid={`button-delete-${contact.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type AdminTab = "contacts" | "stats" | "users";

export default function AdminPage() {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [contacts, setContacts] = useState<SalesContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingAll, setCheckingAll] = useState(false);
  const [tab, setTab] = useState<AdminTab>("contacts");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/session", { credentials: "include" });
      const data = await res.json();
      setIsAdmin(data.isAdmin);
    } catch {
      setIsAdmin(false);
    }
  }, []);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch {}
    setLoading(false);
  }, []);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {}
    setStatsLoading(false);
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setAdminUsers(data);
      }
    } catch {}
    setUsersLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isAdmin) {
      fetchContacts();
      fetchStats();
    }
  }, [isAdmin, fetchContacts, fetchStats]);

  const handleCheckAll = useCallback(async () => {
    setCheckingAll(true);
    try {
      const res = await fetch("/api/admin/contacts/health-check-all", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        const results = await res.json();
        const dead = results.filter((r: any) => r.status === "dead");
        toast({
          title: dead.length > 0
            ? `检测完成：${dead.length} 个异常`
            : `全部正常（${results.length} 个顾问）`,
          variant: dead.length > 0 ? "destructive" : "default",
        });
        fetchContacts();
      }
    } catch {
      toast({ title: "检测失败", variant: "destructive" });
    }
    setCheckingAll(false);
  }, [fetchContacts, toast]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-0)' }}>
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onLogin={() => { setIsAdmin(true); }} />;
  }

  const enabledCount = contacts.filter(c => c.enabled).length;
  const deadCount = contacts.filter(c => c.lastHealthStatus === "dead" && c.enabled).length;

  return (
    <div className="min-h-screen pb-12" style={{ background: 'var(--bg-0)' }}>
      <div className="max-w-lg mx-auto px-5 pt-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <a href="/" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)' }} data-testid="link-back-home">
              <ArrowLeft className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            </a>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-strong)' }}>管理后台</h1>
          </div>
        </div>

        <div className="flex gap-1.5 mb-5 overflow-x-auto">
          <button
            onClick={() => setTab("contacts")}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
            style={{
              background: tab === "contacts" ? 'rgba(var(--gold-rgb), 0.15)' : 'rgba(255,255,255,0.03)',
              color: tab === "contacts" ? 'var(--gold)' : 'var(--text-muted)',
              border: `1px solid ${tab === "contacts" ? 'rgba(var(--gold-rgb), 0.3)' : 'var(--border)'}`,
            }}
            data-testid="tab-contacts"
          >
            <Users className="w-4 h-4" />
            顾问管理
          </button>
          <button
            onClick={() => { setTab("users"); if (adminUsers.length === 0) fetchUsers(); }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
            style={{
              background: tab === "users" ? 'rgba(var(--gold-rgb), 0.15)' : 'rgba(255,255,255,0.03)',
              color: tab === "users" ? 'var(--gold)' : 'var(--text-muted)',
              border: `1px solid ${tab === "users" ? 'rgba(var(--gold-rgb), 0.3)' : 'var(--border)'}`,
            }}
            data-testid="tab-users"
          >
            <User className="w-4 h-4" />
            客户资料
          </button>
          <button
            onClick={() => { setTab("stats"); if (!stats) fetchStats(); }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap"
            style={{
              background: tab === "stats" ? 'rgba(var(--gold-rgb), 0.15)' : 'rgba(255,255,255,0.03)',
              color: tab === "stats" ? 'var(--gold)' : 'var(--text-muted)',
              border: `1px solid ${tab === "stats" ? 'rgba(var(--gold-rgb), 0.3)' : 'var(--border)'}`,
            }}
            data-testid="tab-stats"
          >
            <BarChart3 className="w-4 h-4" />
            数据统计
          </button>
        </div>

        {tab === "contacts" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {enabledCount} 个启用 {deadCount > 0 && <span style={{ color: '#EF4444' }}>/ {deadCount} 个异常</span>}
              </p>
              <motion.button
                onClick={handleCheckAll}
                disabled={checkingAll}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors"
                style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary)', border: '1px solid rgba(var(--primary-rgb), 0.2)' }}
                data-testid="button-check-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingAll ? 'animate-spin' : ''}`} />
                {checkingAll ? "检测中..." : "全部检测"}
              </motion.button>
            </div>

            <div className="space-y-3 mb-4">
              {loading && contacts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 mx-auto rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                </div>
              ) : contacts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>暂无顾问</p>
                </div>
              ) : (
                contacts.map(contact => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onUpdate={fetchContacts}
                    onDelete={fetchContacts}
                  />
                ))
              )}
            </div>

            <AddContactForm onAdded={fetchContacts} />

            <div className="mt-8 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-strong)' }}>自动监控</p>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                系统每30分钟自动检测所有启用顾问的健康状态。当某个顾问从正常变为异常时，会自动通过企业微信群发送告警通知。
              </p>
            </div>
          </>
        )}

        {tab === "users" && (
          <UsersPanel users={adminUsers} loading={usersLoading} onRefresh={fetchUsers} />
        )}

        {tab === "stats" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>网站运营数据概览</p>
              <button
                onClick={fetchStats}
                disabled={statsLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px]"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}
                data-testid="button-refresh-stats"
              >
                <RefreshCw className={`w-3 h-3 ${statsLoading ? 'animate-spin' : ''}`} />
                刷新
              </button>
            </div>
            <StatsPanel stats={stats} loading={statsLoading} />
          </div>
        )}
      </div>
    </div>
  );
}
