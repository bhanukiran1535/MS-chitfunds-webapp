function generateMonths(startDate, tenure) {
  const months = [];
  const start = new Date(startDate); // Must be a valid Date

  if (isNaN(start)) {
    throw new Error("Invalid start date passed to generateMonths");
  }
  for (let i = 0; i < tenure; i++) {
    const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    months.push(`${monthName} ${year}`);
  }
  return months;
}

module.exports = generateMonths;