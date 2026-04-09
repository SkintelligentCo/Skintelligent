import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ToastViewport from "../components/ToastViewport";

const NotificationContext = createContext(null);
const MAX_TOASTS = 4;
const DEFAULT_DURATION = 4200;
const DISMISS_ANIMATION_MS = 260;

function now() {
  return Date.now();
}

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());
  const idRef = useRef(0);

  const clearToastTimer = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer?.timeoutId) {
      window.clearTimeout(timer.timeoutId);
    }
    if (timer) {
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id) => {
      clearToastTimer(id);
      setToasts((current) =>
        current.map((toast) => (toast.id === id ? { ...toast, isDismissing: true, isPaused: true } : toast)),
      );

      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, DISMISS_ANIMATION_MS);
    },
    [clearToastTimer],
  );

  const startTimer = useCallback(
    (id, duration) => {
      if (!duration || duration <= 0) {
        return;
      }

      clearToastTimer(id);
      const startedAt = now();
      const timeoutId = window.setTimeout(() => {
        dismiss(id);
      }, duration);

      timersRef.current.set(id, { timeoutId, startedAt, duration });
    },
    [clearToastTimer, dismiss],
  );

  const pause = useCallback(
    (id) => {
      const timer = timersRef.current.get(id);
      if (!timer) {
        setToasts((current) =>
          current.map((toast) => (toast.id === id ? { ...toast, isPaused: true } : toast)),
        );
        return;
      }

      const elapsed = now() - timer.startedAt;
      const remainingMs = Math.max(0, timer.duration - elapsed);
      clearToastTimer(id);
      setToasts((current) =>
        current.map((toast) =>
          toast.id === id ? { ...toast, isPaused: true, remainingMs } : toast,
        ),
      );
    },
    [clearToastTimer],
  );

  const resume = useCallback(
    (id) => {
      setToasts((current) =>
        current.map((toast) => {
          if (toast.id !== id || toast.isDismissing) {
            return toast;
          }
          startTimer(id, toast.remainingMs);
          return { ...toast, isPaused: false };
        }),
      );
    },
    [startTimer],
  );

  const notify = useCallback(
    ({ title = "", message, variant = "info", duration = DEFAULT_DURATION, id }) => {
      if (!message) {
        return null;
      }

      const toastId = id || `toast-${++idRef.current}`;
      clearToastTimer(toastId);
      setToasts((current) => {
        const nextToast = {
          id: toastId,
          title,
          message,
          variant,
          duration,
          remainingMs: duration,
          isPaused: false,
          isDismissing: false,
        };
        const withoutExisting = current.filter((toast) => toast.id !== toastId);
        const next = [nextToast, ...withoutExisting];
        const kept = next.slice(0, MAX_TOASTS);
        const dropped = next.slice(MAX_TOASTS);
        dropped.forEach((toast) => clearToastTimer(toast.id));
        return kept;
      });
      startTimer(toastId, duration);
      return toastId;
    },
    [clearToastTimer, startTimer],
  );

  useEffect(() => () => {
    timersRef.current.forEach((timer) => {
      if (timer.timeoutId) {
        window.clearTimeout(timer.timeoutId);
      }
    });
    timersRef.current.clear();
  }, []);

  const value = useMemo(
    () => ({
      notify,
      dismiss,
      pause,
      resume,
      success(message, options = {}) {
        return notify({ ...options, message, variant: "success" });
      },
      error(message, options = {}) {
        return notify({ ...options, message, variant: "error" });
      },
      info(message, options = {}) {
        return notify({ ...options, message, variant: "info" });
      },
    }),
    [dismiss, notify, pause, resume],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} onPause={pause} onResume={resume} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used inside NotificationProvider.");
  }
  return context;
}
