import { ok } from "@/lib/api-response";
import { getDestinations } from "@/lib/public-data";

export async function GET() {
  const destinations = await getDestinations();

  return ok({ destinations });
}
