import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle, Send, Bot, User, Headphones, ArrowLeft,
  PhoneCall, UserCircle, BarChart3, Clock, Circle,
} from "lucide-react";

interface ChatMsg {
  id: number;
  role: "user" | "ai" | "agent";
  content: string;
  agentName?: string;
  createdAt: string;
}

interface ConversationItem {
  id: number;
  sessionId: string;
  userId: number | null;
  status: "ai" | "human" | "closed";
  assignedAgent: string | null;
  quizSummary: { traderType?: string; avgScore?: number; rankName?: string } | null;
  lastMessage?: string;
  lastMessageAt: string;
  createdAt: string;
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "刚刚";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

export default function AdminChatPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [agentName, setAgentName] = useState("");
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [selectedConv, setSelectedConv] = useState<ConversationItem | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 检查是否已登录管理后台
  useEffect(() => {
    fetch("/api/admin/session", { credentials: "include" })
      .then(r => r.json())
      .then(d => { if (d.isAdmin) setAuthed(true); });
  }, []);

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include",
    });
    if (res.ok) setAuthed(true);
  };

  // 连接 WebSocket（客服角色）
  const connectWs = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    const name = agentName || "客服";
    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${proto}//${location.host}/ws/chat?role=agent&agentName=${encodeURIComponent(name)}`);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "conversations":
          setConversations(data.conversations);
          break;
        case "conversation_detail":
          setMessages(data.messages || []);
          setSelectedConv(prev => prev ? { ...prev, status: data.status } : prev);
          break;
        case "message":
          setMessages(prev => {
            if (prev.some(m => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
          // 更新会话列表中的最后消息
          setConversations(prev =>
            prev.map(c =>
              c.id === data.conversationId
                ? { ...c, lastMessage: data.message.content, lastMessageAt: data.message.createdAt }
                : c
            )
          );
          break;
        case "status_changed":
          setConversations(prev =>
            prev.map(c =>
              c.id === data.conversationId
                ? { ...c, status: data.status, assignedAgent: data.assignedAgent ?? c.assignedAgent }
                : c
            )
          );
          setSelectedConv(prev =>
            prev?.id === data.conversationId ? { ...prev, status: data.status } as ConversationItem : prev
          );
          break;
        case "client_connected":
        case "client_disconnected":
          // 刷新会话列表
          break;
        case "conversation_closed":
          setConversations(prev => prev.filter(c => c.id !== data.conversationId));
          if (selectedId === data.conversationId) {
            setSelectedId(null);
            setSelectedConv(null);
            setMessages([]);
          }
          break;
      }
    };

    ws.onclose = () => {
      setTimeout(connectWs, 3000);
    };

    wsRef.current = ws;
  }, [agentName, selectedId]);

  useEffect(() => {
    if (authed && agentName) {
      connectWs();
      return () => { wsRef.current?.close(); };
    }
  }, [authed, agentName, connectWs]);

  // 选择会话
  const selectConversation = (conv: ConversationItem) => {
    setSelectedId(conv.id);
    setSelectedConv(conv);
    setMessages([]);
    wsRef.current?.send(JSON.stringify({ type: "watch", conversationId: conv.id }));
  };

  // 接管
  const takeover = () => {
    if (!selectedId) return;
    wsRef.current?.send(JSON.stringify({ type: "takeover", conversationId: selectedId }));
  };

  // 释放给 AI
  const release = () => {
    if (!selectedId) return;
    wsRef.current?.send(JSON.stringify({ type: "release", conversationId: selectedId }));
  };

  // 发送消息
  const handleSend = () => {
    const text = input.trim();
    if (!text || !selectedId) return;
    wsRef.current?.send(JSON.stringify({ type: "message", conversationId: selectedId, content: text }));
    setInput("");
  };

  // 自动滚到底
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // 登录界面
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0E17" }}>
        <div className="w-80 p-6 rounded-2xl" style={{ background: "#0F1620", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-lg font-bold mb-4 text-center" style={{ color: "#E8E6E1" }}>客服后台</h2>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="管理员密码"
            className="w-full px-3 py-2 rounded-lg mb-3 text-sm bg-transparent outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#E8E6E1" }}
          />
          <button
            onClick={handleLogin}
            className="w-full py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            登录
          </button>
        </div>
      </div>
    );
  }

  // 输入客服名称
  if (!agentName) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0A0E17" }}>
        <div className="w-80 p-6 rounded-2xl" style={{ background: "#0F1620", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-lg font-bold mb-2 text-center" style={{ color: "#E8E6E1" }}>设置客服名称</h2>
          <p className="text-xs text-center mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>客户将看到这个名称</p>
          <input
            type="text"
            onChange={e => setAgentName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && e.currentTarget.value && setAgentName(e.currentTarget.value)}
            placeholder="例如：Deven"
            className="w-full px-3 py-2 rounded-lg mb-3 text-sm bg-transparent outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#E8E6E1" }}
          />
          <button
            onClick={() => {
              const el = document.querySelector<HTMLInputElement>("input[placeholder='例如：Deven']");
              if (el?.value) setAgentName(el.value);
            }}
            className="w-full py-2 rounded-lg text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            开始接客
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex" style={{ background: "#0A0E17" }}>
      {/* 左侧：会话列表 */}
      <div
        className="w-80 shrink-0 flex flex-col"
        style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "#0D1118" }}
      >
        <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5" style={{ color: "#667eea" }} />
            <span className="text-sm font-semibold" style={{ color: "#E8E6E1" }}>
              客服面板 · {agentName}
            </span>
          </div>
          <div className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
            {conversations.length} 个活跃会话
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-8 h-8 mx-auto mb-2" style={{ color: "rgba(255,255,255,0.1)" }} />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>暂无活跃会话</p>
            </div>
          )}
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className="w-full px-4 py-3 text-left transition-colors"
              style={{
                background: selectedId === conv.id ? "rgba(102,126,234,0.08)" : "transparent",
                borderBottom: "1px solid rgba(255,255,255,0.03)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <UserCircle className="w-4 h-4" style={{ color: "rgba(255,255,255,0.4)" }} />
                  <span className="text-xs font-medium" style={{ color: "#E8E6E1" }}>
                    {conv.userId ? `用户 #${conv.userId}` : `访客`}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Circle
                    className="w-2 h-2"
                    fill={conv.status === "human" ? "#F59E0B" : "#07C160"}
                    style={{ color: conv.status === "human" ? "#F59E0B" : "#07C160" }}
                  />
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {conv.status === "human" ? "人工" : "AI"}
                  </span>
                </div>
              </div>
              {conv.quizSummary && (
                <div className="flex items-center gap-1 mb-1">
                  <BarChart3 className="w-3 h-3" style={{ color: "rgba(255,255,255,0.2)" }} />
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {conv.quizSummary.rankName} · {conv.quizSummary.avgScore}分
                  </span>
                </div>
              )}
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                {conv.lastMessage || "暂无消息"}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-2.5 h-2.5" style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {formatTime(conv.lastMessageAt)}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 右侧：聊天详情 */}
      <div className="flex-1 flex flex-col">
        {!selectedId ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.08)" }} />
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>选择一个会话开始沟通</p>
            </div>
          </div>
        ) : (
          <>
            {/* 头部 */}
            <div className="shrink-0 px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: "#E8E6E1" }}>
                  会话 #{selectedId}
                </span>
                {selectedConv?.quizSummary && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(102,126,234,0.15)", color: "#667eea" }}>
                    {selectedConv.quizSummary.traderType} · {selectedConv.quizSummary.rankName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedConv?.status === "ai" ? (
                  <button
                    onClick={takeover}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                    style={{ background: "#F59E0B" }}
                  >
                    <PhoneCall className="w-3 h-3" />
                    接管会话
                  </button>
                ) : selectedConv?.status === "human" ? (
                  <button
                    onClick={release}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
                  >
                    <Bot className="w-3 h-3" />
                    交回 AI
                  </button>
                ) : null}
              </div>
            </div>

            {/* 消息区 */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollBehavior: "smooth" }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`flex items-end gap-1.5 max-w-[70%] ${msg.role === "user" ? "" : "flex-row-reverse"}`}>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: msg.role === "user"
                          ? "rgba(102,126,234,0.2)"
                          : msg.role === "agent"
                            ? "rgba(245,158,11,0.2)"
                            : "rgba(7,193,96,0.2)",
                      }}
                    >
                      {msg.role === "user" ? (
                        <User className="w-3 h-3" style={{ color: "#667eea" }} />
                      ) : msg.role === "agent" ? (
                        <Headphones className="w-3 h-3" style={{ color: "#F59E0B" }} />
                      ) : (
                        <Bot className="w-3 h-3" style={{ color: "#07C160" }} />
                      )}
                    </div>
                    <div>
                      {msg.agentName && (
                        <div className="text-[10px] mb-0.5 text-right" style={{ color: "#F59E0B" }}>
                          {msg.agentName}
                        </div>
                      )}
                      <div
                        className="px-3 py-2 rounded-xl text-sm leading-relaxed"
                        style={{
                          background: msg.role === "user"
                            ? "rgba(102,126,234,0.1)"
                            : msg.role === "agent"
                              ? "rgba(245,158,11,0.1)"
                              : "rgba(255,255,255,0.06)",
                          color: "#E8E6E1",
                        }}
                      >
                        {msg.content}
                      </div>
                      <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.15)" }}>
                        {new Date(msg.createdAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 输入框 */}
            <div className="shrink-0 px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {selectedConv?.status !== "human" ? (
                <div className="text-center py-2">
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    当前由 AI 处理 · 点击「接管会话」后可手动回复
                  </p>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                    placeholder="回复客户..."
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "#E8E6E1" }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0"
                    style={{
                      background: input.trim() ? "#F59E0B" : "rgba(255,255,255,0.04)",
                      color: input.trim() ? "#fff" : "rgba(255,255,255,0.2)",
                    }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
