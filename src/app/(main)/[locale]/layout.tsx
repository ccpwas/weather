import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import { NextIntlClientProvider } from 'next-intl';

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'tc' }, { locale: 'sc' }];
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "HK Weather",
  description: "A minimal weather app for Hong Kong",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HK Weather",
  },
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;

  // Dynamically import messages based on locale for static generation
  let messages;
  try {
    messages = (await import(`../../../../messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`../../../../messages/en.json`)).default; // Fallback
  }

  return (
    <html lang={locale}>
      <head>
        <link rel="apple-touch-icon" href="/weather/apple-icon.png" />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="min-h-[100dvh] flex flex-col relative pb-12">
            {children}
            <footer className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-400 dark:text-gray-500 font-mono tracking-widest uppercase pointer-events-none">
              built by cc, @ccpwas, 2026
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
