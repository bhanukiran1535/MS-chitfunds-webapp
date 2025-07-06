function generateMonths(startDate, tenure, groupId, userId) {
  const months = [];
  const start = new Date(startDate);
  const today = new Date();

  if (isNaN(start)) {
    throw new Error("Invalid start date passed to generateMonths");
  }

  for (let i = 0; i < tenure; i++) {
    const date = new Date(start.getFullYear(), start.getMonth() + i, 1); // 1st of each month
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`; // e.g., 2024-07

    let status;
    if (
      date.getFullYear() < today.getFullYear() ||
      (date.getFullYear() === today.getFullYear() && date.getMonth() < today.getMonth())
    ) {
      status = "due";
    } else if (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth()
    ) {
      status = "pending";
    } else {
      status = "upcoming";
    }

    months.push({
      groupId,
      userId,
      monthName: `${monthName} ${year}`,
      monthKey,
      status,
      paymentAmount: 0,
    });
  }

  return months;
}

module.exports = generateMonths;
