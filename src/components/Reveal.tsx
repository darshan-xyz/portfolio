import type { ReactNode } from "react";

/** Plain wrapper — scroll reveal animations have been removed. */
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
