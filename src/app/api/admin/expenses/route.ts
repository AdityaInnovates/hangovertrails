import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

const expenseSchema = z.object({
  tripId: z.string().min(1),
  category: z.string().trim().min(2),
  amount: z.coerce.number().positive(),
  notes: z.string().trim().optional(),
});

export async function GET() {
  const { response } = await requireAdmin();

  if (response) return response;

  return ok(await prisma.expense.findMany({ include: { trip: true }, orderBy: { createdAt: "desc" } }));
}

export async function POST(request: Request) {
  const { admin, response } = await requireAdmin();

  if (response) return response;

  const body = expenseSchema.safeParse(await request.json().catch(() => null));

  if (!body.success) return fail("INVALID_EXPENSE", "Trip, category, and amount are required.");

  const expense = await prisma.expense.create({
    data: {
      tripId: body.data.tripId,
      category: body.data.category,
      amountCents: Math.round(body.data.amount * 100),
      expenseDate: new Date(),
      notes: body.data.notes,
    },
  });
  await prisma.auditLog.create({ data: { actorId: admin?.id, actorEmail: admin?.email, action: "EXPENSE_CREATED", entityType: "Expense", entityId: expense.id } });

  return ok(expense, { status: 201 });
}