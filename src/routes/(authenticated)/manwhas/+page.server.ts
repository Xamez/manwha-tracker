import type { ServerLoad } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { authenticateUser } from "$lib/middleware.ts";
import { getManwhasCollection } from "$lib/database.ts";

export const load: ServerLoad = async (
  { request, url }: { request: Request; url: URL },
) => {
  const cookieHeader = request.headers.get("cookie");
  const user = authenticateUser(cookieHeader || undefined);

  if (!user) {
    throw redirect(302, "/login");
  }

  try {
    const manwhasCollection = await getManwhasCollection();

    const sortBy = url.searchParams.get("sortBy") || "updatedAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    const manwhas = await manwhasCollection
      .find({ userId: user.userId })
      .sort(sortObj)
      .toArray();

    const stats = {
      total: manwhas.length,
      reading: manwhas.filter((m) => m.status === "reading").length,
      completed: manwhas.filter((m) => m.status === "completed").length,
      toContinue: manwhas.filter((m) => m.status === "to-continue").length,
      abandoned: manwhas.filter((m) => m.status === "abandoned").length,
      ended: manwhas.filter((m) => m.status === "ended").length,
    };

    return {
      user,
      manwhas: manwhas.map((manwha) => ({
        ...manwha,
        _id: manwha._id?.toString(),
      })),
      stats,
      sortBy,
      sortOrder,
    };
  } catch (error) {
    console.error("Error fetching manwhas:", error);
    return {
      user,
      manwhas: [],
      stats: {
        total: 0,
        reading: 0,
        completed: 0,
        toContinue: 0,
        abandoned: 0,
        ended: 0,
      },
      sortBy: "updatedAt",
      sortOrder: "desc",
    };
  }
};
