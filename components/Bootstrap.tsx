"use client";
import React, { useEffect } from "react";
import gsap from "gsap";

const Bootstrap = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    import("bootstrap");
    
    // Configurar GSAP para silenciar warnings cuando los elementos no existen
    if (typeof window !== "undefined") {
      // Silenciar warnings de GSAP cuando los targets no se encuentran
      const originalWarn = console.warn;
      console.warn = (...args: any[]) => {
        // Filtrar warnings de GSAP sobre targets no encontrados
        if (args[0] && typeof args[0] === "string" && args[0].includes("GSAP target") && args[0].includes("not found")) {
          return; // Silenciar este warning
        }
        originalWarn.apply(console, args);
      };
      
      // Restaurar console.warn al desmontar
      return () => {
        console.warn = originalWarn;
      };
    }
  }, []);
  return <>{children}</>;
};

export default Bootstrap;
