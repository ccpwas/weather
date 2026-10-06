"use client";

import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";

type Locale = "en" | "tc" | "sc";

export default function LanguageToggle() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const match = document.cookie.match(/(?:^|;)\s*NEXT_LOCALE=([^;]+)/);
    if (match) {
      setLocale(match[1] as Locale);
    }
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.push(`/${newLocale}`);
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-black/5 dark:bg-white/10 rounded-full p-1 w-fit glass">
      <button
        onClick={() => handleLanguageChange("en")}
        className={clsx(
          "px-3 py-1 rounded-full text-sm font-medium transition-colors",
          locale === "en" ? "bg-white dark:bg-white/20 shadow-sm text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        )}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange("tc")}
        className={clsx(
          "px-3 py-1 rounded-full text-sm font-medium transition-colors",
          locale === "tc" ? "bg-white dark:bg-white/20 shadow-sm text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        )}
      >
        繁
      </button>
      <button
        onClick={() => handleLanguageChange("sc")}
        className={clsx(
          "px-3 py-1 rounded-full text-sm font-medium transition-colors",
          locale === "sc" ? "bg-white dark:bg-white/20 shadow-sm text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        )}
      >
        简
      </button>
    </div>
  );
}
