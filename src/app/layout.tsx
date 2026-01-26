import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redirección segura - Genesis Sign",
  description: "Redirección segura para firmar documentos desde WhatsApp.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
