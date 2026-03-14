import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import type { IncomingMessage } from "http";
import { storage } from "./storage";

// 客户连接池：conversationId → WebSocket
const clientSockets = new Map<number, WebSocket>();
// 客服连接池：agentName → { ws, watchingConversations }
const agentSockets = new Map<string, { ws: WebSocket; watching: Set<number> }>();

/**
 * AI 客服占位 —— 后续替换为真正的 AI 调用
 * 当前返回固定话术，方便测试流程
 */
async function getAiReply(conversationId: number, userMessage: string): Promise<string> {
  const conv = await storage.getConversation(conversationId);

  // 如果有测评结果，可以参考
  const quizInfo = conv?.quizSummary
    ? `（该客户测评类型：${(conv.quizSummary as any).traderType || "未知"}）`
    : "";

  // TODO: 接入真正的 AI 模型（Claude API / OpenAI 等）
  // 当前返回模板回复
  const replies = [
    `你好！${quizInfo}感谢你完成了我们的交易能力测评。有什么想了解的吗？`,
    "我是你的专属 AI 顾问，可以帮你解读测评结果、推荐学习资源，或者回答交易相关的问题。",
    "如果你想深入了解某个维度的提升方法，告诉我具体维度名称就好。",
    "需要我帮你安排一对一的人工顾问沟通吗？",
  ];

  const messages = await storage.getConversationMessages(conversationId);
  const aiCount = messages.filter(m => m.role === "ai").length;
  return replies[Math.min(aiCount, replies.length - 1)];
}

/**
 * 广播消息给所有关注该会话的客服
 */
function broadcastToAgents(conversationId: number, data: unknown) {
  const payload = JSON.stringify(data);
  agentSockets.forEach((agent) => {
    if (agent.watching.has(conversationId)) {
      if (agent.ws.readyState === WebSocket.OPEN) {
        agent.ws.send(payload);
      }
    }
  });
}

/**
 * 发消息给客户
 */
function sendToClient(conversationId: number, data: unknown) {
  const ws = clientSockets.get(conversationId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

export function setupChatWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws/chat" });

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);
    const role = url.searchParams.get("role"); // "client" 或 "agent"

    if (role === "agent") {
      handleAgentConnection(ws, url);
    } else {
      handleClientConnection(ws, url);
    }
  });

  console.log("[chat] WebSocket server ready at /ws/chat");
}

function handleClientConnection(ws: WebSocket, url: URL) {
  const sessionId = url.searchParams.get("sessionId") || "anon-" + Date.now();
  const userId = url.searchParams.get("userId");
  let conversationId: number | null = null;

  // 初始化会话
  (async () => {
    const conv = await storage.getOrCreateConversation(
      sessionId,
      userId ? parseInt(userId) : undefined
    );
    conversationId = conv.id;
    clientSockets.set(conv.id, ws);

    // 发送历史消息
    const history = await storage.getConversationMessages(conv.id);
    ws.send(JSON.stringify({
      type: "init",
      conversationId: conv.id,
      status: conv.status,
      messages: history.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        agentName: m.agentName,
        createdAt: m.createdAt,
      })),
    }));

    // 通知客服有新连接
    broadcastToAgents(conv.id, {
      type: "client_connected",
      conversationId: conv.id,
      sessionId,
      userId: userId ? parseInt(userId) : null,
    });
  })();

  ws.on("message", async (raw) => {
    if (!conversationId) return;
    try {
      const data = JSON.parse(raw.toString());

      if (data.type === "message") {
        // 保存用户消息
        const msg = await storage.addMessage(conversationId, "user", data.content);
        const msgPayload = {
          type: "message",
          conversationId,
          message: { id: msg.id, role: "user", content: msg.content, createdAt: msg.createdAt },
        };

        // 转发给关注的客服
        broadcastToAgents(conversationId, msgPayload);

        // 如果当前是 AI 模式，生成 AI 回复
        const conv = await storage.getConversation(conversationId);
        if (conv?.status === "ai") {
          const aiReply = await getAiReply(conversationId, data.content);
          const aiMsg = await storage.addMessage(conversationId, "ai", aiReply);
          const aiPayload = {
            type: "message",
            conversationId,
            message: { id: aiMsg.id, role: "ai", content: aiMsg.content, createdAt: aiMsg.createdAt },
          };
          sendToClient(conversationId, aiPayload);
          broadcastToAgents(conversationId, aiPayload);
        }
      }
    } catch (err) {
      console.error("[chat] client message error:", err);
    }
  });

  ws.on("close", () => {
    if (conversationId) {
      clientSockets.delete(conversationId);
      broadcastToAgents(conversationId, { type: "client_disconnected", conversationId });
    }
  });
}

