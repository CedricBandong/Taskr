"use client";

import React from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "default" | "icon";

const VARIANTS: Record<
  Variant,
  { bg: string; fg: string; border: string; hoverBg: string }
> = {
  primary: {
    bg: "var(--primary)",
    fg: "var(--primary-foreground)",
    border: "transparent",
    hoverBg: "var(--primary)",
  },
  outline: {
    bg: "var(--card)",
    fg: "#5a5670",
    border: "var(--border)",
    hoverBg: "var(--card)",
  },
  ghost: {
    bg: "transparent",
    fg: "var(--faint-foreground)",
    border: "transparent",
    hoverBg: "var(--incomplete-bg)",
  },
};

const SIZES: Record<Size, { h: number; px: number; fs: string; w?: number }> = {
  sm: { h: 34, px: 14, fs: "13.5px" },
  default: { h: 42, px: 16, fs: "14px" },
  icon: { h: 28, px: 0, fs: "15px", w: 28 },
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  variant?: Variant;
  size?: Size;
  style?: React.CSSProperties;
}

export function Button({
  variant = "primary",
  size = "default",
  disabled = false,
  className = "",
  style = {},
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const [hover, setHover] = React.useState(false);

  return (
    <button
      type={type}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={className}
      {...props}
      style={{
        background: hover && !disabled ? v.hoverBg : v.bg,
        color: v.fg,
        border: `1px solid ${v.border}`,
        borderRadius: "var(--radius)",
        opacity: disabled ? 0.6 : 1,
        filter: hover && !disabled && variant === "primary" ? "brightness(1.08)" : "none",
        fontFamily: "var(--font-display)",
        fontWeight: variant === "primary" ? 700 : 600,
        fontSize: s.fs,
        height: s.h,
        width: s.w,
        padding: `0 ${s.px}px`,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        whiteSpace: "nowrap",
        transition: "background 140ms ease, filter 140ms ease, color 140ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
