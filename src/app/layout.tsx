import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "../context/useStore";
import Header from "../components/Header";
import AdminDashboard from "../components/AdminDashboard";
import NewsletterFooter from "../components/NewsletterFooter";

export const metadata: Metadata = {
  title: "HerCloset | Discover, Save & Shop Women's Fashion",
  description: "Curating kurtis, sarees, dresses, handbags, and beauty products from Amazon India. Styled coordinates complete the look automatically.",
  keywords: ["amazon fashion finds", "indian kurtis", "wedding sarees", "style boards", "amazon associates india", "women's fashion inspiration"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-brand-cream/15 text-brand-slate pb-20 lg:pb-0">
        <StoreProvider>
          {/* Performance & Pinterest Admin Dashboard Panel */}
          <AdminDashboard />
          
          {/* Navigation Bar Header */}
          <Header />
          
          {/* Main Route Content */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
            {children}
          </main>
          
          {/* Editorial Newsletter Capture Footer */}
          <NewsletterFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
