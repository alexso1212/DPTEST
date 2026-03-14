-- 聊天系统表结构
-- 运行方式: psql $DATABASE_URL -f script/create-chat-tables.sql
-- 或者用 drizzle-kit push 自动同步

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  session_id VARCHAR(64) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ai',
  assigned_agent VARCHAR(100),
  quiz_summary JSONB,
  last_message_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(id),
  role VARCHAR(10) NOT NULL,
  content TEXT NOT NULL,
  agent_name VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON chat_messages(conversation_id);
