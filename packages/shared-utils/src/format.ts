/**
 * Formats a number to an Indian Rupee currency string.
 * @param amount - The amount to format
 * @returns The formatted price string
 */
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Truncates a string to a maximum length and adds an ellipsis if necessary.
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the string
 * @returns The truncated string
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};
