import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=85`;

const toCents = (amount: number) => Math.round(amount * 100);

const asDate = (value: string) => new Date(`${value}T00:00:00.000Z`);

const trips = [
  {
    tripCode: "H2601",
    name: "Tawang High Pass Expedition",
    slug: "tawang-high-pass-expedition",
    location: "Tawang",
    numberOfDays: 6,
    vehicleType: "SUV Convoy",
    gstIncluded: true,
    basePriceCents: toCents(38999),
    totalCostCents: toCents(246000),
    maxCapacity: 14,
    minBookingDaysInAdvance: 7,
    heroImageUrl: image("photo-1500530855697-b586d89ba3ee"),
    cardImageUrl: image("photo-1500530855697-b586d89ba3ee"),
    galleryImages: [
      image("photo-1500530855697-b586d89ba3ee"),
      image("photo-1464822759023-fed622ff2c3b"),
      image("photo-1470770841072-f978cf4d019e"),
    ],
    inclusions: ["Boutique stays", "Breakfast and dinner", "Local guide", "Permits", "SUV transfers"],
    exclusions: ["Flights", "Personal shopping", "Lunch", "Insurance"],
    itinerary: [
      {
        dayNumber: 1,
        title: "Guwahati to Sangti Valley",
        stayLocation: "Sangti Valley",
        visitingPlaces: ["Bhalukpong", "Dirang River"],
        activities: ["Scenic drive", "Welcome dinner"],
        vehicle: "SUV",
        stayProperties: ["Sangti Riverside Lodge", "Valley View Homestay"],
        imageUrl: image("photo-1464822759023-fed622ff2c3b"),
        notes: "Easy acclimatization day with relaxed arrival timing.",
      },
      {
        dayNumber: 2,
        title: "Dirang Monasteries and Hot Springs",
        stayLocation: "Dirang",
        visitingPlaces: ["Dirang Dzong", "Hot Water Spring"],
        activities: ["Monastery visit", "Local market walk"],
        vehicle: "SUV",
        stayProperties: ["Dirang Boutique Stay", "Mountain Courtyard"],
        imageUrl: image("photo-1470770841072-f978cf4d019e"),
        notes: "Keep camera gear ready for valley viewpoints.",
      },
      {
        dayNumber: 3,
        title: "Sela Pass to Tawang",
        stayLocation: "Tawang",
        visitingPlaces: ["Sela Pass", "Jaswant Garh", "Jang"],
        activities: ["High-pass drive", "War memorial stop"],
        vehicle: "SUV",
        stayProperties: ["Tawang Heritage Retreat", "Monastery View Inn"],
        imageUrl: image("photo-1500534314209-a25ddb2bd429"),
        notes: "Weather buffer required around Sela Pass.",
      },
      {
        dayNumber: 4,
        title: "Tawang Monastery and Memorial Trail",
        stayLocation: "Tawang",
        visitingPlaces: ["Tawang Monastery", "Tawang War Memorial"],
        activities: ["Heritage walk", "Evening light show"],
        vehicle: "SUV",
        stayProperties: ["Tawang Heritage Retreat", "Monastery View Inn"],
        imageUrl: image("photo-1500534314209-a25ddb2bd429"),
        notes: "Best morning light for monastery photography.",
      },
      {
        dayNumber: 5,
        title: "Tawang to Jamiri Forest Stay",
        stayLocation: "Jamiri",
        visitingPlaces: ["Jang Falls", "Jamiri"],
        activities: ["Forest stay", "Bonfire"],
        vehicle: "SUV",
        stayProperties: ["Jamiri Forest Lodge"],
        imageUrl: image("photo-1447752875215-b2761acb3c5d"),
        notes: "Bonfire depends on local weather rules.",
      },
      {
        dayNumber: 6,
        title: "Return with Valley Breakfast",
        stayLocation: "Departure",
        visitingPlaces: ["Bomdila viewpoint"],
        activities: ["Return transfer"],
        vehicle: "SUV",
        stayProperties: ["Day use only"],
        imageUrl: image("photo-1501785888041-af3ef285b470"),
        notes: "Long drive day; early departure recommended.",
      },
    ],
  },
  {
    tripCode: "H2602",
    name: "Ziro Valley Culture Trail",
    slug: "ziro-valley-culture-trail",
    location: "Ziro",
    numberOfDays: 5,
    vehicleType: "Tempo Traveller",
    gstIncluded: true,
    basePriceCents: toCents(29999),
    totalCostCents: toCents(176000),
    maxCapacity: 18,
    minBookingDaysInAdvance: 5,
    heroImageUrl: image("photo-1500534314209-a25ddb2bd429"),
    cardImageUrl: image("photo-1500534314209-a25ddb2bd429"),
    galleryImages: [image("photo-1500534314209-a25ddb2bd429"), image("photo-1447752875215-b2761acb3c5d")],
    inclusions: ["Homestays", "Local host", "Permits", "Ground transfers"],
    exclusions: ["Flights", "Alcohol", "Personal expenses"],
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrival in Ziro",
        stayLocation: "Old Ziro",
        visitingPlaces: ["Hong Village"],
        activities: ["Apatani village walk"],
        vehicle: "Tempo Traveller",
        stayProperties: ["Apatani Heritage Homestay"],
        imageUrl: image("photo-1500534314209-a25ddb2bd429"),
        notes: "Slow first day focused on local orientation.",
      },
      {
        dayNumber: 2,
        title: "Paddy Fields and Pine Ridges",
        stayLocation: "Ziro Valley",
        visitingPlaces: ["Paddy fields", "Pine Grove"],
        activities: ["Photography walk", "Local lunch"],
        vehicle: "Tempo Traveller",
        stayProperties: ["Valley Farmstay"],
        imageUrl: image("photo-1447752875215-b2761acb3c5d"),
        notes: "Golden hour field walk.",
      },
    ],
  },
  {
    tripCode: "H2603",
    name: "Mechuka River and Monastery Escape",
    slug: "mechuka-river-monastery-escape",
    location: "Mechuka",
    numberOfDays: 7,
    vehicleType: "SUV Convoy",
    gstIncluded: true,
    basePriceCents: toCents(44999),
    totalCostCents: toCents(318000),
    maxCapacity: 12,
    minBookingDaysInAdvance: 10,
    heroImageUrl: image("photo-1501785888041-af3ef285b470"),
    cardImageUrl: image("photo-1501785888041-af3ef285b470"),
    galleryImages: [image("photo-1501785888041-af3ef285b470"), image("photo-1464822759023-fed622ff2c3b")],
    inclusions: ["Premium homestays", "River picnic", "Guide", "Transfers"],
    exclusions: ["Flights", "Adventure insurance", "Personal expenses"],
    itinerary: [
      {
        dayNumber: 1,
        title: "Into the Siang Belt",
        stayLocation: "Along",
        visitingPlaces: ["Siang River viewpoint"],
        activities: ["Scenic transfer"],
        vehicle: "SUV",
        stayProperties: ["Riverbend Stay"],
        imageUrl: image("photo-1501785888041-af3ef285b470"),
        notes: "Long scenic approach toward Mechuka.",
      },
    ],
  },
  {
    tripCode: "H2604",
    name: "Anini Cloud Forest Journey",
    slug: "anini-cloud-forest-journey",
    location: "Anini",
    numberOfDays: 8,
    vehicleType: "4x4 SUV",
    gstIncluded: true,
    basePriceCents: toCents(52999),
    totalCostCents: toCents(386000),
    maxCapacity: 10,
    minBookingDaysInAdvance: 14,
    heroImageUrl: image("photo-1447752875215-b2761acb3c5d"),
    cardImageUrl: image("photo-1447752875215-b2761acb3c5d"),
    galleryImages: [image("photo-1447752875215-b2761acb3c5d"), image("photo-1500530855697-b586d89ba3ee")],
    inclusions: ["Remote stays", "Guide", "Permits", "4x4 transfers"],
    exclusions: ["Flights", "Medical evacuation", "Personal gear"],
    itinerary: [
      {
        dayNumber: 1,
        title: "Dibrugarh to Roing",
        stayLocation: "Roing",
        visitingPlaces: ["Mayudia foothills"],
        activities: ["Arrival transfer"],
        vehicle: "4x4 SUV",
        stayProperties: ["Roing Transit Lodge"],
        imageUrl: image("photo-1447752875215-b2761acb3c5d"),
        notes: "Remote journey prep and permit verification.",
      },
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "admin1234", 12);

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@arunachaltourism.local" },
    update: {
      name: "Admin Operator",
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email: process.env.ADMIN_EMAIL ?? "admin@arunachaltourism.local",
      name: "Admin Operator",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.bookingGroup.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.itineraryDay.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.auditLog.deleteMany();

  const createdTrips = [];

  for (const trip of trips) {
    const { itinerary, ...tripData } = trip;
    const createdTrip = await prisma.trip.create({
      data: {
        ...tripData,
        itineraryDays: {
          create: itinerary,
        },
      },
    });

    createdTrips.push(createdTrip);
  }

  const tawangTrip = createdTrips.find((trip) => trip.location === "Tawang");
  const ziroTrip = createdTrips.find((trip) => trip.location === "Ziro");

  if (!tawangTrip || !ziroTrip) {
    throw new Error("Expected seed trips were not created");
  }

  const group = await prisma.bookingGroup.create({
    data: {
      groupBookingCode: "GRP-H2601-1606-SATISH",
      tripId: tawangTrip.id,
      startDate: asDate("2026-06-16"),
      endDate: asDate("2026-06-21"),
      groupSize: 4,
      status: "OPEN",
      expiresAt: asDate("2026-06-01"),
    },
  });

  const groupBooking = await prisma.booking.create({
    data: {
      bookingCode: "H2601-Tawang-6-1606-2106-Satish",
      groupId: group.id,
      tripId: tawangTrip.id,
      firstName: "Satish",
      lastName: "Nath",
      email: "satish@example.com",
      phone: "+919876543210",
      address: "Beltola, Guwahati",
      pin: "781028",
      dob: asDate("1992-03-12"),
      gender: "Male",
      emergencyContact: "+919812345678",
      consentGiven: true,
      aadhaarFileName: "sample-aadhaar-satish.pdf",
      aadhaarFilePath: "storage/uploads/aadhaar/sample-aadhaar-satish.pdf",
      aadhaarMimeType: "application/pdf",
      aadhaarFileSize: 120000,
      bookingType: "GROUP",
      peopleCount: 4,
      startDate: asDate("2026-06-16"),
      endDate: asDate("2026-06-21"),
      bookingAmountCents: toCents(155996),
      bookingStatus: "CONFIRMED",
      paymentStatus: "PARTIAL",
      payments: {
        create: [
          {
            installmentNumber: 1,
            dueDate: asDate("2026-05-24"),
            paidAt: asDate("2026-05-24"),
            simulatedReference: "SIM-PAY-H2601-001",
            paidAmountCents: toCents(50000),
            dueAmountCents: toCents(50000),
            status: "PAID",
          },
          {
            installmentNumber: 2,
            dueDate: asDate("2026-06-05"),
            paidAmountCents: 0,
            dueAmountCents: toCents(105996),
            status: "PENDING",
          },
        ],
      },
    },
  });

  const soloBooking = await prisma.booking.create({
    data: {
      bookingCode: "H2602-Ziro-5-1007-1407-Ani",
      tripId: ziroTrip.id,
      firstName: "Ani",
      lastName: "Boruah",
      email: "ani@example.com",
      phone: "+919812340987",
      address: "Zoo Road, Guwahati",
      pin: "781024",
      dob: asDate("1998-11-04"),
      gender: "Female",
      emergencyContact: "+919876501234",
      consentGiven: true,
      aadhaarFileName: "sample-aadhaar-ani.png",
      aadhaarFilePath: "storage/uploads/aadhaar/sample-aadhaar-ani.png",
      aadhaarMimeType: "image/png",
      aadhaarFileSize: 98000,
      bookingType: "SOLO",
      peopleCount: 1,
      startDate: asDate("2026-07-10"),
      endDate: asDate("2026-07-14"),
      bookingAmountCents: toCents(29999),
      bookingStatus: "PENDING",
      paymentStatus: "PENDING",
      payments: {
        create: [
          {
            installmentNumber: 1,
            dueDate: asDate("2026-06-20"),
            paidAmountCents: 0,
            dueAmountCents: toCents(29999),
            status: "PENDING",
          },
        ],
      },
    },
  });

  await prisma.expense.createMany({
    data: [
      {
        tripId: tawangTrip.id,
        category: "STAY",
        amountCents: toCents(82000),
        vendor: "Tawang Heritage Retreat",
        reference: "STAY-TW-001",
        notes: "Advance stay allocation for June group.",
        expenseDate: asDate("2026-05-22"),
      },
      {
        tripId: tawangTrip.id,
        category: "VEHICLE",
        amountCents: toCents(54000),
        vendor: "Eastern Himalayan Drives",
        reference: "VH-TW-001",
        notes: "SUV convoy booking.",
        expenseDate: asDate("2026-05-23"),
      },
      {
        tripId: ziroTrip.id,
        category: "GUIDE",
        amountCents: toCents(18000),
        vendor: "Apatani Local Host Network",
        reference: "GD-ZR-001",
        notes: "Cultural guide retainer.",
        expenseDate: asDate("2026-05-24"),
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        actorId: admin.id,
        actorEmail: admin.email,
        action: "SEED_ADMIN_READY",
        entityType: "User",
        entityId: admin.id,
        metadata: { source: "seed" },
      },
      {
        actorEmail: "system",
        action: "BOOKING_CONFIRMED_SIMULATED_EMAIL",
        entityType: "Booking",
        entityId: groupBooking.id,
        metadata: { bookingCode: groupBooking.bookingCode, channel: "local-mock" },
      },
      {
        actorEmail: "system",
        action: "BOOKING_CREATED_PENDING_PAYMENT",
        entityType: "Booking",
        entityId: soloBooking.id,
        metadata: { bookingCode: soloBooking.bookingCode, channel: "local-mock" },
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });