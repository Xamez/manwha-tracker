import type { ServerLoad } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
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
      throw redirect(302, "/manwhas?error=invalid-id");
    }

    const manwhasCollection = await getManwhasCollection();

    const result = await manwhasCollection.deleteOne({
      _id: ObjectId.createFromHexString(params.id),
      userId: user.userId,
    } as Record<string, unknown>);

    if (result.deletedCount === 0) {
      throw redirect(302, "/manwhas?error=not-found");
    }

    throw redirect(302, "/manwhas?success=deleted");
  } catch (error) {
    console.error("Delete manwha error:", error);
    throw redirect(302, "/manwhas?error=delete-failed");
  }
};
