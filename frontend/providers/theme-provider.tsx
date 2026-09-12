"use client";

import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  mounted: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

function applyThemeToDOM(t: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (t === "light") {
    root.classList.remove("dark");
    root.classList.add("light");
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
    document.body.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
  } else {
    root.classList.remove("light");
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
    document.body.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
  }
}

const themeListeners = new Set<() => void>();

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", callback);
  }
  return () => {
    themeListeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", callback);
    }
  };
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem("pixer-theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    // ignore
  }
  return "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

const emptySubscribe = () => () => {};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem("pixer-theme", newTheme);
    } catch {
      // ignore
    }
    applyThemeToDOM(newTheme);
    themeListeners.forEach((listener) => listener());
  }, []);

  const toggleTheme = useCallback(() => {
    const current = getThemeSnapshot();
    const nextTheme: Theme = current === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("pixer-theme", nextTheme);
    } catch {
      // ignore
    }
    applyThemeToDOM(nextTheme);
    themeListeners.forEach((listener) => listener());
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, mounted: isClient, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

