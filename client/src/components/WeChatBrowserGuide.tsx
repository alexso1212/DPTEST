import { useState, useCallback } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

function isWeChatBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("micromessenger");
}

export default function WeChatBrowserGuide() {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  if (!isWeChatBrowser()) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "#0D0F14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 24px",
      }}
      data-testid="wechat-browser-guide"
    >
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "guideArrowBounce 1.2s ease-in-out infinite",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 28V8M16 8L8 16M16 8L24 16"
              stroke="#C9A456"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span style={{ fontSize: "10px", color: "#C9A456", letterSpacing: "1px" }}>
          点这里
        </span>
      </div>

      <div style={{ textAlign: "center", maxWidth: "320px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "rgba(201,164,86,0.1)",
            border: "1px solid rgba(201,164,86,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <ExternalLink style={{ width: "28px", height: "28px", color: "#C9A456" }} />
        </div>

        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#E8E6E1",
            fontFamily: "Georgia, 'Noto Serif SC', serif",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          请在浏览器中打开
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "rgba(232,230,225,0.6)",
            lineHeight: 1.8,
            marginBottom: "32px",
          }}
        >
          点击右上角 <span style={{ color: "#C9A456", fontWeight: 600 }}>···</span> 按钮
          <br />
          选择 <span style={{ color: "#C9A456", fontWeight: 600 }}>"在浏览器中打开"</span>
        </p>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "16px",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "rgba(201,164,86,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#C9A456",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              1
            </div>
            <span style={{ fontSize: "13px", color: "rgba(232,230,225,0.7)" }}>
              点击右上角 <span style={{ color: "#E8E6E1" }}>···</span> 菜单
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "rgba(201,164,86,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#C9A456",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              2
            </div>
            <span style={{ fontSize: "13px", color: "rgba(232,230,225,0.7)" }}>
              选择 <span style={{ color: "#E8E6E1" }}>"在浏览器中打开"</span>
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "rgba(201,164,86,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                color: "#C9A456",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              3
            </div>
            <span style={{ fontSize: "13px", color: "rgba(232,230,225,0.7)" }}>
              即可正常使用全部功能
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: copied ? "rgba(7,193,96,0.15)" : "rgba(201,164,86,0.12)",
            border: `1px solid ${copied ? "rgba(7,193,96,0.3)" : "rgba(201,164,86,0.25)"}`,
            color: copied ? "#07C160" : "#C9A456",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s ease",
          }}
          data-testid="button-copy-link"
        >
          {copied ? (
            <>
              <Check style={{ width: "16px", height: "16px" }} />
              已复制链接
            </>
          ) : (
            <>
              <Copy style={{ width: "16px", height: "16px" }} />
              复制链接到浏览器打开
            </>
          )}
        </button>

        <p
          style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.2)",
            marginTop: "20px",
          }}
        >
          Deltapex Trading Group
        </p>
      </div>
    </div>
  );
}
