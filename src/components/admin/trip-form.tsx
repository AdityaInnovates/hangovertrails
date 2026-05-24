"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LOCATIONS } from "@/lib/domain";

type DayDraft = {
  title: string;
  stayLocation: string;
  visitingPlaces: string;
  activities: string;
  stayProperties: string;
  notes: string;
};

function splitList(value: FormDataEntryValue | string | null) {
  return String(value ?? "")
    .split("\n")
    .flatMap((line) => line.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function blankDay(index: number): DayDraft {
  return {
    title: `Day ${index + 1} plan`,
    stayLocation: "To be confirmed",
    visitingPlaces: "Main viewpoint",
    activities: "Scenic drive",
    stayProperties: "Comfort stay",
    notes: "Final route details can be refined later.",
  };
}

export function TripForm() {
  const router = useRouter();
  const [days, setDays] = useState<DayDraft[]>([
    blankDay(0),
    blankDay(1),
    blankDay(2),
  ]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function setDayCount(count: number) {
    const safeCount = Math.min(Math.max(count || 1, 1), 30);
    setDays((current) =>
      Array.from(
        { length: safeCount },
        (_, index) => current[index] ?? blankDay(index),
      ),
    );
  }

  function updateDay(index: number, key: keyof DayDraft, value: string) {
    setDays((current) =>
      current.map((day, dayIndex) =>
        dayIndex === index ? { ...day, [key]: value } : day,
      ),
    );
  }

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage(null);

    const response = await fetch("/api/admin/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tripCode: formData.get("tripCode"),
        name: formData.get("name"),
        slug: formData.get("slug"),
        location: formData.get("location"),
        numberOfDays: Number(formData.get("numberOfDays")),
        vehicleType: formData.get("vehicleType"),
        gstIncluded: formData.get("gstIncluded") === "on",
        inclusions: splitList(formData.get("inclusions")),
        exclusions: splitList(formData.get("exclusions")),
        basePrice: Number(formData.get("basePrice")),
        totalCost: Number(formData.get("totalCost")),
        maxCapacity: Number(formData.get("maxCapacity")),
        minBookingDaysInAdvance: Number(
          formData.get("minBookingDaysInAdvance"),
        ),
        isActive: formData.get("isActive") === "on",
        heroImageUrl: formData.get("heroImageUrl"),
        cardImageUrl: formData.get("cardImageUrl"),
        galleryImages: splitList(formData.get("galleryImages")),
        itineraryDays: days.map((day, index) => ({
          dayNumber: index + 1,
          title: day.title,
          stayLocation: day.stayLocation,
          visitingPlaces: splitList(day.visitingPlaces),
          activities: splitList(day.activities),
          vehicle: String(formData.get("vehicleType") ?? "Vehicle"),
          stayProperties: splitList(day.stayProperties),
          imageUrl: String(formData.get("cardImageUrl") ?? ""),
          notes: day.notes,
        })),
      }),
    });
    const result = await response.json();
    setLoading(false);

    if (!result.success) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Trip added");
    router.refresh();
  }

  return (
    <form
      action={submit}
      className="grid gap-5 rounded-3xl border border-line bg-surface p-5 shadow-soft"
    >
      <div>
        <h2 className="text-2xl font-bold">Add a New Trip</h2>
        <p className="mt-1 text-sm leading-6 text-stone">
          Create the public tour page and the planning record at the same time.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <input
          name="tripCode"
          placeholder="Trip code, e.g. H2605"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
        />
        <input
          name="name"
          placeholder="Trip name"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm md:col-span-2"
          required
        />
        <select
          name="location"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
          required
        >
          {LOCATIONS.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <input
          name="slug"
          placeholder="URL slug, optional"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
        />
        <input
          name="vehicleType"
          placeholder="Vehicle type"
          defaultValue="SUV"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
          required
        />
        <input
          name="numberOfDays"
          type="number"
          min="1"
          max="30"
          defaultValue={days.length}
          onChange={(event) => setDayCount(Number(event.target.value))}
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
          required
        />
        <input
          name="maxCapacity"
          type="number"
          min="1"
          defaultValue="12"
          placeholder="Capacity"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
          required
        />
        <input
          name="basePrice"
          type="number"
          min="1"
          step="1"
          placeholder="Price per person"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
          required
        />
        <input
          name="totalCost"
          type="number"
          min="0"
          step="1"
          placeholder="Estimated trip cost"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
          required
        />
        <input
          name="minBookingDaysInAdvance"
          type="number"
          min="0"
          defaultValue="3"
          placeholder="Advance days"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
          required
        />
        <label className="flex items-center gap-2 rounded-2xl border border-line bg-background px-4 py-3 text-sm font-bold">
          <input name="gstIncluded" type="checkbox" defaultChecked /> GST
          included
        </label>
        <label className="flex items-center gap-2 rounded-2xl border border-line bg-background px-4 py-3 text-sm font-bold">
          <input name="isActive" type="checkbox" defaultChecked /> Show to
          travelers
        </label>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <textarea
          name="inclusions"
          placeholder="Inclusions, one per line"
          defaultValue={"Stay\nBreakfast and dinner\nGround transfers"}
          className="min-h-28 rounded-2xl border border-line bg-background px-4 py-3 text-sm"
          required
        />
        <textarea
          name="exclusions"
          placeholder="Exclusions, one per line"
          defaultValue={"Flights\nPersonal expenses"}
          className="min-h-28 rounded-2xl border border-line bg-background px-4 py-3 text-sm"
        />
        <input
          name="heroImageUrl"
          placeholder="Hero image URL, optional"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
        />
        <input
          name="cardImageUrl"
          placeholder="Card image URL, optional"
          className="rounded-2xl border border-line bg-background px-4 py-3 text-sm"
        />
        <textarea
          name="galleryImages"
          placeholder="Gallery image URLs, one per line"
          className="min-h-24 rounded-2xl border border-line bg-background px-4 py-3 text-sm md:col-span-2"
        />
      </div>
      <div className="grid gap-4">
        {days.map((day, index) => (
          <fieldset
            key={index}
            className="grid gap-3 rounded-3xl border border-line bg-background p-4 md:grid-cols-2"
          >
            <legend className="px-2 text-sm font-black text-forest">
              Day {index + 1}
            </legend>
            <input
              value={day.title}
              onChange={(event) =>
                updateDay(index, "title", event.target.value)
              }
              placeholder="Day title"
              className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm"
              required
            />
            <input
              value={day.stayLocation}
              onChange={(event) =>
                updateDay(index, "stayLocation", event.target.value)
              }
              placeholder="Stay location"
              className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm"
              required
            />
            <input
              value={day.visitingPlaces}
              onChange={(event) =>
                updateDay(index, "visitingPlaces", event.target.value)
              }
              placeholder="Places, comma separated"
              className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm"
              required
            />
            <input
              value={day.activities}
              onChange={(event) =>
                updateDay(index, "activities", event.target.value)
              }
              placeholder="Activities, comma separated"
              className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm"
              required
            />
            <input
              value={day.stayProperties}
              onChange={(event) =>
                updateDay(index, "stayProperties", event.target.value)
              }
              placeholder="Stay options, comma separated"
              className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm"
              required
            />
            <input
              value={day.notes}
              onChange={(event) =>
                updateDay(index, "notes", event.target.value)
              }
              placeholder="Notes"
              className="rounded-2xl border border-line bg-surface px-4 py-3 text-sm"
            />
          </fieldset>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" loading={loading}>
          Create trip
        </Button>
        {message ? (
          <p className="text-sm font-bold text-stone">{message}</p>
        ) : null}
      </div>
    </form>
  );
}
