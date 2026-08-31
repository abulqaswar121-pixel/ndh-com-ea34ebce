export type PriceRow = { region: string; currency: string; amount: number };

export function formatPrice(prices: PriceRow[]) {
  const ng = prices.find((p) => p.region === 'NG');
  if (ng) return `₦${ng.amount.toLocaleString()}`;
  const first = prices[0];
  return first ? `${first.currency} ${first.amount.toLocaleString()}` : 'Price on request';
}
