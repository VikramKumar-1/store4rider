/**
 * Calculates the tax amount for a given base amount and tax rate.
 * @param amount - The base amount
 * @param rate - The tax rate percentage (e.g., 18 for 18%)
 * @returns The calculated tax amount
 */
export const calculateTax = (amount: number, rate: number): number => {
  return (amount * rate) / 100;
};
