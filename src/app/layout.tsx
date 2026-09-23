import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { PaletteProvider } from "@/lib/palette-context";
import { ToastProvider } from "@/components/ui/toast-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mahkota Drive",
  description: "Fleet Rental Management System",
  icons: {
    icon: "/logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                    if (!localStorage.getItem('theme')) {
                      if (e.matches) {
                        document.documentElement.classList.add('dark');
                      } else {
                        document.documentElement.classList.remove('dark');
                      }
                    }
                  });
                  var palette = localStorage.getItem('colorPalette');
                  document.documentElement.setAttribute('data-palette', palette === 'gold' ? 'gold' : 'blue');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased overflow-hidden`}
      >
        <AuthProvider>
          <PaletteProvider>
            <div className="flex h-screen w-full overflow-hidden">{children}</div>
            <ToastProvider />
          </PaletteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}