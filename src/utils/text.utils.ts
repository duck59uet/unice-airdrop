export const randomCaptchaNumber = (len: number) => {
  const str = '0123456789';
  let results = '';
  for (let i = 0; i < len; i++) {
    const num = Math.floor(Math.random() * str.length);
    results += str.substring(num, num + 1);
  }
  return results;
};

export const standardizeAddress = (address: any): string => {
  // Convert the address to lowercase
  const lowercaseAddress = address.toLowerCase();
  // Remove the "0x" prefix if present
  const addressWithoutPrefix = lowercaseAddress.startsWith('0x')
    ? lowercaseAddress.slice(2)
    : lowercaseAddress;
  // Pad the address with leading zeros if necessary
  // to ensure it has exactly 64 characters (excluding the "0x" prefix)
  // const addressWithPadding = addressWithoutPrefix.padStart(64, '0');
  let addressWithPadding: string;
  if(addressWithoutPrefix.startsWith('0')) {
    addressWithPadding = addressWithoutPrefix.substring(1);
  } else {
    addressWithPadding = addressWithoutPrefix.padStart(64, '0');
  }
  // Return the standardized address with the "0x" prefix
  return `0x${addressWithPadding}`;
};
