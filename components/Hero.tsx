import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import HeroImg from "@/public/images/foto.png";
import Typewriter from "typewriter-effect";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import gsap from "gsap";
import { useTranslation } from "@/hooks/useTranslation";
import { useResume } from "@/contexts/ResumeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadCurriculumPdf } from "@/api";

const Hero = ({ classes }: { classes?: string }) => {
  const { t } = useTranslation();
  const { data } = useResume();
  const { language } = useLanguage();
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  
  const handleWorkClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const lang = language === "es" ? "spanish" : "english";
    try {
      await downloadCurriculumPdf(lang);
    } catch (error) {
      console.error("Error downloading curriculum:", error);
    }
  };

  useGSAP(() => {
    gsap.from(".img-wrapper", { duration: 1.5, scale: 1.5, ease: "back", delay: 0.3, opacity: 0 });
    gsap.from(".work-btn", { duration: 1.2, scale: 0, opacity: 0, ease: "bounce" });
    gsap.from(".contact-btn", { duration: 1.2, scale: 0, opacity: 0, ease: "bounce" });

    const freelancer = SplitType.create(".freelancer").chars;
    gsap.from(freelancer, { duration: 1.5, rotateX: 180, opacity: 0, ease: "bounce", stagger: 0.05 });
  });

  // Calculate the full text that should be displayed
  const locationText = data?.basicData?.located 
    ? (language === "es" ? data.basicData.located : data.basicData.locatedEng) 
    : "";
  const basedInText = t("hero.basedIn");
  const fullDescriptionText = basedInText + locationText;

  // Handle description SplitType separately, only when data is ready
  useEffect(() => {
    if (!descriptionRef.current || !fullDescriptionText || fullDescriptionText.trim() === '') return;

    const applySplitType = () => {
      if (!descriptionRef.current) return;

      // Clean up any existing SplitType instance
      const existingSplit = descriptionRef.current.querySelector('.split-line');
      if (existingSplit) {
        // Restore original text
        const originalText = descriptionRef.current.textContent || '';
        descriptionRef.current.innerHTML = originalText;
      }

      // Create new SplitType instance
      const desc = SplitType.create(descriptionRef.current).chars;
      gsap.from(desc, { duration: 0.5, rotateY: 180, stagger: 0.05 });
    };

    let timer: NodeJS.Timeout;
    let retryTimer: NodeJS.Timeout;

    // Use requestAnimationFrame to ensure DOM is updated, then wait a bit more
    const rafId = requestAnimationFrame(() => {
      timer = setTimeout(() => {
        try {
          if (!descriptionRef.current) return;

          // Verify the text is actually in the DOM and matches expected
          const currentText = descriptionRef.current.textContent || '';
          if (!currentText || currentText.trim() === '') return;
          
          // Check if text is complete - it should be at least as long as expected
          if (currentText.length < fullDescriptionText.length * 0.8) {
            // Text not ready yet, try again with a longer delay
            retryTimer = setTimeout(() => {
              if (descriptionRef.current) {
                const retryText = descriptionRef.current.textContent || '';
                if (retryText.length >= fullDescriptionText.length * 0.8) {
                  applySplitType();
                }
              }
            }, 200);
            return;
          }

          applySplitType();
        } catch (error) {
          console.error("Error creating SplitType for description:", error);
        }
      }, 400);
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (timer) clearTimeout(timer);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [language, fullDescriptionText]);
  return (
    <section id="top" className={`hero ${classes}`}>
      <div className="row gx-4 justify-content-center align-items-center">
        <div className="col-12 col-md-6 col-xl-6 hero-content">
          <div style={{ overflow: "visible" }}>
            <h4 className="text-uppercase freelancer">
              {data?.home?.greeting ? (language === "es" ? data.home.greeting : data.home.greetingEng) : "HI, I AM A FREELANCER"}
            </h4>
            <div style={{ overflow: "visible", width: "100%" }}>
              <Typewriter
                component={"h1"}
                options={{
                  strings: data?.home?.labels?.map(label => language === "es" ? label.name : label.nameEng) || ["Designer", "Developer"],
                  autoStart: true,
                  loop: true,
                }}
              />
            </div>
            <p ref={descriptionRef} className={`description description-${language}`}>
              {t("hero.basedIn")}{data?.basicData?.located ? (language === "es" ? data.basicData.located : data.basicData.locatedEng) : ""}
            </p>
          </div>
          <div className="d-flex gap-4">
            <a 
              href="#" 
              onClick={handleWorkClick}
              className="btn work-btn text-capitalize btn-secondary"
            >
              {data?.home?.buttonWorkLabel ? (language === "es" ? data.home.buttonWorkLabel : data.home.buttonWorkLabelEng) : "view my work"}
            </a>
            <Link href="#contact" className="btn contact-btn text-capitalize btn-outline-secondary">
              {data?.home?.buttonContactLabel ? (language === "es" ? data.home.buttonContactLabel : data.home.buttonContactLabelEng) : "contact me"}
            </Link>
          </div>
        </div>
        <div className="col-12 col-md-5 offset-md-1 offset-xxl-2 col-xl-4 d-flex justify-content-center">
          <div className="img-wrapper">
            <div className="waves-top">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <Image className="img-fluid rounded-circle hero-img" priority={true} src={HeroImg} alt="" />
            <div className="waves-bottom">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div className="col-12">
          <Link href="#about_me" className="d-flex gap-4 align-items-center next-chapter mt-5">
            <span className="page">01/5</span>
            <span className="next">{t("hero.nextChapter")}</span>
            <span className="icon">
              <i className="ph ph-arrow-elbow-right-down"></i>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
