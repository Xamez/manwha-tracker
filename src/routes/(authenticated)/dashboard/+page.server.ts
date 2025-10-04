import type { ServerLoad } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { getManwhasCollection } from "$lib/database.ts";

export const load: ServerLoad = async ({ parent }) => {
  const { user } = await parent();

  if (!user) {
    throw redirect(302, "/login");
  }

  try {
    const manwhasCollection = await getManwhasCollection();

    const allManwhas = await manwhasCollection
      .find({ userId: user.userId })
      .sort({ updatedAt: -1 })
      .toArray();

    const stats = {
      total: allManwhas.length,
      reading: allManwhas.filter((m) => m.status === "reading").length,
      completed: allManwhas.filter((m) => m.status === "completed").length,
      toContinue: allManwhas.filter((m) => m.status === "to-continue").length,
      abandoned: allManwhas.filter((m) => m.status === "abandoned").length,
      ended: allManwhas.filter((m) => m.status === "ended").length,
    };

    const recentManwhas = allManwhas.slice(0, 3);

    return {
      stats,
      recentManwhas: recentManwhas.map((manwha) => ({
        ...manwha,
        _id: manwha._id?.toString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      stats: {
        total: 0,
        reading: 0,
        completed: 0,
        toContinue: 0,
        abandoned: 0,
        ended: 0,
      },
      recentManwhas: [],
    };
  }
};
