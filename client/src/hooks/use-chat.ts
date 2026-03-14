import { useState, useEffect, useRef, useCallback } from "react";

export interface ChatMsg {
  id: number;
  role: "user" | "ai" | "agent";
  content: string;
  agentName?: string;
  createdAt: string;
}

interface UseChatOptions {
  sessionId: string;
  userId?: number;
  autoConnect?: boolean;
}

export function useChat({ sessionId, userId, autoConnect = true }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [status, setStatus] = useState<"ai" | "human" | "closed">("ai");
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    const params = new URLSearchParams({ role: "client", sessionId });
    if (userId) params.set("userId", String(userId));
    const ws = new WebSocket(`${proto}//${location.host}/ws/chat?${params}`);

    ws.onopen = () => setConnected(true);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "init":
          setConversationId(data.conversationId);
          setStatus(data.status);
          setMessages(data.messages || []);
          break;
        case "message":
          setMessages(prev => [...prev, data.message]);
          break;
        case "status_changed":
          setStatus(data.status);
          break;
        case "conversation_closed":
          setStatus("closed");
          break;
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // 自动重连
      reconnectTimer.current = setTimeout(connect, 3000);
    };

    wsRef.current = ws;
  }, [sessionId, userId]);

  useEffect(() => {
    if (autoConnect) connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect, autoConnect]);

  const sendMessage = useCallback((content: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: "message", content }));
    // 乐观更新：先显示用户消息
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    }]);
  }, []);

  return { messages, conversationId, status, connected, sendMessage, connect };
}
