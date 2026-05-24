export function createInstallmentSchedule(
  totalAmountCents: number,
  startDate: Date,
) {
  const depositAmount = Math.ceil(totalAmountCents * 0.3);
  const balanceAmount = totalAmountCents - depositAmount;
  const balanceDueDate = new Date(startDate);
  balanceDueDate.setDate(startDate.getDate() - 7);

  return [
    {
      installmentNumber: 1,
      dueDate: new Date(),
      paidAt: new Date(),
      simulatedReference: `SIM-${Date.now()}`,
      paidAmountCents: depositAmount,
      dueAmountCents: depositAmount,
      status: "PAID",
    },
    {
      installmentNumber: 2,
      dueDate: balanceDueDate,
      paidAmountCents: 0,
      dueAmountCents: balanceAmount,
      status: "PENDING",
    },
  ];
}
