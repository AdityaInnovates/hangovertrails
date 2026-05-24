import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { LOCATIONS } from "@/lib/domain";

const imageFallbacks = {
  Tawang:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
  Ziro: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=85",
  Mechuka:
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=85",
  Anini:
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=85",
};

const itineraryDaySchema = z.object({
  dayNumber: z.coerce.number().int().positive(),
  title: z.string().trim().min(2),
  stayLocation: z.string().trim().min(2),
  visitingPlaces: z.array(z.string().trim().min(1)).min(1),
  activities: z.array(z.string().trim().min(1)).min(1),
  vehicle: z.string().trim().min(2),
  stayProperties: z.array(z.string().trim().min(1)).min(1),
  imageUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().trim().optional(),
});

const tripSchema = z.object({
  tripCode: z.string().trim().optional(),
  name: z.string().trim().min(3),
  slug: z.string().trim().optional(),
  location: z.enum(LOCATIONS),
  numberOfDays: z.coerce.number().int().min(1).max(30),
  vehicleType: z.string().trim().min(2),
  gstIncluded: z.boolean().default(true),
  inclusions: z.array(z.string().trim().min(1)).min(1),
  exclusions: z.array(z.string().trim().min(1)).default([]),
  basePrice: z.coerce.number().positive(),
  totalCost: z.coerce.number().nonnegative(),
  maxCapacity: z.coerce.number().int().min(1).max(80),
  minBookingDaysInAdvance: z.coerce.number().int().min(0).max(365).default(3),
  isActive: z.boolean().default(true),
  heroImageUrl: z.string().url().optional().or(z.literal("")),
  cardImageUrl: z.string().url().optional().or(z.literal("")),
  galleryImages: z.array(z.string().url()).default([]),
  itineraryDays: z.array(itineraryDaySchema).min(1),
});

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCents(amount: number) {
  return Math.round(amount * 100);
}

export async function GET() {
  const { response } = await requireAdmin();

  if (response) return response;

  const trips = await prisma.trip.findMany({
    include: { itineraryDays: { orderBy: { dayNumber: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return ok(trips);
}

export async function POST(request: Request) {
  const { admin, response } = await requireAdmin();

  if (response) return response;

  const body = tripSchema.safeParse(await request.json().catch(() => null));

  if (!body.success) {
    return fail(
      "INVALID_TRIP",
      "Add the trip name, prices, capacity, and at least one itinerary day.",
    );
  }

  const tripCode = body.data.tripCode || `HT${Date.now().toString().slice(-6)}`;
  const slug = body.data.slug
    ? slugify(body.data.slug)
    : slugify(body.data.name);
  const fallbackImage = imageFallbacks[body.data.location];
  const heroImageUrl = body.data.heroImageUrl || fallbackImage;
  const cardImageUrl = body.data.cardImageUrl || heroImageUrl;
  const galleryImages = body.data.galleryImages.length
    ? body.data.galleryImages
    : [heroImageUrl, cardImageUrl];

  const existing = await prisma.trip.findFirst({
    where: { OR: [{ tripCode }, { slug }] },
  });

  if (existing) {
    return fail(
      "TRIP_ALREADY_EXISTS",
      "A trip with this code or URL slug already exists.",
      409,
    );
  }

  const trip = await prisma.trip.create({
    data: {
      tripCode,
      name: body.data.name,
      slug,
      location: body.data.location,
      numberOfDays: body.data.numberOfDays,
      vehicleType: body.data.vehicleType,
      gstIncluded: body.data.gstIncluded,
      inclusions: body.data.inclusions,
      exclusions: body.data.exclusions,
      basePriceCents: toCents(body.data.basePrice),
      totalCostCents: toCents(body.data.totalCost),
      maxCapacity: body.data.maxCapacity,
      minBookingDaysInAdvance: body.data.minBookingDaysInAdvance,
      isActive: body.data.isActive,
      heroImageUrl,
      cardImageUrl,
      galleryImages,
      itineraryDays: {
        create: body.data.itineraryDays.map((day) => ({
          dayNumber: day.dayNumber,
          title: day.title,
          stayLocation: day.stayLocation,
          visitingPlaces: day.visitingPlaces,
          activities: day.activities,
          vehicle: day.vehicle,
          stayProperties: day.stayProperties,
          imageUrl: day.imageUrl || cardImageUrl,
          notes: day.notes,
        })),
      },
    },
    include: { itineraryDays: { orderBy: { dayNumber: "asc" } } },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin?.id,
      actorEmail: admin?.email,
      action: "TRIP_CREATED",
      entityType: "Trip",
      entityId: trip.id,
      metadata: { tripCode: trip.tripCode, name: trip.name },
    },
  });

  return ok(trip, { status: 201 });
}
