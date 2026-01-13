import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Logo from "@/public/images/logo.png";
import Link from "next/link";
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

  useEffect(() => {
    const handleClassChange = (mutationsList: MutationRecord[], observer: MutationObserver) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          const target = mutation.target as HTMLElement;
          if (target.classList.contains("active")) {
            const textElement = target.querySelector(".text");
            if (textElement) {
              shuffleLetters(textElement, { iterations: 5 });
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
    };
  }, []);

  useGSAP(() => {
    gsap.to(".navigation", { "--height": "100%", duration: 1, ease: "power1.inOut" });
    gsap.from(".nav-link", { duration: 0.8, delay: 0.5, opacity: 0, stagger: 0.1 });
  });

  return (
    <>
      <nav ref={navRef} className={`navigation ${navOpen ? "opened" : ""}`} id="navigation">
        <Image src={Logo} className="mb-4 d-xl-none" alt="logo" />
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
          <li onClick={() => setNavOpen(false)} className="nav-link">
            <a href="https://www.linkedin.com/in/cristiansrc" target="_blank" rel="noopener noreferrer">
              <span>07</span> <span className="text">{t("navigation.linkedin")}</span>{" "}
            </a>
          </li>
          <li onClick={() => setNavOpen(false)} className="nav-link">
            <a href="https://github.com/cristiansrc" target="_blank" rel="noopener noreferrer">
              <span>08</span> <span className="text">{t("navigation.github")}</span>{" "}
            </a>
          </li>
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
