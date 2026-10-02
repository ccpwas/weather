"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import clsx from "clsx";

type Theme = "light" | "dark" | "system";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    if (newTheme === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  if (!mounted) return null;

  return (
    <div className="flex bg-black/5 dark:bg-white/10 rounded-full p-1 w-fit glass">
      <button
        onClick={() => handleThemeChange("light")}
        className={clsx(
          "p-2 rounded-full transition-colors",
          theme === "light" ? "bg-white dark:bg-white/20 shadow-sm text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        )}
        aria-label="Light mode"
      >
        <Sun size={18} />
      </button>
      <button
        onClick={() => handleThemeChange("system")}
        className={clsx(
          "p-2 rounded-full transition-colors",
          theme === "system" ? "bg-white dark:bg-white/20 shadow-sm text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        )}
        aria-label="System mode"
      >
        <Monitor size={18} />
      </button>
      <button
        onClick={() => handleThemeChange("dark")}
        className={clsx(
          "p-2 rounded-full transition-colors",
          theme === "dark" ? "bg-white dark:bg-white/20 shadow-sm text-black dark:text-white" : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        )}
        aria-label="Dark mode"
      >
        <Moon size={18} />
      </button>
    </div>
  );
}
