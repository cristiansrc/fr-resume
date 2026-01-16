"use client";

import { useEffect } from "react";
import { SEOHead } from "./SEOHead";

export const DynamicHead = () => {
  useEffect(() => {
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
  }, []);

  return <SEOHead />;
};
