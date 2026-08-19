/**
 * Indian Rupee (₹) Currency and Number Formatter Utilities
 */

/**
 * Format a number as Indian Rupees (INR)
 * @param amount Number in INR
 * @param options Formatting options
 */
export function formatINR(
  amount: number,
  options: {
    compact?: boolean; // e.g. ₹4.2L or ₹2.85 Cr
    decimals?: number;
    showSymbol?: boolean;
  } = {}
): string {
  const { compact = false, decimals = 1, showSymbol = true } = options;
  const symbol = showSymbol ? '₹' : '';

  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${symbol}0`;
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  if (compact) {
    if (absAmount >= 10000000) {
      // Crores (1 Cr = 1,00,00,000)
      const inCr = (absAmount / 10000000).toFixed(decimals);
      return `${isNegative ? '-' : ''}${symbol}${inCr.replace(/\.0+$/, '')} Cr`;
    }
    if (absAmount >= 100000) {
      // Lakhs (1 Lakh = 1,00,000)
      const inLakhs = (absAmount / 100000).toFixed(decimals);
      return `${isNegative ? '-' : ''}${symbol}${inLakhs.replace(/\.0+$/, '')}L`;
    }
    if (absAmount >= 1000) {
      // Thousands (1k = 1,000)
      const inK = (absAmount / 1000).toFixed(decimals);
      return `${isNegative ? '-' : ''}${symbol}${inK.replace(/\.0+$/, '')}k`;
    }
    return `${isNegative ? '-' : ''}${symbol}${absAmount.toLocaleString('en-IN')}`;
  }

  // Standard Indian comma system formatting: e.g. 1,02,500
  const formatted = absAmount.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
  });

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

/**
 * Format raw thousands in thousands of INR (e.g. burn rate of 42k or 4.2L)
 */
export function formatK(
  thousands: number,
  showSymbol = true
): string {
  const symbol = showSymbol ? '₹' : '';
  if (thousands >= 100) {
    return `${symbol}${(thousands / 100).toFixed(1)}L`;
  }
  return `${symbol}${thousands}k`;
}
