import React from "react";

export interface LabelProps {
  children?: React.ReactNode;
  htmlFor?: string;
  style?: React.CSSProperties;
}

export function Label({ children, htmlFor, style = {} }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: "12.5px",
        fontWeight: 600,
        color: "var(--muted-foreground)",
        display: "block",
        marginBottom: 6,
        ...style,
      }}
    >
      {children}
    </label>
  );
}
