export function getWarrantyDate(dateString: string) {
  const givenDate = new Date(dateString)
  const currentDate = new Date()

  let years = currentDate.getFullYear() - givenDate.getFullYear()
  let months = currentDate.getMonth() - givenDate.getMonth()
  let days = currentDate.getDate() - givenDate.getDate()
  let hours = currentDate.getHours() - givenDate.getHours()

  // Adjust if month/day/hour is negative
  if (hours < 0) {
    hours += 24
    days--
  }

  if (days < 0) {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    )
    days += previousMonth.getDate()
    months--
  }

  if (months < 0) {
    months += 12
    years--
  }

  // Format with singular or plural forms
  const formatUnit = (value: number, singular: string, plural: string) => {
    return `${value} ${value === 1 ? singular : plural}`
  }

  const formattedYears = formatUnit(years, 'Year', 'Years')
  const formattedMonths = formatUnit(months, 'Month', 'Months')
  const formattedDays = formatUnit(days, 'Day', 'Days')
  const formattedHours = formatUnit(hours, 'Hour', 'Hours')

  return `${formattedYears}, ${formattedMonths}, ${formattedDays}, ${formattedHours}`
}
