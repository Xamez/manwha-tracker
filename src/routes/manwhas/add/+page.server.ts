import type { ServerLoad } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { authenticateUser } from "../$lib/middleware.ts";

export const load: ServerLoad = ({ request }: { request: Request }) => {
  const cookieHeader = request.headers.get("cookie");
  const user = authenticateUser(cookieHeader || undefined);

  if (!user) {
    throw redirect(302, "/login");
  }

  return {
    user,
  };
};
