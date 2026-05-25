import { format, parseISO, isPast, isToday, isFuture, isValid, compareAsc } from 'date-fns'

/**
 * Centralized date utility functions
 */

// Format for display (e.g., "Oct 24, 2023")
export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '—'
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return 'Invalid Date'
    return format(date, 'MMM d, yyyy')
  } catch (e) {
    return '—'
  }
}

// Format for input field (e.g., "2023-10-24")
export const formatDateInput = (dateStr) => {
  if (!dateStr) return ''
  try {
    const date = parseISO(dateStr)
    if (!isValid(date)) return ''
    return format(date, 'yyyy-MM-dd')
  } catch (e) {
    return ''
  }
}

// Get current date in input format
export const getTodayInput = () => format(new Date(), 'yyyy-MM-dd')

// Check if a date is today
export const isDateToday = (dateStr) => {
  if (!dateStr) return false
  return isToday(parseISO(dateStr))
}

// Check if a date is in the past
export const isDatePast = (dateStr) => {
  if (!dateStr) return false
  const date = parseISO(dateStr)
  return isPast(date) && !isToday(date)
}

// Check if a date is in the future
export const isDateFuture = (dateStr) => {
  if (!dateStr) return false
  return isFuture(parseISO(dateStr))
}

// Validate that date2 is after or equal to date1
export const isDateAfter = (date1, date2) => {
  if (!date1 || !date2) return true
  return compareAsc(parseISO(date1), parseISO(date2)) <= 0
}
