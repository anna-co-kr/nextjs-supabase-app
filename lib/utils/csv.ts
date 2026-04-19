const UTF8_BOM = "\uFEFF";

function escapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export interface CsvColumn<T> {
  header: string;
  value: (row: T) => string;
}

export function toCSV<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const body = rows.map((row) => columns.map((c) => escapeCell(c.value(row))).join(",")).join("\n");
  return `${header}\n${body}`;
}

export function withBOM(csv: string): string {
  return `${UTF8_BOM}${csv}`;
}
