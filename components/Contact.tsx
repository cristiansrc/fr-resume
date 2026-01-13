import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useRef } from "react";
import SectionTitle from "./SectionTitle";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "@/hooks/useTranslation";
import { useResume } from "@/contexts/ResumeContext";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { sendContactMessage } from "@/api";
gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const { t } = useTranslation();
  const { data } = useResume();
  const { executeRecaptcha } = useGoogleReCaptcha();
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!form.current) {
      return;
    }

    // Get form data
    const formData = new FormData(form.current);
    const name = formData.get("user_name") as string;
    const email = formData.get("user_email") as string;
    const message = formData.get("message") as string;

    // Validate form data
    if (!name || !email || !message) {
      alert(t("contact.form.validationError") || "Por favor, completa todos los campos.");
      return;
    }

    // Verify reCAPTCHA if available
    if (!executeRecaptcha) {
      console.warn("reCAPTCHA not loaded. Proceeding without verification.");
      // Continue with form submission even if reCAPTCHA is not available
    } else {
      try {
        // Execute reCAPTCHA v3
        const token = await executeRecaptcha("contact_form");
        
        if (!token) {
          console.error("reCAPTCHA verification failed");
          setSubmitBtnState("submit");
          alert(t("contact.form.recaptchaError") || "Por favor, verifica que no eres un robot.");
          return;
        }
        
        // Optional: Validate token on backend (you can add this later)
        // For now, we'll proceed with the form submission
      } catch (error) {
        console.error("reCAPTCHA error:", error);
        setSubmitBtnState("submit");
        alert(t("contact.form.recaptchaError") || "Error al verificar reCAPTCHA. Por favor, intenta de nuevo.");
        return;
      }
    }
    
    setSubmitBtnState("sending");
    
    try {
      // Map form data to API format
      const contactData = {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      };

      // Send contact message to API
      await sendContactMessage(contactData);
      
      console.log("SUCCESS! Message sent.");
      form.current.reset();
      setSubmitBtnState("success");
      setTimeout(() => {
        setSubmitBtnState("submit");
      }, 3000);
    } catch (error) {
      setSubmitBtnState("submit");
      console.error("FAILED...", error);
      alert(t("contact.form.submitError") || "Error al enviar el mensaje. Por favor, intenta de nuevo.");
    }
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
