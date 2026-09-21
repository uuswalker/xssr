import { ReactNode } from "react";

export default function PageTransition({ children, ...props }: any) {
  return (
    <main className="page-transition-enter" {...props}>
      {children}
    </main>
  );
}
