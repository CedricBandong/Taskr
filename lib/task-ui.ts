export function statusBadge(completed: boolean) {
  return completed
    ? { label: "Completed", bg: "var(--success-bg)", fg: "var(--success-fg)" }
    : { label: "Incomplete", bg: "var(--incomplete-bg)", fg: "var(--incomplete-fg)" };
}
