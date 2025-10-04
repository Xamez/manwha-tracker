import type { ServerLoad } from "@sveltejs/kit";
import { error, redirect } from "@sveltejs/kit";
import { authenticateUser } from "$lib/middleware.ts";
import { getManwhasCollection } from "$lib/database.ts";
import { ObjectId } from "mongodb";

export const load: ServerLoad = async ({ request, params }) => {
  const cookieHeader = request.headers.get("cookie");
  const user = authenticateUser(cookieHeader || undefined);

  if (!user) {
    throw redirect(302, "/login");
  }

  try {
    if (!params.id || !ObjectId.isValid(params.id)) {
      throw error(400, "Invalid manwha ID");
    }

    const manwhasCollection = await getManwhasCollection();
    const manwha = await manwhasCollection.findOne({
      _id: ObjectId.createFromHexString(params.id),
      userId: user.userId,
    } as Record<string, unknown>);

    if (!manwha) {
      throw error(404, "Manwha not found");
    }

    return {
      user,
      manwha: {
        ...manwha,
        _id: manwha._id?.toString(),
      },
    };
  } catch (err) {
    console.error("Error fetching manwha:", err);
    throw error(500, "Failed to load manwha");
  }
};
