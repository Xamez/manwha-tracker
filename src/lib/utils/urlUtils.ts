const supportedSites = [
  "demonicscans",
  "manhuaus.com",
  "manganato",
  "mangakakalot",
];

export function generateChapterUrl(
  baseUrl: string,
  chapterNumber: number,
): string {
  if (!baseUrl || chapterNumber < 0) {
    return baseUrl || "";
  }

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");

  const url = new URL(cleanBaseUrl);
  const hostname = url.hostname.toLowerCase();

  let siteType = "unknown";
  if (hostname.includes("demonicscans.org")) {
    siteType = "demonicscans";
  } else if (hostname.includes("manhuaus.com")) {
    siteType = "manhuaus";
  } else if (
    hostname.includes("manganato") || hostname.includes("mangakakalot")
  ) {
    siteType = "manganato";
  }

  switch (siteType) {
    case "demonicscans": {
      const titleUrl = cleanBaseUrl.replace("/manga/", "/title/");
      return `${titleUrl}/chapter/${chapterNumber}/1`;
    }
    case "manhuaus": {
      return `${cleanBaseUrl}/chapter-${chapterNumber}`;
    }
    case "manganato": {
      return `${cleanBaseUrl}/chapter-${chapterNumber}`;
    }
    default: {
      return cleanBaseUrl;
    }
  }
}

export function isSupportedMangaSite(url: string): boolean {
  if (!url) return false;

  try {
    return supportedSites.some((site) => url.toLowerCase().includes(site));
  } catch {
    return false;
  }
}
