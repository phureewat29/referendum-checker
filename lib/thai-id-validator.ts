/**
 * Validate Thai National ID card number
 * Uses checksum algorithm to verify validity
 */
export function validateThaiId(id: string): boolean {
  // Must be exactly 13 digits
  if (id.length !== 13 || !/^\d+$/.test(id)) {
    return false;
  }

  // Calculate checksum
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(id.charAt(i)) * (13 - i);
  }

  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(id.charAt(12));
}
