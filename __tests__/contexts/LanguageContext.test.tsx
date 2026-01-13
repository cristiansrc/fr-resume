import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

// Componente de prueba que usa el hook
const TestComponent = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <button onClick={() => setLanguage("es")}>Set Spanish</button>
      <button onClick={() => setLanguage("en")}>Set English</button>
    </div>
  );
};

describe("LanguageContext", () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
    // Mock navigator.language
    Object.defineProperty(navigator, "language", {
      writable: true,
      configurable: true,
      value: "en-US",
    });
  });

  it("should provide default language from browser (English)", async () => {
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

    // Wait for useEffect to run and update language
    await waitFor(() => {
      const element = screen.getByTestId("language");
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent("en");
    }, { timeout: 5000 });
  });

  it("should provide default language from browser (Spanish)", async () => {
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

    // Wait for useEffect to run and update language
    await waitFor(() => {
      const element = screen.getByTestId("language");
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent("es");
    }, { timeout: 5000 });
  });

  it("should load language from localStorage", async () => {
    localStorage.setItem("language", "es");

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    // Wait for useEffect to run and load from localStorage
    await waitFor(() => {
      const element = screen.getByTestId("language");
      expect(element).toBeInTheDocument();
      expect(element).toHaveTextContent("es");
    }, { timeout: 5000 });
  });

  it("should update language and save to localStorage", async () => {
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

    // Wait for initial render and language detection
    await waitFor(() => {
      expect(screen.getByTestId("language")).toBeInTheDocument();
      expect(screen.getByTestId("language")).toHaveTextContent("en");
    }, { timeout: 5000 });

    const spanishButton = screen.getByText("Set Spanish");
    
    await act(async () => {
      spanishButton.click();
    });

    // Wait for language update
    await waitFor(() => {
      expect(screen.getByTestId("language")).toHaveTextContent("es");
    });
    expect(localStorage.getItem("language")).toBe("es");
  });

  it("should throw error when used outside provider", () => {
    // Suprimir el error en consola para este test
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useLanguage must be used within a LanguageProvider");

    consoleError.mockRestore();
  });
});
