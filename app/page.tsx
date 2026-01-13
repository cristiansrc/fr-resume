"use client";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Attainments from "@/components/Attainments";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import { useEffect, useState } from "react";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedColor = localStorage.getItem("color");
    if (savedColor) {
      document.documentElement.style.setProperty("--primary", savedColor);
    }
    const savedDir = localStorage.getItem("dir");
    if (savedDir) {
      document.documentElement.dir = savedDir;
    }
    setLoading(false);
  }, []);

  // Inicializar Bootstrap ScrollSpy manualmente
  useEffect(() => {
    if (loading) return;

    const initScrollSpy = async () => {
      try {
        // Importar Bootstrap
        const bootstrap = await import("bootstrap");
        
        // Esperar a que el DOM esté completamente renderizado
        const checkAndInit = () => {
          // Buscar el elemento que tiene data-bs-spy="scroll"
          const scrollSpyElement = document.querySelector('[data-bs-spy="scroll"]');
          const navElement = document.querySelector('#navigation');
          
          // Verificar que ambos elementos existan
          if (!scrollSpyElement || !navElement) {
            setTimeout(checkAndInit, 100);
            return;
          }

          // Verificar que todas las secciones existan
          const sections = ["top", "about_me", "attainments", "experience", "contact"];
          const allSectionsExist = sections.every(id => document.getElementById(id) !== null);
          
          if (!allSectionsExist) {
            setTimeout(checkAndInit, 100);
            return;
          }

          // Crear la instancia de ScrollSpy
          const scrollSpy = new bootstrap.ScrollSpy(scrollSpyElement, {
            target: '#navigation',
            rootMargin: '0px 0px -40%',
            smoothScroll: true
          });

          // Manejar el hash de la URL al cargar
          const hash = window.location.hash.slice(1);
          if (hash && sections.includes(hash)) {
            const element = document.getElementById(hash);
            if (element) {
              setTimeout(() => {
                element.scrollIntoView({ behavior: "auto" });
              }, 300);
            }
          }
        };

        // Iniciar después de un pequeño delay
        setTimeout(checkAndInit, 300);
      } catch (error) {
        console.error("Error al inicializar Bootstrap ScrollSpy:", error);
      }
    };

    initScrollSpy();
  }, [loading]);

  if (loading) {
    return (
      <div className="loader-container w-100  d-flex align-items-center justify-content-center">
        <div className="loader"></div>;
      </div>
    );
  }
  return (
    <>
      <Header navOpen={navOpen} setNavOpen={setNavOpen} />

      {/* <!-- navigation --> */}
      <Navigation setNavOpen={setNavOpen} navOpen={navOpen} />

      {/* <!-- shape bg --> */}
      <svg className="bg-gradiant" preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80">
        <path fill="#9b5de5" className="out-top" d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z" />
        <path fill="#f15bb5" className="in-top" d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z" />
        <path fill="#00bbf9" className="out-bottom" d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z" />
        <path fill="#00f5d4" className="in-bottom" d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z" />
      </svg>

      {/* <!-- main content --> */}
      <main className="container-fluid">
        <div className="row gx-xxl-6">
          <div className="col col-xl-9" data-bs-spy="scroll" data-bs-target="#navigation">
            {/* <!-- hero --> */}
            <Hero />

            {/* <!-- about me --> */}
            <AboutMe />

            {/* <!-- attainments --> */}
            <Attainments />

            {/* <!-- experience --> */}
            <Experience />

            {/* <!-- contact --> */}
            <Contact />
          </div>
        </div>
      </main>
      {/* <!-- color switcher --> */}
    </>
  );
}
