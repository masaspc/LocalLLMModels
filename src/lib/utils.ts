export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatParamCount(count: number, activeParams?: number): string {
  if (activeParams) {
    return `${count}B (活性${activeParams}B)`;
  }
  return `${count}B`;
}

export function formatVram(gb: number): string {
  if (gb < 1) return `${Math.round(gb * 1024)}MB`;
  return `${gb}GB`;
}

export function renderStars(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}
