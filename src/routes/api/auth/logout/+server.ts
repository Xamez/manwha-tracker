import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const POST: RequestHandler = () => {
  try {
    const response = json({ message: "Logout successful" });

    // Clear the authentication cookie
    response.headers.set(
      "Set-Cookie",
      "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
    );

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
