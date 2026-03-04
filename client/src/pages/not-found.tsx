import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center" style={{ background: 'var(--bg-0)' }}>
      <div className="w-full max-w-md mx-4 rounded-2xl p-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
        <div className="flex mb-4 gap-2 items-center">
          <AlertCircle className="h-8 w-8" style={{ color: 'var(--accent)' }} />
          <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--text-strong)' }}>404</h1>
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          页面不存在
        </p>
      </div>
    </div>
  );
}
