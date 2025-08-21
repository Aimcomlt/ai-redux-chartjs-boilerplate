export function lineDataset(
  data: number[],
  label: string,
  borderColor: string,
  backgroundColor?: string,
) {
  return {
    type: 'line' as const,
    label,
    data,
    borderColor,
    backgroundColor: backgroundColor ?? borderColor,
    tension: 0.1,
  };
}

export function barDataset(
  data: number[],
  label: string,
  backgroundColor: string | string[],
) {
  return {
    type: 'bar' as const,
    label,
    data,
    backgroundColor,
    borderColor: backgroundColor,
  };
}
