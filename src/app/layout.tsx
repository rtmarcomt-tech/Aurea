import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AureA", template: "%s | AureA" },
  description: "Soluções digitais. Criatividade. Tecnologia.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-PT"><body>{children}</body></html>;
}
