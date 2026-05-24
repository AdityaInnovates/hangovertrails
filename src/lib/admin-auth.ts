import { fail } from "@/lib/api-response";
import { getCurrentAdmin } from "@/lib/auth";

export async function requireAdmin() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return {
      admin: null,
      response: fail("UNAUTHORIZED", "Admin authentication is required.", 401),
    };
  }

  return { admin, response: null };
}
