import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageContext = createContext({
  language: "en",
  setLanguage: (lang: string) => {},
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("language");
      if (stored) setLanguageState(stored);
    })();
  }, []);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    await AsyncStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
