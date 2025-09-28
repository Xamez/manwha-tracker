import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import { getManwhasCollection } from "$lib/database.ts";
import { authenticateUser } from "$lib/middleware.ts";
import type { UpdateManwhaRequest } from "$lib/types.ts";
import { isValidManwhaStatus } from "$lib/types.ts";
import { ObjectId } from "mongodb";

export const GET: RequestHandler = async ({ request, params }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const user = authenticateUser(cookieHeader || undefined);

    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id || !ObjectId.isValid(params.id)) {
      return json({ error: "Invalid manwha ID" }, { status: 400 });
    }

    const manwhasCollection = await getManwhasCollection();
    const manwha = await manwhasCollection.findOne({
      _id: ObjectId.createFromHexString(params.id),
      userId: user.userId,
    } as Record<string, unknown>);

    if (!manwha) {
      return json({ error: "Manwha not found" }, { status: 404 });
    }

    return json({ manwha });
  } catch (error) {
    console.error("Get manwha error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, params }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const user = authenticateUser(cookieHeader || undefined);

    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id || !ObjectId.isValid(params.id)) {
      return json({ error: "Invalid manwha ID" }, { status: 400 });
    }

    const body: UpdateManwhaRequest = await request.json();
    const {
      title,
      description,
      note,
      link,
      currentChapter,
      status,
      rating,
      startDate,
      endDate,
    } = body;

    if (!title?.trim()) {
      return json({ error: "Title is required" }, { status: 400 });
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

    const existingManwha = await manwhasCollection.findOne({
      _id: ObjectId.createFromHexString(params.id),
      userId: user.userId,
    } as Record<string, unknown>);

    if (!existingManwha) {
      return json({ error: "Manwha not found" }, { status: 404 });
    }

    const updateData = {
      title: title.trim(),
      description: description?.trim() || undefined,
      note: note?.trim() || undefined,
      link: link?.trim() || undefined,
      currentChapter,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      status,
      rating,
      lastReadAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await manwhasCollection.updateOne(
      {
        _id: ObjectId.createFromHexString(params.id),
        userId: user.userId,
      } as Record<string, unknown>,
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return json({ error: "Manwha not found" }, { status: 404 });
    }

    return json({
      message: "Manwha updated successfully",
      manwha: { ...existingManwha, ...updateData, _id: params.id },
    });
  } catch (error) {
    console.error("Update manwha error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ request, params }) => {
  try {
    const cookieHeader = request.headers.get("cookie");
    const user = authenticateUser(cookieHeader || undefined);

    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id || !ObjectId.isValid(params.id)) {
      return json({ error: "Invalid manwha ID" }, { status: 400 });
    }

    const manwhasCollection = await getManwhasCollection();

    const result = await manwhasCollection.deleteOne({
      _id: ObjectId.createFromHexString(params.id),
      userId: user.userId,
    } as Record<string, unknown>);

    if (result.deletedCount === 0) {
      return json({ error: "Manwha not found" }, { status: 404 });
    }

    return json({ message: "Manwha deleted successfully" });
  } catch (error) {
    console.error("Delete manwha error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
