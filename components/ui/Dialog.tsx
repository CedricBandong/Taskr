"use client";

import React from "react";
import { gsap } from "gsap";

export interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (open && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: "power2.out" }
      );
    }
  }, [open]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--overlay)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={() => onOpenChange?.(false)}
    >
      <div ref={contentRef} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export function DialogContent({
  children,
  style = {},
}: React.PropsWithChildren<{ style?: React.CSSProperties }>) {
  return (
    <div
      style={{
        background: "var(--card)",
        borderRadius: "var(--radius-xl)",
        width: 420,
        maxWidth: "90vw",
        padding: 28,
        boxShadow: "var(--shadow-modal)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function DialogTitle({ children }: React.PropsWithChildren) {
  return (
    <div
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: 18,
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
}

export function DialogFooter({ children }: React.PropsWithChildren) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
      {children}
    </div>
  );
}
