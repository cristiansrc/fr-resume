"use client";
import { useEffect } from "react";

// Extender la interfaz Window para incluir las funciones del easter egg
declare global {
  interface Window {
    unlock?: () => string;
  }
}

/**
 * ConsoleEasterEgg Component
 * 
 * Un huevo de pascua interactivo que se muestra en la consola del navegador.
 * Los visitantes pueden descubrir información adicional escribiendo unlock() en la consola.
 * 
 * @component
 */
const ConsoleEasterEgg = () => {
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === "undefined") return;

    // 🎨 DEFINICIÓN DE ESTILOS (Cyberpunk Theme)
    const titleStyle = [
      "font-size: 50px",
      "font-weight: bold",
      "font-family: monospace",
      "color: #222",
      "text-shadow: 2px 2px 0px #f0f, -2px -2px 0px #0ff", // Efecto Glitch Neon
    ].join(";");

    const systemStyle = [
      "color: #0ff",
      "font-family: monospace",
      "font-size: 14px",
    ].join(";");

    const warningStyle = [
      "background: #000",
      "color: #ff0055", // Rojo neón
      "padding: 5px 10px",
      "font-family: monospace",
      "border: 1px solid #ff0055",
    ].join(";");

    // 🖥️ SECUENCIA DE INICIO (Lo que se ve al abrir F12)
    console.clear(); // Limpiamos basura del navegador
    console.log("%cCristianSRC", titleStyle);
    console.log("%c[SYSTEM] 🟢 Sandevistan OS... ONLINE", systemStyle);
    console.log("%c[SYSTEM] 🔍 Scanning visitor skills... ACCEPTED", systemStyle);
    console.log("%c[SECURE] 🔒 Contact info is ENCRYPTED.", systemStyle);

    // El gancho para el usuario
    console.log(
      "\n%c⚠️ TO DECRYPT: Type %cunlock()%c in the console and press Enter.",
      warningStyle,
      "color: #0ff; font-weight: bold; font-size: 16px;",
      warningStyle,
    );

    // 🔓 LA FUNCIÓN OCULTA (Global)
    window.unlock = () => {
      console.clear();

      // Animación simulada en consola
      console.log("%c🔓 ACCESS GRANTED", "font-size: 30px; color: #0f0; font-family: monospace;");
      console.log("%c----------------------------------------", "color: #666");

      // Presentación de datos técnica
      console.group("📦 DECRYPTED PACKAGE: User_Profile");
      console.log("User:     Cristian SRC {c/src}");
      console.log("Role:     Full Stack Developer, tech lead (Java/React)");
      console.log("Loc:      Bogotá, Colombia");
      console.log("Stack:    [Spring Boot, React, AWS, Python]");
      console.log("Status:   Ready to Code 🚀");
      console.groupEnd();

      // Información del proyecto actual
      console.group("🛠️ CURRENT PROJECT: Portfolio");
      console.log("Framework: Next.js 14 (React 18)");
      console.log("Animations: GSAP + ScrollTrigger");
      console.log("Styling:   SCSS + Bootstrap 5");
      console.log("Icons:     Phosphor Icons");
      console.log("Type:      TypeScript");
      console.groupEnd();

      // El correo final resaltado
      console.log(
        "\n%c📬 SEND PAYLOAD TO: \n\n%c contact@cristiansrc.com ",
        "font-family: monospace; font-size: 14px; color: #fff;",
        "background: #000; color: #0f0; font-size: 18px; padding: 10px; border: 2px dashed #0f0;",
      );

      return "Protocol 'Hire_Me' initiated."; // Esto sale como valor de retorno (la flechita <)
    };

    // Cleanup (Buena práctica de React para no dejar basura si el componente se desmonta)
    return () => {
      if (window.unlock) {
        delete window.unlock;
      }
    };
  }, []);

  // Este componente no renderiza nada en el DOM
  return null;
};

export default ConsoleEasterEgg;
