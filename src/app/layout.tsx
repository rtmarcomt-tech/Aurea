import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://aurea.pt"),
  title: { default: "AureA — MultiMedia Digital Solutions", template: "%s | AureA" },
  description: "Estratégia, criatividade e tecnologia para construir marcas, experiências e soluções digitais com propósito.",
  openGraph: {
    title: "AureA — MultiMedia Digital Solutions",
    description: "Estratégia, criatividade e tecnologia para construir marcas, experiências e soluções digitais com propósito.",
    type: "website",
    locale: "pt_PT",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-PT"><body>{children}</body></html>;
}
