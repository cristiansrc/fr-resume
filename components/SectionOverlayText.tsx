import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const SectionOverlayText = ({ text }: { text: string }) => {
  const sectionTitleRef = useRef(null);

  useGSAP(() => {
    const element = sectionTitleRef.current;
    const triggerElement = document.querySelector(".about");

    // Verificar que los elementos existan antes de animar
    if (!element || !triggerElement) return;

    const anim = gsap.fromTo(
      element,
      { y: "50%", force3D: true },
      {
        y: "-50%",
        force3D: true,
        scrollTrigger: {
          trigger: ".about",
          start: "top bottom",
          end: "bottom top",
          scrub: 1, // Usar scrub suave para mejor rendimiento
          invalidateOnRefresh: true,
        },
      },
    );

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Clean up all ScrollTriggers
    };
  });

  return (
    <span ref={sectionTitleRef} className="section-title-overlay-text">
      {text}
    </span>
  );
};

export default SectionOverlayText;
