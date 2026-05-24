import { ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboardData } from "@/lib/admin-data";

export async function GET() {
  const { response } = await requireAdmin();

  if (response) return response;

  return ok(await getDashboardData());
}