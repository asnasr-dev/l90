import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  to: string;
  className?: string;
  children: ReactNode;
};

export function CtaLink({ to, className, children }: Props) {
  const external = /^https?:\/\//i.test(to.trim());
  if (external) {
    return (
      <a className={className} href={to.trim()} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={to.trim() || "/"}>
      {children}
    </Link>
  );
}