function handleAgentConnection(ws: WebSocket, url: URL) {
  const agentName = url.searchParams.get("agentName") || "客服";
  const agent = { ws, watching: new Set<number>() };
  agentSockets.set(agentName, agent);

  // 发送当前活跃会话列表
  (async () => {
    const convs = await storage.getActiveConversations();
    ws.send(JSON.stringify({ type: "conversations", conversations: convs }));
  })();

  ws.on("message", async (raw) => {
    try {
      const data = JSON.parse(raw.toString());

      switch (data.type) {
        case "watch": {
          // 客服开始关注某个会话
          agent.watching.add(data.conversationId);
          const messages = await storage.getConversationMessages(data.conversationId);
          const conv = await storage.getConversation(data.conversationId);
          ws.send(JSON.stringify({
            type: "conversation_detail",
            conversationId: data.conversationId,
            status: conv?.status,
            quizSummary: conv?.quizSummary,
            messages: messages.map(m => ({
              id: m.id, role: m.role, content: m.content,
              agentName: m.agentName, createdAt: m.createdAt,
            })),
          }));
          break;
        }

        case "takeover": {
          // 客服接管会话（从 AI 切换到人工）
          await storage.updateConversationStatus(data.conversationId, "human", agentName);
          const sysMsg = await storage.addMessage(data.conversationId, "ai", `客服 ${agentName} 已接入，将为您提供一对一服务。`);
          const payload = {
            type: "message",
            conversationId: data.conversationId,
            message: { id: sysMsg.id, role: "ai", content: sysMsg.content, createdAt: sysMsg.createdAt },
          };
          sendToClient(data.conversationId, payload);
          broadcastToAgents(data.conversationId, payload);
          broadcastToAgents(data.conversationId, {
            type: "status_changed",
            conversationId: data.conversationId,
            status: "human",
            assignedAgent: agentName,
          });
          // 也通知客户端状态变化
          sendToClient(data.conversationId, {
            type: "status_changed",
            conversationId: data.conversationId,
            status: "human",
          });
          break;
        }

        case "release": {
          // 客服释放会话（切回 AI）
          await storage.updateConversationStatus(data.conversationId, "ai", undefined);
          const sysMsg = await storage.addMessage(data.conversationId, "ai", "AI 顾问已重新接管对话，有问题随时提问。");
          const payload = {
            type: "message",
            conversationId: data.conversationId,
            message: { id: sysMsg.id, role: "ai", content: sysMsg.content, createdAt: sysMsg.createdAt },
          };
          sendToClient(data.conversationId, payload);
          broadcastToAgents(data.conversationId, payload);
          broadcastToAgents(data.conversationId, {
            type: "status_changed",
            conversationId: data.conversationId,
            status: "ai",
          });
          sendToClient(data.conversationId, {
            type: "status_changed",
            conversationId: data.conversationId,
            status: "ai",
          });
          break;
        }

        case "message": {
          // 客服发送消息
          if (!data.conversationId || !data.content) break;
          const msg = await storage.addMessage(data.conversationId, "agent", data.content, agentName);
          const msgPayload = {
            type: "message",
            conversationId: data.conversationId,
            message: { id: msg.id, role: "agent", content: msg.content, agentName, createdAt: msg.createdAt },
          };
          sendToClient(data.conversationId, msgPayload);
          broadcastToAgents(data.conversationId, msgPayload);
          break;
        }

        case "close": {
          // 关闭会话
          await storage.updateConversationStatus(data.conversationId, "closed");
          sendToClient(data.conversationId, { type: "conversation_closed", conversationId: data.conversationId });
          broadcastToAgents(data.conversationId, { type: "conversation_closed", conversationId: data.conversationId });
          break;
        }
      }
    } catch (err) {
      console.error("[chat] agent message error:", err);
    }
  });

  ws.on("close", () => {
    agentSockets.delete(agentName);
  });
}
