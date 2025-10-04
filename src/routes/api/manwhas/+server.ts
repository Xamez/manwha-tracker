import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { getManwhasCollection } from "$lib/database.ts";
import { authenticateUser } from "$lib/middleware.ts";
import type { AddManwhaRequest, Manwha } from "$lib/types.ts";
import { isValidManwhaStatus } from "$lib/types.ts";
import { getCoverImage } from "$lib/mangaScraper.ts";

export const POST: RequestHandler = async (
  { request }: { request: Request },
) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const user = authenticateUser(cookieHeader || undefined);

    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: AddManwhaRequest = await request.json();
    const {
      title,
      note,
      link,
      currentChapter,
      status,
      rating,
      startDate,
      endDate,
    } = body;

    if (!link?.trim()) {
      return json({ error: "Link is required" }, { status: 400 });
    }

    if (!isValidManwhaStatus(status)) {
      return json({ error: "Invalid status" }, { status: 400 });
    }

    if (currentChapter < 0) {
      return json({ error: "Current chapter cannot be negative" }, {
        status: 400,
      });
    }

    if (rating !== undefined && (rating < 0 || rating > 10)) {
      return json({ error: "Rating must be between 0 and 10" }, {
        status: 400,
      });
    }

    if (!startDate) {
      return json({ error: "Start date is required" }, { status: 400 });
    }

    const manwhasCollection = await getManwhasCollection();

    let coverImage: string | undefined;
    let scrapedTitle: string;

    try {
      console.log(`Scraping manga data for: ${link.trim()}`);
      const scrapedData = await getCoverImage(link.trim());
      coverImage = scrapedData.base64Image;
      scrapedTitle = scrapedData.title;
      console.log(
        `Manga data scraped successfully. Title: ${scrapedTitle}, Has image: ${scrapedData.hasImage}`,
      );
    } catch (error) {
      console.error(`Failed to scrape manga data for ${link.trim()}:`, error);
      return json({
        error: "Failed to scrape manga data from the provided link",
      }, {
        status: 400,
      });
    }

    const now = new Date();
    const newManwha: Manwha = {
      userId: user.userId,
      title: title?.trim() || scrapedTitle,
      note: note?.trim() || undefined,
      link: link.trim(),
      currentChapter,
      lastReadAt: now,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      status,
      rating,
      coverImage,
      createdAt: now,
      updatedAt: now,
    };

    const result = await manwhasCollection.insertOne(newManwha);

    if (!result.insertedId) {
      return json({ error: "Failed to add manwha" }, { status: 500 });
    }

    return json({
      message: "Manwha added successfully",
      manwha: { ...newManwha, _id: result.insertedId.toString() },
    }, { status: 201 });
  } catch (error) {
    console.error("Add manwha error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export const GET: RequestHandler = async (
  { request, url }: { request: Request; url: URL },
) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const user = authenticateUser(cookieHeader || undefined);

    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    const manwhasCollection = await getManwhasCollection();

    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");

    const query: Record<string, unknown> = { userId: user.userId };

    if (status && isValidManwhaStatus(status)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }

    const manwhas = await manwhasCollection
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();

    return json({
      manwhas: manwhas.map((manwha) => ({
        ...manwha,
        _id: manwha._id?.toString(),
      })),
    });
  } catch (error) {
    console.error("Get manwhas error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
