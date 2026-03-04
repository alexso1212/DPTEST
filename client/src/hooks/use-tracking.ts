import { useCallback, useEffect, useRef } from "react";

function getSessionId(): string {
  const KEY = "dtx_sid";
  let sid = localStorage.getItem(KEY);
  if (!sid) {
    sid = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(KEY, sid);
  }
  return sid;
}

export function useTracking() {
  const sessionId = useRef(getSessionId());

  const trackEvent = useCallback(
    (eventType: string, eventData?: Record<string, unknown>) => {
      try {
        fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: sessionId.current,
            eventType,
            eventData,
          }),
        }).catch(() => {});
      } catch {
      }
    },
    []
  );

  const trackPageView = useCallback(
    (page: string) => {
      trackEvent("page_view", { page });
    },
    [trackEvent]
  );

  return { trackEvent, trackPageView, sessionId: sessionId.current };
}

export function usePageView(page: string) {
  const { trackPageView } = useTracking();
  const tracked = useRef(false);
  useEffect(() => {
    if (!tracked.current) {
      trackPageView(page);
      tracked.current = true;
    }
  }, [page, trackPageView]);
}
