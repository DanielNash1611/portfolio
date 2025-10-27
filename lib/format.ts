const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1
});

export const formatCurrency = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat("en-US", {
    ...currencyFormatter.resolvedOptions(),
    ...options
  }).format(value);

export const formatPercent = (value: number, options?: Intl.NumberFormatOptions) =>
  new Intl.NumberFormat("en-US", {
    ...percentFormatter.resolvedOptions(),
    ...options
  }).format(value);
