import { useState, useEffect, useCallback } from "react";
import { Theme } from "../types";

const THEME_STORAGE_KEY = "theme";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "dark" ? { mode: "dark" } : { mode: "light" };
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => ({
      mode: prev.mode === "light" ? "dark" : "light",
    }));
  }, []);

  const setThemeMode = useCallback((mode: "light" | "dark") => {
    setTheme({ mode });
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (theme.mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem(THEME_STORAGE_KEY, theme.mode);
  }, [theme.mode]);

  return {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: theme.mode === "dark",
  };
};
