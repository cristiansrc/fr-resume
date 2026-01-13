import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import SectionTitle from "./SectionTitle";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import { useTranslation } from "@/hooks/useTranslation";
import { useResume } from "@/contexts/ResumeContext";
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const { t } = useTranslation();
  const { data } = useResume();
  const [submitBtnState, setSubmitBtnState] = React.useState<"submit" | "sending" | "success">("submit");
  
  // Obtener el texto del botón basado en el estado actual y el idioma
  const getSubmitBtnText = () => {
    if (submitBtnState === "sending") {
      return t("contact.form.sending");
    } else if (submitBtnState === "success") {
      return t("contact.form.success");
    }
    return t("contact.form.submit");
  };
  
  useGSAP(() => {
    gsap.fromTo(
      ".section-title-overlay-text",
      { y: "50%" },
      {
        y: "-50%",
        scrollTrigger: {
          trigger: ".contact",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
    gsap.from(".submit-btn", {
      scale: 0,
      duration: 3.5,
      ease: "elastic",
      delay: 0.2,
      scrollTrigger: {
        trigger: ".submit-btn",
      },
    });
    gsap.from(".contact-item", {
      scale: 0,
      duration: 0.8,
      ease: "back",
      scrollTrigger: {
        trigger: ".contact-items",
      },
    });

    gsap.from(".contact-input", {
      opacity: 0,
      scale: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: ".contact-input",
      },
    });
  });
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitBtnState("sending");
    emailjs.sendForm(process.env.NEXT_PUBLIC_SERVICE_ID as string, process.env.NEXT_PUBLIC_TEMPLATE_ID as string, form.current!, { publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY as string }).then(
      function () {
        console.log("SUCCESS!");
        form.current?.reset();
        setSubmitBtnState("success");
        setTimeout(function () {
          setSubmitBtnState("submit");
        }, 3000);
      },
      function (error) {
        setSubmitBtnState("submit");
        console.log("FAILED...", error);
      },
    );
  };
  return (
    <section id="contact" className="contact section position-relative">
      <span className="section-title-overlay-text">{t("contact.overlayText")}</span>
      <SectionTitle subtitle={t("contact.subtitle")} title={t("contact.title")} />

      <div className="row pb-120 contact-items">
        <div className="row g-4">
          <div className="col-sm-6 col-xl-4 col-xxl-3">
            <div className="contact-item">
              <div className="icon-box">
                <i className="ph ph-envelope-open"></i>
              </div>
              <p>{data?.basicData?.email || "emily@devis.com"}</p>
            </div>
          </div>
        </div>
      </div>
      <form ref={form} onSubmit={handleSubmit} id="contact-form" className="contact-form">
        <h4>{t("contact.leaveMessage")}</h4>
        <div className="row g-4 g-xl-5">
          <div className="col-sm-6 contact-input">
            <label htmlFor="name">{t("contact.form.name")}</label>
            <input type="text" id="user_name" name="user_name" placeholder={t("contact.form.namePlaceholder")} required />
          </div>
          <div className="col-sm-6 contact-input">
            <label htmlFor="email">{t("contact.form.email")}</label>
            <input type="email" id="user_email" name="user_email" placeholder={t("contact.form.emailPlaceholder")} required />
          </div>
          <div className="col-12 contact-input">
            <label htmlFor="message">{t("contact.form.message")}</label>
            <textarea id="message" name="message" placeholder={t("contact.form.messagePlaceholder")}></textarea>
          </div>
          <div className="col-12">
            <button type="submit" id="submit-btn" className="submit-btn position-relative">
              <div className="waves-top-md">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              {getSubmitBtnText()}
              <div className="waves-bottom-md">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>
      </form>
      <div className="col mt-5 pt-5 next-chapter">
        <span className="page">05/5</span>
      </div>
    </section>
  );
};

export default Contact;
