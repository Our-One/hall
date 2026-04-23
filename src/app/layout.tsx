import type { Metadata } from "next";
import { Bitter, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Our.one / Hall",
    template: "%s — Our.one / Hall",
  },
  description:
    "The governance platform for Our.one. Where members vote on what gets built, watch the treasury, and see every shipping decision.",
  metadataBase: new URL("https://hall.our.one"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Our.one / Hall",
    description:
      "The governance platform for Our.one. Members vote, watch the treasury, see every ship.",
    url: "https://hall.our.one",
    siteName: "Our.one / Hall",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Our.one / Hall — the governance platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our.one / Hall",
    description: "Where Our.one members vote, watch the treasury, and see every ship.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bitter.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable} antialiased bg-[#FDFBF7] text-stone-900`}
      >
        {children}
      </body>
    </html>
  );
}
