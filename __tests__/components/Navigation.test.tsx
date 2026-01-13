import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navigation from "@/components/Navigation";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { downloadCurriculumPdf } from "@/api";
import { getInfoPage } from "@/api";

// Mock dependencies
jest.mock("@gsap/react", () => ({
  useGSAP: jest.fn((callback) => callback()),
}));

jest.mock("gsap", () => ({
  to: jest.fn(),
  from: jest.fn(),
}));

jest.mock("shuffle-letters", () => jest.fn());

jest.mock("@/api", () => ({
  downloadCurriculumPdf: jest.fn(),
  getInfoPage: jest.fn(),
}));

const mockResumeData = {
  home: {
    id: 1,
    greeting: "Hola",
    greetingEng: "Hello",
    imageUrl: { id: 1, name: "test", nameEng: "test", url: "test.jpg" },
    buttonWorkLabel: "Ver trabajo",
    buttonWorkLabelEng: "View work",
    buttonContactLabel: "Contactar",
    buttonContactLabelEng: "Contact",
    labels: [],
  },
  basicData: {
    id: 1,
    firstName: "Test",
    othersName: "",
    firstSurName: "User",
    othersSurName: "",
    dateBirth: "1990-01-01",
    located: "Bogotá",
    locatedEng: "Bogota",
    startWorkingDate: "2010-01-01",
    greeting: "Hola",
    greetingEng: "Hello",
    email: "test@example.com",
    instagram: "",
    linkedin: "https://linkedin.com/in/test",
    x: "",
    github: "",
    description: "Test",
    descriptionEng: "Test",
    descriptionPdf: [],
    descriptionPdfEng: [],
    wrapper: [],
    wrapperEng: [],
  },
  skills: [],
  experiences: [],
  educations: [],
};

describe("Navigation Component", () => {
  const mockSetNavOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    Object.defineProperty(navigator, "language", {
      writable: true,
      configurable: true,
      value: "es-ES",
    });
    (getInfoPage as jest.Mock).mockResolvedValue(mockResumeData);
  });

  const renderNavigation = (navOpen = false) => {
    return render(
      <LanguageProvider>
        <ResumeProvider>
          <Navigation setNavOpen={mockSetNavOpen} navOpen={navOpen} />
        </ResumeProvider>
      </LanguageProvider>
    );
  };

  it("should render navigation links", async () => {
    renderNavigation();
    
    await waitFor(() => {
      expect(screen.getByText(/inicio/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/sobre mí/i)).toBeInTheDocument();
    expect(screen.getByText(/habilidades/i)).toBeInTheDocument();
  });

  it("should display email from resume data", async () => {
    renderNavigation();
    
    await waitFor(() => {
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });
  });

  it("should call downloadCurriculumPdf when resume link is clicked", async () => {
    (downloadCurriculumPdf as jest.Mock).mockResolvedValue(undefined);

    renderNavigation();
    
    await waitFor(() => {
      expect(screen.getByText(/hoja de vida/i)).toBeInTheDocument();
    });
    
    const resumeLink = screen.getByText(/hoja de vida/i);
    fireEvent.click(resumeLink);

    await waitFor(() => {
      expect(downloadCurriculumPdf).toHaveBeenCalledWith("spanish");
    });
    expect(mockSetNavOpen).toHaveBeenCalledWith(false);
  });

  it("should close navigation when link is clicked", async () => {
    renderNavigation();
    
    await waitFor(() => {
      expect(screen.getByText(/sobre mí/i)).toBeInTheDocument();
    });
    
    const aboutLink = screen.getByText(/sobre mí/i);
    fireEvent.click(aboutLink);

    expect(mockSetNavOpen).toHaveBeenCalledWith(false);
  });
});
