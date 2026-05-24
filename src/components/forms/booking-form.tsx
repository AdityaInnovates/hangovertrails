"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import {
  CalendarDays,
  FileUp,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/status-badge";
import { BOOKING_TYPES, GENDERS } from "@/lib/domain";

type TripOption = {
  id: string;
  name: string;
  slug: string;
  location: string;
  numberOfDays: number;
  basePriceCents: number;
  maxCapacity: number;
  minBookingDaysInAdvance: number;
};

type BookingFormValues = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  address: string;
  pin: string;
  phone: string;
  dob: string;
  gender: string;
  emergencyContact: string;
  consentGiven: boolean;
  bookingType: string;
  peopleCount: number;
  tripId: string;
  startDate: string;
};

type BookingApiResponse =
  | { success: true; data: { booking: { bookingCode: string } } }
  | { success: false; error: { code: string; message: string } };

const draftKey = "arunachal-booking-draft";

function addDays(dateValue: string, days: number) {
  const date = new Date(`${dateValue}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

export function BookingForm({ trips }: { trips: TripOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preferredTrip = searchParams.get("trip");
  const initialTrip =
    trips.find((trip) => trip.slug === preferredTrip)?.id ?? trips[0]?.id ?? "";
  const [file, setFile] = useState<File | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      address: "",
      pin: "",
      phone: "",
      dob: "",
      gender: "Male",
      emergencyContact: "",
      consentGiven: false,
      bookingType: "SOLO",
      peopleCount: 1,
      tripId: initialTrip,
      startDate: "",
    },
    mode: "onBlur",
  });

  const watched = useWatch({ control: form.control });
  const selectedTrip =
    trips.find((trip) => trip.id === watched.tripId) ?? trips[0];
  const endDate =
    watched.startDate && selectedTrip
      ? addDays(watched.startDate, selectedTrip.numberOfDays - 1)
      : "";
  const peopleCount = Number(watched.peopleCount || 1);
  const totalAmount = selectedTrip
    ? selectedTrip.basePriceCents * peopleCount
    : 0;
  const depositAmount = Math.ceil(totalAmount * 0.3);

  const minStartDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + (selectedTrip?.minBookingDaysInAdvance ?? 3));
    return date.toISOString().slice(0, 10);
  }, [selectedTrip?.minBookingDaysInAdvance]);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(draftKey);

    if (saved) {
      form.reset({
        ...form.getValues(),
        ...JSON.parse(saved),
        tripId: initialTrip,
      });
    }
  }, [form, initialTrip]);

  useEffect(() => {
    window.sessionStorage.setItem(draftKey, JSON.stringify(watched));
  }, [watched]);

  async function onSubmit(values: BookingFormValues) {
    setServerError(null);

    if (!file) {
      setServerError("Aadhaar upload is required.");
      return;
    }

    if (selectedTrip && Number(values.peopleCount) > selectedTrip.maxCapacity) {
      setServerError(
        `This trip supports up to ${selectedTrip.maxCapacity} travelers.`,
      );
      return;
    }

    setSubmitting(true);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    formData.append("endDate", endDate);
    formData.append("aadhaarFile", file);

    const response = await fetch("/api/book-trip", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as BookingApiResponse;
    setSubmitting(false);

    if (!result.success) {
      setServerError(result.error.message);
      return;
    }

    window.sessionStorage.removeItem(draftKey);
    router.push(`/booking/${result.data.booking.bookingCode}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
      <section className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <CalendarDays className="size-5 text-sunrise" aria-hidden="true" />
          <h2 className="text-xl font-bold">Trip Selection</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Trip" {...form.register("tripId", { required: true })}>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </Select>
          <Select
            label="Booking type"
            {...form.register("bookingType", { required: true })}
          >
            {BOOKING_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === "SOLO" ? "Solo" : "Group"}
              </option>
            ))}
          </Select>
          <Input
            label="Number of people"
            type="number"
            min={1}
            max={selectedTrip?.maxCapacity ?? 30}
            {...form.register("peopleCount", {
              valueAsNumber: true,
              min: 1,
              max: selectedTrip?.maxCapacity ?? 30,
            })}
          />
          <Input
            label="Start date"
            type="date"
            min={minStartDate}
            {...form.register("startDate", { required: true })}
          />
        </div>
        {selectedTrip && (
          <div className="mt-5 grid gap-3 rounded-3xl bg-background p-4 text-sm text-stone sm:grid-cols-3">
            <span>{selectedTrip.location}</span>
            <span>
              {selectedTrip.numberOfDays} days · ends{" "}
              {endDate || "after start date"}
            </span>
            <span>
              {formatCurrency(totalAmount)} total ·{" "}
              {formatCurrency(depositAmount)} deposit today
            </span>
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <Users className="size-5 text-sunrise" aria-hidden="true" />
          <h2 className="text-xl font-bold">Traveler Details</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="First name"
            error={form.formState.errors.firstName?.message}
            {...form.register("firstName", {
              required: "First name is required",
            })}
          />
          <Input label="Middle name" {...form.register("middleName")} />
          <Input
            label="Last name"
            error={form.formState.errors.lastName?.message}
            {...form.register("lastName", {
              required: "Last name is required",
            })}
          />
          <Input
            label="Email"
            type="email"
            error={form.formState.errors.email?.message}
            {...form.register("email", { required: "Email is required" })}
          />
          <Input
            label="Phone"
            helperText="Use +91 format or 10 digits"
            error={form.formState.errors.phone?.message}
            {...form.register("phone", { required: "Phone is required" })}
          />
          <Input
            label="Date of birth"
            type="date"
            error={form.formState.errors.dob?.message}
            {...form.register("dob", { required: "Date of birth is required" })}
          />
          <Select
            label="Gender"
            {...form.register("gender", { required: true })}
          >
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </Select>
          <Input
            label="PIN"
            error={form.formState.errors.pin?.message}
            {...form.register("pin", { required: "PIN is required" })}
          />
          <Input
            label="Emergency contact"
            {...form.register("emergencyContact")}
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Address"
            error={form.formState.errors.address?.message}
            {...form.register("address", { required: "Address is required" })}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-line bg-surface p-5 shadow-soft sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <ShieldCheck className="size-5 text-sunrise" aria-hidden="true" />
          <h2 className="text-xl font-bold">Document and Confirmation</h2>
        </div>
        <label className="grid gap-3 rounded-3xl border border-dashed border-line bg-background p-5 text-sm font-semibold text-foreground">
          <span className="inline-flex items-center gap-2">
            <FileUp className="size-4 text-sunrise" aria-hidden="true" /> Upload
            Aadhaar card
          </span>
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <span className="text-xs font-medium text-stone">
            PDF, JPG, or PNG. Maximum 5 MB. Used only to prepare your booking.
          </span>
          {file ? <StatusBadge tone="success">{file.name}</StatusBadge> : null}
        </label>
        <label className="mt-5 flex gap-3 text-sm leading-6 text-stone">
          <input
            type="checkbox"
            className="mt-1 size-4"
            {...form.register("consentGiven", { required: true })}
          />
          I confirm the traveler details are accurate and consent to secure
          document handling for this booking.
        </label>
      </section>

      {serverError && (
        <p className="rounded-3xl bg-danger/10 px-5 py-4 text-sm font-bold text-danger">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        loading={submitting}
        disabled={submitting}
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {submitting ? "Creating booking" : "Confirm booking"}
      </Button>
    </form>
  );
}
