"use client";

import React from "react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "style"> {
  style?: React.CSSProperties;
}

export function Input({ className = "", style = {}, ...props }: InputProps) {
  return (
    <input
      className={className}
      {...props}
      style={{
        width: "100%",
        boxSizing: "border-box",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        background: "var(--card)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        padding: "10px 14px",
        ...style,
      }}
    />
  );
}
