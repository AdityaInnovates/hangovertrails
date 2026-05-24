import { fail, ok } from "@/lib/api-response";
import { getTrips, isLocation } from "@/lib/public-data";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const location = url.searchParams.get("location");
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Number(limitParam) : 12;

  if (location && !isLocation(location)) {
    return fail(
      "INVALID_LOCATION",
      "Trips can only be filtered by Tawang, Ziro, Mechuka, or Anini.",
    );
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    return fail("INVALID_LIMIT", "Limit must be an integer between 1 and 50.");
  }

  const filteredLocation =
    location && isLocation(location) ? location : undefined;
  const trips = await getTrips(filteredLocation, limit);

  return ok({ trips, pagination: { limit, count: trips.length } });
}
