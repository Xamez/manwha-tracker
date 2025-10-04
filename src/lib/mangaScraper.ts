import { JSDOM } from "jsdom";
import { Buffer } from "node:buffer";

interface ScrapedMangaData {
  base64Image: string;
  originalUrl: string;
  hasImage: boolean;
  title: string;
}

class MangaCoverScraper {
  private userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

  private async fetchHTML(url: string): Promise<string> {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.userAgent,
          "Accept":
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.text();
    } catch (_) {
      throw new Error(`Failed to fetch URL ${url}`);
    }
  }

  private extractCoverImageUrl(document: Document, url: string): string {
    let coverImage = "";

    const metaImage = document.querySelector('meta[property="og:image"]')
      ?.getAttribute("content");
    if (metaImage && this.isValidCoverImage(metaImage)) {
      coverImage = this.resolveURL(metaImage, url);
    }

    if (!coverImage) {
      const posterImg = document.querySelector('img[alt="poster"]');
      const posterSrc = posterImg?.getAttribute("src");
      if (posterSrc && this.isValidCoverImage(posterSrc)) {
        coverImage = this.resolveURL(posterSrc, url);
      }
    }

    return coverImage;
  }

  private extractTitle(document: Document): string {
    let title = document.querySelector("h1")?.textContent?.trim();

    if ((!title || title === "")) {
      title = document.querySelector('meta[property="og:title"]')
        ?.getAttribute("content")?.trim();
    }

    return title || "Not found";
  }

  private isValidCoverImage(url: string): boolean {
    const lowerUrl = url.toLowerCase();

    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp"];
    const hasImageExtension = imageExtensions.some((ext) =>
      lowerUrl.includes(ext)
    );

    return hasImageExtension;
  }

  private resolveURL(imageUrl: string, baseUrl: string): string {
    try {
      return new URL(imageUrl, baseUrl).href;
    } catch {
      return imageUrl;
    }
  }

  private async downloadImageAsBase64(
    imageUrl: string,
    sourceUrl: string,
  ): Promise<{ base64: string; mimeType: string }> {
    try {
      const response = await fetch(imageUrl, {
        headers: {
          "User-Agent": this.userAgent,
          "Referer": sourceUrl,
          "Accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      const contentType = response.headers.get("content-type") ||
        this.getMimeTypeFromUrl(imageUrl);

      return { base64, mimeType: contentType };
    } catch (_) {
      throw new Error(`Failed to download image from ${imageUrl}`);
    }
  }

  private getMimeTypeFromUrl(url: string): string {
    const extension = url.toLowerCase().split(".").pop();
    const mimeTypes: Record<string, string> = {
      "jpg": "image/jpeg",
      "jpeg": "image/jpeg",
      "png": "image/png",
      "gif": "image/gif",
      "webp": "image/webp",
      "svg": "image/svg+xml",
    };
    return mimeTypes[extension || "jpg"] || "image/jpeg";
  }

  async getCoverImage(url: string): Promise<ScrapedMangaData> {
    try {
      const html = await this.fetchHTML(url);
      const dom = new JSDOM(html);
      const document = dom.window.document;
      console.log(document.title);

      const coverImageUrl = this.extractCoverImageUrl(document, url);
      const title = this.extractTitle(document);

      if (!coverImageUrl) {
        return {
          base64Image: createFallbackCoverSVG(),
          originalUrl: "",
          hasImage: false,
          title,
        };
      }

      try {
        const { base64, mimeType } = await this.downloadImageAsBase64(
          coverImageUrl,
          url,
        );

        return {
          base64Image: `data:${mimeType};base64,${base64}`,
          originalUrl: coverImageUrl,
          hasImage: true,
          title,
        };
      } catch (_) {
        return {
          base64Image: createFallbackCoverSVG(),
          originalUrl: coverImageUrl,
          hasImage: false,
          title,
        };
      }
    } catch (_) {
      return {
        base64Image: createFallbackCoverSVG(),
        originalUrl: "",
        hasImage: false,
        title: "Unknown Title",
      };
    }
  }
}

const scraper = new MangaCoverScraper();

export async function getCoverImage(url: string): Promise<ScrapedMangaData> {
  return await scraper.getCoverImage(url);
}

export function createFallbackCoverSVG(): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
      <rect width="200" height="300" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2" rx="8"/>
      <circle cx="100" cy="120" r="30" fill="#dee2e6"/>
      <rect x="60" y="160" width="80" height="8" fill="#dee2e6" rx="4"/>
      <rect x="70" y="180" width="60" height="6" fill="#e9ecef" rx="3"/>
      <rect x="50" y="200" width="100" height="6" fill="#e9ecef" rx="3"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export type { ScrapedMangaData };
