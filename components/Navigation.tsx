import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import shuffleLetters from "shuffle-letters";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useResume } from "@/contexts/ResumeContext";
import { downloadCurriculumPdf } from "@/api";

const Navigation = ({ setNavOpen, navOpen }: { setNavOpen: Dispatch<SetStateAction<boolean>>; navOpen: boolean }) => {
  const navRef = useRef<HTMLElement>(null);
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { data } = useResume();

  // Track previous language to detect changes
  const prevLanguageRef = React.useRef<"en" | "es">(language);
  
  // Scroll to top when language changes
  React.useEffect(() => {
    if (prevLanguageRef.current !== language) {
      prevLanguageRef.current = language;
      // Scroll to top after language change
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 150);
      });
    }
  }, [language]);

  const handleLanguageSwitch = (e: React.MouseEvent) => {
    e.preventDefault();
    setLanguage(language === "en" ? "es" : "en");
    setNavOpen(false);
  };

  const handleResumeDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    const lang = language === "es" ? "spanish" : "english";
    try {
      await downloadCurriculumPdf(lang);
    } catch (error) {
      console.error("Error downloading resume:", error);
    }
    setNavOpen(false);
  };

  // Build LinkedIn URL with locale parameter for English
  const getLinkedInUrl = (): string => {
    if (!data?.basicData?.linkedin) return "";
    
    let baseUrl = data.basicData.linkedin.trim();
    
    if (language === "en") {
      // Remove existing locale parameter if present
      baseUrl = baseUrl.replace(/[?&]locale=[^&]*/g, "");
      // Clean up trailing ? or /? if they exist
      baseUrl = baseUrl.replace(/[\/\?]+$/, "");
      
      // Add locale parameter
      // Check if URL already has query parameters
      if (baseUrl.includes("?")) {
        return `${baseUrl}&locale=en_US`;
      } else {
        return `${baseUrl}/?locale=en_US`;
      }
    } else {
      // Remove locale parameter for Spanish
      baseUrl = baseUrl.replace(/[?&]locale=[^&]*/g, "");
      // Clean up trailing ? or /? if they exist
      baseUrl = baseUrl.replace(/[\/\?]+$/, "");
      return baseUrl;
    }
  };

  useEffect(() => {
    // Map para guardar el texto original de cada elemento
    const originalTexts = new Map<HTMLElement, string>();
    const activeTimeouts = new Map<HTMLElement, NodeJS.Timeout>();
    
    const handleClassChange = (mutationsList: MutationRecord[], observer: MutationObserver) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const target = mutation.target as HTMLElement;
          const textElement = target.querySelector(".text") as HTMLElement;
          
          if (target.classList.contains("active") && textElement) {
            // Limpiar timeout anterior si existe
            const existingTimeout = activeTimeouts.get(textElement);
            if (existingTimeout) {
              clearTimeout(existingTimeout);
              activeTimeouts.delete(textElement);
            }
            
            // Guardar el texto original si no lo tenemos
            if (!originalTexts.has(textElement)) {
              originalTexts.set(textElement, textElement.textContent?.trim() || "");
            }
            
            const originalText = originalTexts.get(textElement) || textElement.textContent?.trim() || "";
            
            // Aplicar shuffleLetters
            shuffleLetters(textElement, { iterations: 5 });
            
            // Restaurar el texto original después de la animación
            // shuffleLetters con 5 iteraciones típicamente toma ~500-800ms
            const restoreTimeout = setTimeout(() => {
              if (textElement && textElement.textContent !== originalText) {
                textElement.textContent = originalText;
              }
              activeTimeouts.delete(textElement);
            }, 1000); // Dar tiempo suficiente para que termine la animación
            
            activeTimeouts.set(textElement, restoreTimeout);
          } else if (textElement && !target.classList.contains("active")) {
            // Si el elemento ya no está activo, restaurar el texto inmediatamente
            const existingTimeout = activeTimeouts.get(textElement);
            if (existingTimeout) {
              clearTimeout(existingTimeout);
              activeTimeouts.delete(textElement);
            }
            
            const originalText = originalTexts.get(textElement);
            if (originalText && textElement.textContent !== originalText) {
              textElement.textContent = originalText;
            }
          }
        }
      });
    };

    const observer = new MutationObserver(handleClassChange);
    const config = { attributes: true, subtree: true, attributeFilter: ["class"] };

    if (navRef.current) {
      observer.observe(navRef.current, config);
    }

    return () => {
      observer.disconnect();
      // Limpiar todos los timeouts pendientes
      activeTimeouts.forEach((timeout) => clearTimeout(timeout));
      activeTimeouts.clear();
      originalTexts.clear();
    };
  }, []);

  useGSAP(() => {
    gsap.to(".navigation", { "--height": "100%", duration: 1, ease: "power1.inOut" });
    gsap.from(".nav-link", { duration: 0.8, delay: 0.5, opacity: 0, stagger: 0.1 });
  });

  // Store the time when the component mounts to calculate relative delays
  const mountTimeRef = useRef<number>(Date.now());
  
  // Animate LinkedIn and GitHub links when they appear (after data loads)
  // They should appear after "Hoja de vida" (06), so LinkedIn (07) and GitHub (08)
  // The initial animation starts with delay 0.5s and stagger 0.1s per item
  useEffect(() => {
    if (data?.basicData?.linkedin || data?.basicData?.github) {
      // Wait a bit for DOM to update
      const timer = setTimeout(() => {
        const linkedInLink = navRef.current?.querySelector('[data-social="linkedin"]') as HTMLElement;
        const githubLink = navRef.current?.querySelector('[data-social="github"]') as HTMLElement;
        
        // Calculate the correct delay based on position in the menu
        // Initial delay: 0.5s, stagger: 0.1s per item
        // "Hoja de vida" is 06, so it appears at 0.5 + (5 * 0.1) = 1.0s (0-indexed: position 5)
        // LinkedIn is 07, so it should appear at 0.5 + (6 * 0.1) = 1.1s (0-indexed: position 6)
        // GitHub is 08, so it should appear at 0.5 + (7 * 0.1) = 1.2s (0-indexed: position 7)
        
        const initialDelay = 0.5;
        const staggerDelay = 0.1;
        const linkedInPosition = 6; // 0-indexed position (7th item)
        const githubPosition = 7; // 0-indexed position (8th item)
        
        // Calculate when these should appear relative to component mount
        const linkedInTargetTime = initialDelay + (linkedInPosition * staggerDelay);
        const githubTargetTime = initialDelay + (githubPosition * staggerDelay);
        
        // Calculate how much time has passed since mount
        const timeSinceMount = (Date.now() - mountTimeRef.current) / 1000; // Convert to seconds
        
        // Calculate remaining delay needed (if data loaded late, use minimal delay)
        const linkedInDelay = Math.max(0.05, linkedInTargetTime - timeSinceMount);
        const githubDelay = Math.max(0.05, githubTargetTime - timeSinceMount);
        
        if (linkedInLink) {
          gsap.set(linkedInLink, { opacity: 0 });
          gsap.to(linkedInLink, {
            duration: 0.8,
            opacity: 1,
            delay: linkedInDelay,
            ease: "power2.out"
          });
        }
        
        if (githubLink) {
          gsap.set(githubLink, { opacity: 0 });
          gsap.to(githubLink, {
            duration: 0.8,
            opacity: 1,
            delay: githubDelay,
            ease: "power2.out"
          });
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [data?.basicData?.linkedin, data?.basicData?.github]);

  return (
    <>
      <nav ref={navRef} className={`navigation ${navOpen ? "opened" : ""}`} id="navigation">
        <div className="mb-4 d-xl-none">
          <Logo showText={true} />
        </div>
        <ul>
          <li onClick={() => setNavOpen(false)} className="nav-link">
            <Link href="#top" className="active">
              <span>01</span> <span className="text">{t("navigation.top")}</span>{" "}
            </Link>
          </li>
          <li onClick={() => setNavOpen(false)} className="nav-link">
            <Link href="#about_me">
              <span>02</span> <span className="text">{t("navigation.aboutMe")}</span>{" "}
            </Link>
          </li>
          <li onClick={() => setNavOpen(false)} className="nav-link">
            <Link href="#attainments">
              <span>03</span> <span className="text">{t("navigation.skills")}</span>{" "}
            </Link>
          </li>
          <li onClick={() => setNavOpen(false)} className="nav-link">
            <Link href="#experience">
              <span>04</span> <span className="text">{t("navigation.experiences")}</span>{" "}
            </Link>
          </li>
          <li onClick={() => setNavOpen(false)} className="nav-link">
            <Link href="#contact">
              <span>05</span> <span className="text">{t("navigation.contact")}</span>{" "}
            </Link>
          </li>
          <li onClick={handleResumeDownload} className="nav-link">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <span>06</span> <span className="text">{t("navigation.resume")}</span>{" "}
            </a>
          </li>
          {data?.basicData?.linkedin && (
            <li onClick={() => setNavOpen(false)} className="nav-link" data-social="linkedin">
              <a href={getLinkedInUrl()} target="_blank" rel="noopener noreferrer">
                <span>07</span> <span className="text">{t("navigation.linkedin")}</span>{" "}
              </a>
            </li>
          )}
          {data?.basicData?.github && (
            <li onClick={() => setNavOpen(false)} className="nav-link" data-social="github">
              <a href={data.basicData.github} target="_blank" rel="noopener noreferrer">
                <span>08</span> <span className="text">{t("navigation.github")}</span>{" "}
              </a>
            </li>
          )}
          <li onClick={handleLanguageSwitch} className="nav-link">
            <a href="#" onClick={(e) => e.preventDefault()}>
              <span>09</span> <span className="text">{t("navigation.switchLanguage")}</span>{" "}
            </a>
          </li>
        </ul>
        <div className="contact">
          <Link href={data?.basicData?.email ? `mailto:${data.basicData.email}` : "mailto:emily@devis.com"}>
            {data?.basicData?.email || "emily@devis.com"}
          </Link>
        </div>
      </nav>
      <div onClick={() => setNavOpen(false)} className="nav-overlay d-xl-none"></div>
    </>
  );
};

export default Navigation;
