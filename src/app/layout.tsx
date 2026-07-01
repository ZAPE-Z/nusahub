import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "@/styles/globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import BottomNavigation from "@/components/layout/BottomNavigation";
import Drawer from "@/components/layout/Drawer";
import FAB from "@/components/layout/FAB";
import ToastContainer from "@/components/shared/ToastContainer";
import OverlaySystem from "@/components/shared/OverlaySystem";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "NusaHub MVP",
  description: "Unified AI-First Super App Platform for Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased min-h-screen bg-background text-text-primary`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {/* Unified Mobile Viewport Constraint Box */}
            <div className="relative min-h-screen max-w-[768px] mx-auto bg-surface border-x border-text-muted/10 shadow-medium flex flex-col pt-14 pb-16">
              <Navbar />
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
              <FAB />
              <BottomNavigation />
              <Drawer />
              <ToastContainer />
              <OverlaySystem />
            </div>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
