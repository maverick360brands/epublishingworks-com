"use client";

import Script from "next/script";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

export type TurnstileHandle = { reset: () => void };

/**
 * Cloudflare Turnstile widget. Inside a <form> it adds the hidden `cf-turnstile-response` field
 * the API route verifies. `onToken` gets the token, or "" when it expires or fails.
 */
export const Turnstile = forwardRef<TurnstileHandle, { siteKey: string; onToken: (token: string) => void }>(function Turnstile({ siteKey, onToken }, ref) {
  const el = useRef<HTMLDivElement>(null);
  const id = useRef<string | null>(null);
  const cb = useRef(onToken);
  useEffect(() => {
    cb.current = onToken;
  }, [onToken]);

  const render = useCallback(() => {
    if (!el.current || !window.turnstile || id.current) return;
    id.current = window.turnstile.render(el.current, {
      sitekey: siteKey,
      callback: (t: string) => cb.current(t),
      "expired-callback": () => cb.current(""),
      "error-callback": () => cb.current(""),
    });
  }, [siteKey]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      cb.current("");
      if (id.current) window.turnstile?.reset(id.current);
    },
  }));

  useEffect(() => {
    render();
    return () => {
      if (id.current) window.turnstile?.remove(id.current);
      id.current = null;
    };
  }, [render]);

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={render} />
      <div ref={el} />
    </>
  );
});
