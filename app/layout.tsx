import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/public/scss/styles.scss";
import Bootstrap from "@/components/Bootstrap";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { DynamicHead } from "@/components/DynamicHead";

export const metadata: Metadata = {
  title: "cristiansrc - Personal Portfolio",
  description: "Personal Portfolio - Hoja de vida",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};
type LayoutType = {
  children: React.ReactNode;
};
const poppins = Poppins({ weight: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);
export default function RootLayout({ children }: Readonly<LayoutType>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <LanguageProvider>
          <ResumeProvider>
            <LoadingProvider>
              <DynamicHead />
              <Bootstrap>
                {children}
              </Bootstrap>
            </LoadingProvider>
          </ResumeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
