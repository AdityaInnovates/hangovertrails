import { subMonths } from "date-fns";
import { prisma } from "@/lib/db";

export function formatMoney(amountCents: number) {
  return `INR ${(amountCents / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export async function getDashboardData() {
  const [trips, bookings, payments, expenses, recentBookings] =
    await Promise.all([
      prisma.trip.findMany({ include: { bookings: true, expenses: true } }),
      prisma.booking.findMany({ include: { trip: true, payments: true } }),
      prisma.payment.findMany({
        include: { booking: { include: { trip: true } } },
      }),
      prisma.expense.findMany({ include: { trip: true } }),
      prisma.booking.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { trip: true, group: true },
      }),
    ]);

  const revenue = payments.reduce(
    (total, payment) => total + payment.paidAmountCents,
    0,
  );
  const expenseTotal = expenses.reduce(
    (total, expense) => total + expense.amountCents,
    0,
  );
  const profit = revenue - expenseTotal;
  const pendingPayments = payments
    .filter((payment) => payment.status !== "PAID")
    .reduce((total, payment) => total + payment.dueAmountCents, 0);
  const completedTrips = bookings.filter(
    (booking) => booking.bookingStatus === "COMPLETED",
  ).length;
  const activeTrips = trips.filter((trip) => trip.isActive).length;
  const averageBookingValue = bookings.length
    ? Math.round(
        bookings.reduce(
          (total, booking) => total + booking.bookingAmountCents,
          0,
        ) / bookings.length,
      )
    : 0;

  const months = Array.from({ length: 6 }, (_, index) =>
    subMonths(new Date(), 5 - index),
  );
  const monthlyBookings = months.map((month) => {
    const label = month.toLocaleString("en-IN", { month: "short" });
    const value = bookings.filter(
      (booking) =>
        booking.createdAt.getMonth() === month.getMonth() &&
        booking.createdAt.getFullYear() === month.getFullYear(),
    ).length;
    return { label, value };
  });
  const revenueTrend = months.map((month) => {
    const label = month.toLocaleString("en-IN", { month: "short" });
    const value = payments
      .filter(
        (payment) =>
          payment.paidAt &&
          payment.paidAt.getMonth() === month.getMonth() &&
          payment.paidAt.getFullYear() === month.getFullYear(),
      )
      .reduce((total, payment) => total + payment.paidAmountCents / 100, 0);
    return { label, value };
  });
  const locationPopularity = trips.map((trip) => ({
    label: trip.location,
    value: trip.bookings.reduce(
      (total, booking) => total + booking.peopleCount,
      0,
    ),
  }));
  const expenseBreakdown = expenses.reduce<Record<string, number>>(
    (acc, expense) => {
      acc[expense.category] =
        (acc[expense.category] ?? 0) + expense.amountCents / 100;
      return acc;
    },
    {},
  );
  const bookingDistribution = bookings.reduce<Record<string, number>>(
    (acc, booking) => {
      acc[booking.bookingStatus] = (acc[booking.bookingStatus] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return {
    kpis: {
      revenue,
      profit,
      expenseTotal,
      activeTrips,
      pendingPayments,
      completedTrips,
      monthlyBookingCount: monthlyBookings.at(-1)?.value ?? 0,
      averageBookingValue,
    },
    charts: {
      revenueTrend,
      monthlyBookings,
      locationPopularity,
      expenseBreakdown: Object.entries(expenseBreakdown).map(
        ([label, value]) => ({ label, value }),
      ),
      bookingDistribution: Object.entries(bookingDistribution).map(
        ([label, value]) => ({ label, value }),
      ),
    },
    recentBookings,
  };
}
