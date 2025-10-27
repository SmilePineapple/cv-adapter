/**
 * CSV Export Utilities for Admin Dashboard
 */

export interface CSVColumn {
  key: string
  label: string
  format?: (value: any) => string
}

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, any>>(
  data: T[],
  columns: CSVColumn[]
): string {
  if (data.length === 0) return ''

  // Header row
  const headers = columns.map(col => escapeCSV(col.label)).join(',')
  
  // Data rows
  const rows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key]
      const formatted = col.format ? col.format(value) : value
      return escapeCSV(String(formatted ?? ''))
    }).join(',')
  })

  return [headers, ...rows].join('\n')
}

/**
 * Escape CSV value (handle commas, quotes, newlines)
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Format date for CSV
 */
export function formatDateForCSV(date: string | Date | null): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0] // YYYY-MM-DD
}

/**
 * Format datetime for CSV
 */
export function formatDateTimeForCSV(date: string | Date | null): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().replace('T', ' ').split('.')[0] // YYYY-MM-DD HH:MM:SS
}

/**
 * Export users to CSV
 */
export function exportUsersToCSV(users: any[]): void {
  const columns: CSVColumn[] = [
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Name' },
    { key: 'plan', label: 'Plan' },
    { key: 'status', label: 'Status' },
    { key: 'generation_count', label: 'Total Generations' },
    { key: 'lifetime_usage', label: 'Lifetime Usage' },
    { key: 'cv_count', label: 'CVs' },
    { key: 'cover_letter_count', label: 'Cover Letters' },
    { key: 'interview_prep_count', label: 'Interview Preps' },
    { key: 'created_at', label: 'Joined', format: formatDateForCSV },
    { key: 'last_activity', label: 'Last Active', format: formatDateTimeForCSV }
  ]

  const csv = arrayToCSV(users, columns)
  const filename = `users-export-${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

/**
 * Export analytics to CSV
 */
export function exportAnalyticsToCSV(analytics: any): void {
  const data = [
    { metric: 'Total Users', value: analytics.totalUsers },
    { metric: 'Pro Users', value: analytics.proUsers },
    { metric: 'Free Users', value: analytics.freeUsers },
    { metric: 'Total Generations', value: analytics.totalGenerations },
    { metric: 'Total CVs', value: analytics.totalCVs },
    { metric: 'Total Cover Letters', value: analytics.totalCoverLetters },
    { metric: 'Total Interview Preps', value: analytics.totalInterviewPreps || 0 },
    { metric: 'Total Revenue', value: `£${analytics.totalRevenue?.toFixed(2) || '0.00'}` },
    { metric: 'Conversion Rate', value: `${analytics.conversionRate}%` },
    { metric: 'New Users (7 days)', value: analytics.newUsersLast7Days },
    { metric: 'New Users (30 days)', value: analytics.newUsersLast30Days },
    { metric: 'Active Users', value: analytics.activeUsers }
  ]

  const columns: CSVColumn[] = [
    { key: 'metric', label: 'Metric' },
    { key: 'value', label: 'Value' }
  ]

  const csv = arrayToCSV(data, columns)
  const filename = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

/**
 * Export revenue report to CSV
 */
export function exportRevenueReportToCSV(users: any[]): void {
  const proUsers = users.filter(u => u.plan === 'pro')
  
  const columns: CSVColumn[] = [
    { key: 'email', label: 'Email' },
    { key: 'full_name', label: 'Name' },
    { key: 'created_at', label: 'Joined', format: formatDateForCSV },
    { key: 'plan', label: 'Plan' },
    { key: 'status', label: 'Status' },
    { key: 'generation_count', label: 'Generations Used' }
  ]

  const csv = arrayToCSV(proUsers, columns)
  const filename = `revenue-report-${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}
