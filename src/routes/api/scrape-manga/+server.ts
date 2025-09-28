import { json, type RequestEvent } from "@sveltejs/kit";
import { getCoverImage } from "$lib/mangaScraper.js";

export const POST = async ({ request }: RequestEvent) => {
  try {
    const { url } = await request.json();

    if (!url) {
      return json({ error: "URL is required" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return json({ error: "Invalid URL format" }, { status: 400 });
    }

    const coverData = await getCoverImage(url);

    return json({
      success: true,
      data: coverData,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return json({
      error: "Internal server error",
    }, { status: 500 });
  }
};
