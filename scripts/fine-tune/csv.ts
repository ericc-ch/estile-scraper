import type { Primitive } from "type-fest"

/**
 * Converts a two-dimensional array of primitive values into a CSV formatted string.
 * Optionally includes headers as the first row in the CSV output.
 *
 * @param data - A two-dimensional array containing the data to be converted into CSV format.
 *               Each inner array represents a row of data.
 * @param headers - An optional array of strings representing the column headers to be included
 *                  as the first row in the CSV output.
 * @returns A string representing the data in CSV format.
 */
export function arrayToCSV(
  data: Array<Array<NonNullable<Primitive>>>,
  headers?: Array<string>,
): string {
  if (data.length === 0) {
    return ""
  }

  let csv = ""

  // Include headers if provided
  if (headers && headers.length > 0) {
    csv += headers.map(escapeCSV).join(",") + "\n"
  }

  // Process each row
  csv += data.map((row) => row.map(escapeCSV).join(",")).join("\n")

  return csv
}

// Helper function to escape CSV values
function escapeCSV(value: NonNullable<Primitive>): string {
  if (typeof value === "string") {
    // Escape double quotes by replacing with double double-quotes
    value = value.replace(/"/g, '""')
    // Wrap value in double quotes if it contains a comma, double quote, or newline
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      value = `"${value}"`
    }
  }

  return value.toString()
}
