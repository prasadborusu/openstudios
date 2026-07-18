import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenStudios | Building Products That Matter",
  description:
    "OpenStudios is an early-stage technology startup focused on designing and building thoughtful digital products and meaningful digital experiences.",
  keywords: [
    "OpenStudios",
    "Technology Startup",
    "Digital Products",
    "Product Design",
    "Software Development",
    "Early Stage Startup",
    "UX UI Design",
    "India Tech Startup",
  ],
  authors: [{ name: "OpenStudios Team" }],
  metadataBase: new URL("https://openstudios.co.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "OpenStudios | Building Products That Matter",
    description:
      "OpenStudios is an early-stage technology startup focused on designing and building thoughtful digital products and meaningful digital experiences.",
    url: "https://openstudios.co.in",
    siteName: "OpenStudios",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/logo_web.png",
        width: 800,
        height: 600,
        alt: "OpenStudios Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenStudios | Building Products That Matter",
    description:
      "OpenStudios is an early-stage technology startup focused on designing and building thoughtful digital products and meaningful digital experiences.",
    images: ["/logo_web.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Structured Data Schema for Organization
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "OpenStudios",
    "alternateName": "OpenStudios India",
    "url": "https://openstudios.co.in",
    "logo": "https://openstudios.co.in/logo_web.png",
    "description": "An early-stage technology startup focused on designing and building thoughtful digital products.",
    "sameAs": [
      "https://github.com/openstudios-co-in",
      "https://www.linkedin.com/company/135106665",
      "https://www.instagram.com/openstudios.co.in",
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full bg-white text-slate-900 selection:bg-[#2563EB]/10 selection:text-slate-900 flex flex-col">
        {children}
      </body>
    </html>
  );
}
