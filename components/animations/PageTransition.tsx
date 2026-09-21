import { ReactNode } from "react";

export default function PageTransition({ children, ...props }: any) {
  return (
    <main {...props}>
      {children}
    </main>
  );
}
