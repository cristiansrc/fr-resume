import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@/public/scss/styles.scss";
import Bootstrap from "@/components/Bootstrap";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ResumeProvider } from "@/contexts/ResumeContext";

export const metadata: Metadata = {
  title: "Portify - Personal Portfolio Template",
  description: "Personal Portfolio Template for developers",
};
type LayoutType = {
  children: React.ReactNode;
};
const poppins = Poppins({ weight: ["400", "500", "600", "700", "800"], subsets: ["latin"] });
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);
export default function RootLayout({ children }: Readonly<LayoutType>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <LanguageProvider>
          <ResumeProvider>
            <Bootstrap>
              {children}
            </Bootstrap>
          </ResumeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
