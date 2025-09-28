import { JSDOM } from "jsdom";

interface CoverImageData {
  base64Image: string;
  originalUrl: string;
  hasImage: boolean;
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
    } catch (error) {
      throw new Error(
        `Failed to fetch URL ${url}: ${(error as Error).message}`,
      );
    }
  }

  private extractCoverImageUrl(document: Document, url: string): string {
    let coverImage = "";

    const pageTitle = document.querySelector("title")?.textContent?.trim() ||
      document.querySelector("h1")?.textContent?.trim() || "";

    // Strategy 1: Try meta og:image first (most reliable)
    const metaImage = document.querySelector('meta[property="og:image"]')
      ?.getAttribute("content");
    if (metaImage && this.isValidCoverImage(metaImage)) {
      coverImage = this.resolveURL(metaImage, url);
    }

    // Strategy 2: If no meta image, try comprehensive selectors
    if (!coverImage) {
      const coverSelectors = [
        pageTitle ? `img[alt="${pageTitle}" i]` : "",
        pageTitle ? `img[alt*="${pageTitle.substring(0, 30)}" i]` : "",

        ".summary_image img",
        ".wp-manga-cover img",
        ".manga-cover img",
        ".post-thumbnail img",
        ".post-thumb img",
        ".featured-image img",
        ".entry-content img:first-child",
        ".tab-summary img",
        ".wp-post-image",
        ".attachment-post-thumbnail",

        ".panel-story-info .story-info-left img",
        ".manga-info-pic img",
        ".story-info-left img",

        "img[alt*='cover' i]",
        "img[src*='cover' i]",
        "img[alt*='thumbnail' i]",
        "img[src*='thumbnail' i]",
        "img[src*='thumb' i]",
        ".cover img",
        ".book-cover img",
        ".thumbnail img",

        "img:first-of-type",
      ].filter(Boolean); // Remove empty selectors

      for (const selector of coverSelectors) {
        const img = document.querySelector(selector);
        if (img) {
          const src = img.getAttribute("data-src") ||
            img.getAttribute("data-lazy-src") ||
            img.getAttribute("data-original") ||
            img.getAttribute("src");

          if (src && src !== "#" && this.isValidCoverImage(src)) {
            coverImage = this.resolveURL(src, url);
            break;
          }
        }
      }
    }

    return coverImage;
  }

  private isValidCoverImage(url: string): boolean {
    const lowerUrl = url.toLowerCase();

    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const hasImageExtension = imageExtensions.some((ext) =>
      lowerUrl.includes(ext)
    );

    const excludePatterns = [
      "avatar",
      "logo",
      "icon",
      "btn_",
      "button",
      "dflazy",
      "placeholder",
      "loading",
      "spinner",
      "banner",
      "header",
      "footer",
      "sidebar",
      "menu",
      "navigation",
    ];
    const isExcluded = excludePatterns.some((pattern) =>
      lowerUrl.includes(pattern)
    );

    return hasImageExtension && !isExcluded;
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
    const headerConfigurations = [
      {
        "User-Agent": this.userAgent,
        "Referer": sourceUrl,
        "Accept": "image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      {
        "User-Agent": this.userAgent,
        "Referer": sourceUrl,
      },
      {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
        "Referer": sourceUrl,
        "Accept": "image/webp,*/*",
      },
      {
        "User-Agent": this.userAgent,
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      },
    ];

    for (let i = 0; i < headerConfigurations.length; i++) {
      try {
        console.log(
          `Attempting to download image (attempt ${
            i + 1
          }/${headerConfigurations.length})`,
        );

        const response = await fetch(imageUrl, {
          headers: headerConfigurations[i],
        });

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");

          const contentType = response.headers.get("content-type") ||
            this.getMimeTypeFromUrl(imageUrl);

          console.log(`✅ Successfully downloaded image on attempt ${i + 1}`);
          return { base64, mimeType: contentType };
        } else {
          console.log(
            `❌ Attempt ${i + 1} failed with status: ${response.status}`,
          );
        }
      } catch (error) {
        console.log(
          `❌ Attempt ${i + 1} failed with error: ${(error as Error).message}`,
        );
      }
    }

    throw new Error(
      `Failed to download image after ${headerConfigurations.length} attempts`,
    );
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

  async getCoverImage(url: string): Promise<CoverImageData> {
    try {
      const html = await this.fetchHTML(url);
      const dom = new JSDOM(html);
      const coverImageUrl = this.extractCoverImageUrl(dom.window.document, url);

      if (!coverImageUrl) {
        return {
          base64Image: createFallbackCoverSVG(),
          originalUrl: "",
          hasImage: false,
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
        };
      } catch (downloadError) {
        return {
          base64Image: createFallbackCoverSVG(),
          originalUrl: coverImageUrl,
          hasImage: false,
        };
      }
    } catch (error) {
      return {
        base64Image: createFallbackCoverSVG(),
        originalUrl: "",
        hasImage: false,
      };
    }
  }
}

const scraper = new MangaCoverScraper();

export async function getCoverImage(url: string): Promise<CoverImageData> {
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

export type { CoverImageData };
