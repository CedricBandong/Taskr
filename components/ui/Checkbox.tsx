import React from "react";

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: number;
  style?: React.CSSProperties;
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  size = 22,
  style = {},
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onCheckedChange?.(!checked);
      }}
      style={{
        width: size,
        height: size,
        padding: 0,
        cursor: "pointer",
        background: checked ? "var(--primary)" : "var(--card)",
        border: `2px solid ${checked ? "var(--primary)" : "#d8d5e6"}`,
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "background 140ms ease, border-color 140ms ease",
        ...style,
      }}
    >
      {checked && (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8.5L6.2 11.5L13 4.5"
            stroke="var(--primary-foreground)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
