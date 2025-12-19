import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "../lib/theme/theme-context";
import { Layout } from "../components/layout/Layout";

export const metadata: Metadata = {
  title: "Portfolio Website",
  description: "A modern portfolio showcasing Frontend Engineering, Machine Learning, and Generative AI expertise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="antialiased theme-transition">
        <ThemeProvider>
          {/* Skip to main content link for keyboard navigation */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          
          <Layout>
            <main id="main-content" role="main" tabIndex={-1}>
              {children}
            </main>
          </Layout>
        </ThemeProvider>
      </body>
    </html>
  );
}
