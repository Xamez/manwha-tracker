import type { ServerLoad } from "@sveltejs/kit";
import { authenticateUser } from "$lib/middleware.ts";

export const load: ServerLoad = ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  const user = authenticateUser(cookieHeader || undefined);

  return {
    user,
  };
};
