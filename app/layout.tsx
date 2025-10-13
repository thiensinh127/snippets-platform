import SiteFooter from "@/components/common/SiteFooter";
import SiteHeader from "@/components/common/SiteHeader";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { defaultLocale, isLocale, Locale } from "@/lib/i18n";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "CodeShare - Share Code Snippets with Developers",
    template: "%s | CodeShare",
  },
  description:
    "Discover, share, and learn from code snippets across multiple programming languages. Join our community of developers sharing knowledge through code.",
  keywords: [
    "code snippets",
    "programming",
    "developer tools",
    "code sharing",
    "javascript",
    "python",
    "react",
    "nextjs",
  ],
  icons: "/logo.svg",
  authors: [{ name: "CodeShare Team" }],
  creator: "CodeShare",
  publisher: "CodeShare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      vi: "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "CodeShare - Share Code Snippets with Developers",
    description:
      "Discover, share, and learn from code snippets across multiple programming languages.",
    siteName: "CodeShare",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CodeShare - Share Code Snippets",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeShare - Share Code Snippets with Developers",
    description:
      "Discover, share, and learn from code snippets across multiple programming languages.",
    images: ["/og-image.png"],
    creator: "@codeshare",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const locale: Locale = isLocale(cookieLocale)
    ? (cookieLocale as Locale)
    : defaultLocale;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <NextIntlClientProvider
            messages={messages}
            locale={locale}
            timeZone="UTC"
          >
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              {/* Global Header */}
              <SiteHeader />
              {/* Page Content */}
              <main className="flex-1">
                {children}
                {modal}
              </main>
              {/* Global Footer */}
              <SiteFooter />
            </div>
          </NextIntlClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
