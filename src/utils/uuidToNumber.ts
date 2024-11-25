import { BigNumber } from '@ethersproject/bignumber';

export const uuidToNumber = (uuid: string) => BigNumber.from('0x').toString();


// export const uuidToNumber = (uuid: string) => BigInt('0x' + uuid.replace(/-/g, '')).toString();

// export const numberToUUid = (bigInt: string) => {
//   return formatStringToUUID(BigInt(bigInt).toString(16))
// };


// function formatStringToUUID(inputString) {
//   // Add hyphens at specific positions to create a UUID-like format
//   const formattedString = inputString.slice(0, 8) + '-' +
//     inputString.slice(8, 12) + '-' +
//     inputString.slice(12, 16) + '-' +
//     inputString.slice(16, 20) + '-' +
//     inputString.slice(20);

//   return formattedString;
// }

