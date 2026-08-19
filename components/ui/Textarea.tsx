"use client";

import React from "react";

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "style"> {
  style?: React.CSSProperties;
}

export function Textarea({ className = "", style = {}, rows = 3, ...props }: TextareaProps) {
  return (
    <textarea
      className={className}
      rows={rows}
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
        padding: "10px 12px",
        resize: "none",
        ...style,
      }}
    />
  );
}
