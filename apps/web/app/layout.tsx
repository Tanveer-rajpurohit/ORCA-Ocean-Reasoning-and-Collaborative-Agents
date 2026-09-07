import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { interTight, fontMono, instrumentSerif } from "./fonts";

export const metadata: Metadata = {
  title: {
    default: "ORCA | Marine Ecosystem Reasoning with Collaborative Agents",
    template: "%s | ORCA",
  },
  description:
    "Agentic AI platform fusing live satellite, weather, and ocean feeds into one Indic voice and map interface for coastal safety and fisheries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${fontMono.variable} ${instrumentSerif.variable}`}
    >
      <body className="font-intert antialiased">{children}</body>
    </html>
  );
}
