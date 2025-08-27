"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

function ToastItem({ toast, onClose }) {
  const { id, message, type } = toast;
  const base = "pointer-events-auto mb-3 w-80 max-w-[90vw] rounded-md border px-4 py-3 shadow-lg text-sm flex items-start gap-2";
  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className={`${base} ${styles[type] || styles.info}`} role="status">
      <div className="mt-0.5">
        {type === 'success' && '✔️'}
        {type === 'error' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </div>
      <div className="flex-1">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="ml-2 text-xs opacity-70 hover:opacity-100"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((message, type = 'info') => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const api = useMemo(() => ({
    success: (msg) => push(msg, 'success'),
    error: (msg) => push(msg, 'error'),
    info: (msg) => push(msg, 'info'),
  }), [push]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const originalAlert = window.alert;
    window.alert = (message) => {
      try {
        api.info(String(message));
      } catch (_e) {
        console.log('[toast:info]', message);
      }
    };
    return () => {
      window.alert = originalAlert;
    };
  }, [api]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Container */}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col items-end">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Provide a no-op fallback to avoid crashes if used outside provider
    return {
      success: (msg) => console.log('[toast:success]', msg),
      error: (msg) => console.error('[toast:error]', msg),
      info: (msg) => console.info('[toast:info]', msg),
    };
  }
  return ctx;
}


