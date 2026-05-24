export const LOCATIONS = ["Tawang", "Ziro", "Mechuka", "Anini"] as const;
export const GENDERS = ["Female", "Male", "NonBinary", "PreferNotToSay"] as const;
export const BOOKING_TYPES = ["SOLO", "GROUP"] as const;
export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
export const PAYMENT_STATUSES = ["PENDING", "PARTIAL", "PAID", "OVERDUE", "REFUNDED"] as const;
export const EXPENSE_TYPES = ["STAY", "FOOD", "VEHICLE", "TREKKING", "GUIDE", "BONFIRE", "BBQ", "MISCELLANEOUS"] as const;
export const REFUND_STATUSES = ["NOT_APPLICABLE", "PENDING", "PARTIAL", "REFUNDED", "REJECTED"] as const;
export const USER_ROLES = ["ADMIN"] as const;

export type Location = (typeof LOCATIONS)[number];
export type Gender = (typeof GENDERS)[number];
export type BookingType = (typeof BOOKING_TYPES)[number];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type ExpenseType = (typeof EXPENSE_TYPES)[number];
export type RefundStatus = (typeof REFUND_STATUSES)[number];
export type UserRole = (typeof USER_ROLES)[number];