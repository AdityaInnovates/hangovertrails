import { fail, ok } from "@/lib/api-response";
import { getTripByIdOrSlug } from "@/lib/public-data";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const trip = await getTripByIdOrSlug(id);

  if (!trip) {
    return fail(
      "TRIP_NOT_FOUND",
      "No active trip was found for the provided identifier.",
      404,
    );
  }

  return ok({ trip });
}
