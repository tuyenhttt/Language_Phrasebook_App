import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("theme");
      if (stored) setIsDark(stored === "dark");
      else setIsDark(Appearance.getColorScheme() === "dark");
    })();
  }, []);

  const toggleTheme = async () => {
    setIsDark((prev) => {
      AsyncStorage.setItem("theme", !prev ? "dark" : "light");
      return !prev;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
