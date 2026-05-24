import { prisma } from "@/lib/db";
import { LOCATIONS, type Location } from "@/lib/domain";

export type DestinationSummary = {
  name: Location;
  slug: string;
  description: string;
  imageUrl: string;
  tripCount: number;
};

export type TripSummary = {
  id: string;
  tripCode: string;
  name: string;
  slug: string;
  location: string;
  numberOfDays: number;
  basePriceCents: number;
  maxCapacity: number;
  heroImageUrl: string;
  cardImageUrl: string;
  inclusions: unknown;
  itineraryDays: {
    dayNumber: number;
    title: string;
    stayLocation: string;
    visitingPlaces: unknown;
  }[];
};

const destinationCopy: Record<
  Location,
  Omit<DestinationSummary, "name" | "tripCount">
> = {
  Tawang: {
    slug: "tawang",
    description:
      "High passes, monastery mornings, alpine lakes, and cinematic Himalayan road journeys.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85",
  },
  Ziro: {
    slug: "ziro",
    description:
      "Apatani culture, paddy landscapes, pine ridges, slow village walks, and warm homestays.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85",
  },
  Mechuka: {
    slug: "mechuka",
    description:
      "Remote river valleys, monastery trails, wooden homes, and soft evening mountain light.",
    imageUrl:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85",
  },
  Anini: {
    slug: "anini",
    description:
      "Cloud forests, 4x4 routes, quiet ridgelines, and one of Arunachal's wildest frontiers.",
    imageUrl:
      "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1400&q=85",
  },
};

export function isLocation(value: string | null): value is Location {
  return Boolean(value && LOCATIONS.includes(value as Location));
}

export async function getDestinations(): Promise<DestinationSummary[]> {
  const groupedTrips = await prisma.trip.groupBy({
    by: ["location"],
    where: { isActive: true },
    _count: { id: true },
  });

  return LOCATIONS.map((name) => {
    const tripCount =
      groupedTrips.find((group) => group.location === name)?._count.id ?? 0;

    return {
      name,
      tripCount,
      ...destinationCopy[name],
    };
  });
}

export async function getDestinationBySlug(slug: string) {
  const destinations = await getDestinations();

  return destinations.find((destination) => destination.slug === slug);
}

export async function getTrips(
  location?: Location,
  limit = 12,
): Promise<TripSummary[]> {
  return prisma.trip.findMany({
    where: {
      isActive: true,
      ...(location ? { location } : {}),
    },
    orderBy: [{ location: "asc" }, { basePriceCents: "asc" }],
    take: limit,
    select: {
      id: true,
      tripCode: true,
      name: true,
      slug: true,
      location: true,
      numberOfDays: true,
      basePriceCents: true,
      maxCapacity: true,
      heroImageUrl: true,
      cardImageUrl: true,
      inclusions: true,
      itineraryDays: {
        orderBy: { dayNumber: "asc" },
        take: 3,
        select: {
          dayNumber: true,
          title: true,
          stayLocation: true,
          visitingPlaces: true,
        },
      },
    },
  });
}

export async function getTripByIdOrSlug(idOrSlug: string) {
  return prisma.trip.findFirst({
    where: {
      isActive: true,
      OR: [{ id: idOrSlug }, { slug: idOrSlug }, { tripCode: idOrSlug }],
    },
    include: {
      itineraryDays: {
        orderBy: { dayNumber: "asc" },
      },
    },
  });
}
