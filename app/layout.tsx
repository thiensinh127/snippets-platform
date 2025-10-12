import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    template: "%s | CodeShare"
  },
  description: "Discover, share, and learn from code snippets across multiple programming languages. Join our community of developers sharing knowledge through code.",
  keywords: ["code snippets", "programming", "developer tools", "code sharing", "javascript", "python", "react", "nextjs"],
  authors: [{ name: "CodeShare Team" }],
  creator: "CodeShare",
  publisher: "CodeShare",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CodeShare - Share Code Snippets with Developers',
    description: 'Discover, share, and learn from code snippets across multiple programming languages.',
    siteName: 'CodeShare',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CodeShare - Share Code Snippets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeShare - Share Code Snippets with Developers',
    description: 'Discover, share, and learn from code snippets across multiple programming languages.',
    images: ['/og-image.png'],
    creator: '@codeshare',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
