import { InfoPageResponse, CurriculumLanguage } from "@/interfaces/resume";

const API_BASE_URL = process.env.NEXT_PUBLIC_RESUME_API_BASE_URL || "http://localhost:8080/v1/ms-resume";

/**
 * Fetches the public info page data
 * @returns Promise with the info page response
 */
export async function getInfoPage(): Promise<InfoPageResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/public/info-page`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Para desarrollo, en producción podrías usar "force-cache" o revalidate
    });

    if (!response.ok) {
      throw new Error(`Error fetching info page: ${response.status} ${response.statusText}`);
    }

    const data: InfoPageResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getInfoPage:", error);
    throw error;
  }
}

/**
 * Downloads the curriculum PDF for the specified language
 * @param language - "english" or "spanish"
 * @returns Promise with the PDF blob
 */
export async function getCurriculumPdf(language: CurriculumLanguage): Promise<Blob> {
  try {
    if (language !== "english" && language !== "spanish") {
      throw new Error(`Invalid language: ${language}. Must be "english" or "spanish"`);
    }

    const response = await fetch(`${API_BASE_URL}/public/curriculum/${language}`, {
      method: "GET",
      headers: {
        "Accept": "application/pdf",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Error fetching curriculum: ${response.status} ${response.statusText}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error("Error in getCurriculumPdf:", error);
    throw error;
  }
}

/**
 * Downloads the curriculum PDF and triggers a browser download
 * @param language - "english" or "spanish"
 * @param filename - Optional filename for the download (default: "curriculum-{language}.pdf")
 */
export async function downloadCurriculumPdf(
  language: CurriculumLanguage,
  filename?: string
): Promise<void> {
  try {
    const blob = await getCurriculumPdf(language);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `curriculum-${language}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading curriculum:", error);
    throw error;
  }
}
