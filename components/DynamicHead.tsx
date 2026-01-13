"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export const DynamicHead = () => {
  const { language } = useLanguage();

  useEffect(() => {
    // Update document title based on language
    const title = language === "es" 
      ? "cristiansrc - Hoja de vida" 
      : "cristiansrc - Personal Portfolio";
    
    document.title = title;

    // Update favicon with cache busting
    const updateFavicon = () => {
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach(link => link.remove());

      // Create new favicon link with timestamp to force reload
      const timestamp = new Date().getTime();
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = `/favicon.svg?v=${timestamp}`;
      document.getElementsByTagName("head")[0].appendChild(link);

      // Also add shortcut icon
      const shortcutLink = document.createElement("link");
      shortcutLink.rel = "shortcut icon";
      shortcutLink.type = "image/svg+xml";
      shortcutLink.href = `/favicon.svg?v=${timestamp}`;
      document.getElementsByTagName("head")[0].appendChild(shortcutLink);
    };

    updateFavicon();
  }, [language]);

  return null;
};
