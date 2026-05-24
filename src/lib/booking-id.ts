import type { Trip } from "@prisma/client";
import { prisma } from "@/lib/db";

function ddmm(date: Date) {
  return `${String(date.getUTCDate()).padStart(2, "0")}${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function cleanSegment(value: string) {
  return value.trim().replace(/[^a-z0-9]+/gi, "").slice(0, 24) || "Guest";
}

export async function generateBookingCode(trip: Pick<Trip, "tripCode" | "location" | "numberOfDays">, startDate: Date, endDate: Date, firstName: string) {
  const base = `${trip.tripCode}-${trip.location}-${trip.numberOfDays}-${ddmm(startDate)}-${ddmm(endDate)}-${cleanSegment(firstName)}`;
  const existing = await prisma.booking.count({ where: { bookingCode: { startsWith: base } } });

  return existing ? `${base}-${existing + 1}` : base;
}

export async function generateGroupBookingCode(tripCode: string, startDate: Date, firstName: string) {
  const base = `GRP-${tripCode}-${ddmm(startDate)}-${cleanSegment(firstName).toUpperCase()}`;
  const existing = await prisma.bookingGroup.count({ where: { groupBookingCode: { startsWith: base } } });

  return existing ? `${base}-${existing + 1}` : base;
}