"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReCaptchaProviderProps {
  children: ReactNode;
}

interface ScriptProps {
  async?: boolean;
  defer?: boolean;
  appendTo?: "head" | "body";
}

export const ReCaptchaProvider = ({ children }: ReCaptchaProviderProps) => {
  // Site key (required)
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  // Get current language from context (dynamic)
  const { language: appLanguage } = useLanguage();
  
  // Map application language to reCAPTCHA language
  // If NEXT_PUBLIC_RECAPTCHA_LANGUAGE is set, use it as override, otherwise use app language
  const language = process.env.NEXT_PUBLIC_RECAPTCHA_LANGUAGE || appLanguage;

  // Script properties (optional, with defaults)
  const scriptAsync = process.env.NEXT_PUBLIC_RECAPTCHA_SCRIPT_ASYNC !== "false"; // default: true
  const scriptDefer = process.env.NEXT_PUBLIC_RECAPTCHA_SCRIPT_DEFER !== "false"; // default: true
  const scriptAppendTo = (process.env.NEXT_PUBLIC_RECAPTCHA_SCRIPT_APPEND_TO || "head") as "head" | "body";

  const scriptProps: ScriptProps = {
    async: scriptAsync,
    defer: scriptDefer,
    appendTo: scriptAppendTo,
  };

  if (!siteKey) {
    console.warn("reCAPTCHA site key not found. reCAPTCHA will be disabled.");
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      key={language} // Force re-render when language changes
      reCaptchaKey={siteKey}
      language={language}
      scriptProps={scriptProps}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};
