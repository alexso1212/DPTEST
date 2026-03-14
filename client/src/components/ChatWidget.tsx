import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Headphones } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/lib/auth";

function getSessionId() {
  let id = sessionStorage.getItem("chat_session_id");
  if (!id) {
    id = "s-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("chat_session_id", id);
  }
  return id;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { user } = useAuth();
  const sessionId = useMemo(getSessionId, []);
  const { messages, status, connected, sendMessage } = useChat({
    sessionId,
    userId: user?.id,
    autoConnect: open,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 支持从外部打开聊天窗口（结果页按钮等）
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-chat-widget", handler);
    return () => window.removeEventListener("open-chat-widget", handler);
  }, []);

  // 自动滚到底
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 打开时聚焦输入框
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput("");
  };

  const statusLabel = status === "human" ? "人工客服" : "AI 顾问";
  const StatusIcon = status === "human" ? Headphones : Bot;

  return (
    <>
      {/* 浮动按钮 */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
            }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 聊天面板 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
            style={{
              height: "min(520px, calc(100vh - 6rem))",
              background: "#0F1620",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* 头部 */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              <div className="flex items-center gap-2">
                <StatusIcon className="w-5 h-5 text-white/90" />
                <div>
                  <span className="text-sm font-semibold text-white">{statusLabel}</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`} />
                    <span className="text-[10px] text-white/60">{connected ? "在线" : "连接中..."}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/80" />
              </button>
            </div>

            {/* 消息区域 */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollBehavior: "smooth" }}>
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-10 h-10 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    有什么想了解的？发条消息开始聊天
                  </p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-1.5 max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {/* 头像 */}
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
                    {/* 气泡 */}
                    <div
                      className="px-3 py-2 rounded-xl text-sm leading-relaxed"
                      style={{
                        background: msg.role === "user"
                          ? "rgba(102,126,234,0.15)"
                          : "rgba(255,255,255,0.06)",
                        color: "#E8E6E1",
                        borderBottomRightRadius: msg.role === "user" ? 4 : undefined,
                        borderBottomLeftRadius: msg.role !== "user" ? 4 : undefined,
                      }}
                    >
                      {msg.agentName && (
                        <div className="text-[10px] mb-1" style={{ color: "#F59E0B" }}>
                          {msg.agentName}
                        </div>
                      )}
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 输入框 */}
            <div className="shrink-0 px-3 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="输入消息..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "#E8E6E1" }}
                  disabled={status === "closed"}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || status === "closed"}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0"
                  style={{
                    background: input.trim() ? "rgba(102,126,234,0.8)" : "rgba(255,255,255,0.04)",
                    color: input.trim() ? "#fff" : "rgba(255,255,255,0.2)",
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
