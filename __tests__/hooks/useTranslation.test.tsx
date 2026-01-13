import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageProvider } from "@/contexts/LanguageContext";

// Componente de prueba que usa el hook
const TestComponent = () => {
  const { t, language } = useTranslation();
  
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="translation">{t("navigation.top")}</span>
      <span data-testid="nested-translation">{t("contact.form.submit")}</span>
    </div>
  );
};

describe("useTranslation", () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock navigator.language
    Object.defineProperty(navigator, "language", {
      writable: true,
      configurable: true,
      value: "en-US",
    });
  });

  it("should return English translations when language is English", async () => {
    localStorage.clear();
    Object.defineProperty(navigator, "language", {
      writable: true,
      configurable: true,
      value: "en-US",
    });

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    // Wait for language to be detected and component to render
    await waitFor(() => {
      const element = screen.getByTestId("language");
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent("en");
    }, { timeout: 5000 });
    
    // Wait for translation to be available
    await waitFor(() => {
      expect(screen.getByTestId("translation")).toHaveTextContent("top");
    });
  });

  it("should return Spanish translations when language is Spanish", async () => {
    localStorage.clear();
    Object.defineProperty(navigator, "language", {
      writable: true,
      configurable: true,
      value: "es-ES",
    });

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    // Wait for language to be detected and component to render
    await waitFor(() => {
      const element = screen.getByTestId("language");
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent("es");
    }, { timeout: 5000 });
    
    // Wait for translation to be available
    await waitFor(() => {
      expect(screen.getByTestId("translation")).toHaveTextContent("inicio");
    });
  });

  it("should handle nested translation keys", async () => {
    localStorage.clear();
    Object.defineProperty(navigator, "language", {
      writable: true,
      configurable: true,
      value: "en-US",
    });

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    // Wait for component to render and language to be detected
    await waitFor(() => {
      expect(screen.getByTestId("language")).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Wait for nested translation
    await waitFor(() => {
      const element = screen.getByTestId("nested-translation");
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent("Submit");
    });
  });

  it("should return the key when translation is not found", async () => {
    localStorage.clear();
    const consoleWarn = jest.spyOn(console, "warn").mockImplementation(() => {});
    
    const TestComponentWithInvalidKey = () => {
      const { t } = useTranslation();
      return <span data-testid="invalid">{t("invalid.key" as any)}</span>;
    };

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponentWithInvalidKey />
        </LanguageProvider>
      );
    });

    // Wait for component to render and language to be detected
    await waitFor(() => {
      expect(screen.getByTestId("invalid")).toBeInTheDocument();
    }, { timeout: 5000 });
    
    // Wait for invalid key to be displayed
    await waitFor(() => {
      const element = screen.getByTestId("invalid");
      expect(element).toHaveTextContent("invalid.key");
    });
    expect(consoleWarn).toHaveBeenCalled();
    
    consoleWarn.mockRestore();
  });
});
