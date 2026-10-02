import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import WeatherWidget from "@/components/WeatherWidget";
import PushToggle from "@/components/PushToggle";
import { getLocale } from "next-intl/server";
import { HKOLang } from "@/lib/hko-api";

export default async function Home() {
  const locale = (await getLocale()) as HKOLang;

  return (
    <main className="min-h-screen p-6 md:p-12 flex flex-col items-center justify-center relative bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
      <div className="absolute top-6 right-6 flex items-center space-x-3 z-50">
         <PushToggle />
         <ThemeToggle />
         <LanguageToggle />
      </div>

      <div className="w-full max-w-sm z-10">
         <WeatherWidget locale={locale} />
      </div>

      {/* Decorative ambient blurred blobs behind the glass */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen" />
    </main>
  );
}
