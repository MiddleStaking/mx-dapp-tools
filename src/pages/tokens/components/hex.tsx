import BigNumber from 'bignumber.js';

export function toBigAmount(invalue: number, indec: number) {
  let fixed = '';
  let dec = '';
  let vir = false;
  const sNumber = invalue.toString();
  for (
    let i = 0, len = sNumber.length;
    i < len && (dec.length < indec || indec === 0);
    i += 1
  ) {
    if (!vir) {
      if (sNumber.charAt(i) === '.') {
        vir = true;
      } else {
        fixed = fixed + sNumber.charAt(i);
      }
    } else if (indec > dec.length) {
      dec = dec + sNumber.charAt(i);
    }
  }
  let output = fixed + dec;
  for (let i = 0; dec.length < indec; i += 1) {
    output = output + '0';
    dec = dec + '0';
  }
  return output;
}

export function toHex(str: string) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
}

export function toHexDec(d: number) {
  let result = '';
  result = Number(d).toString(16);
  if (Math.abs(result.length % 2) == 1) {
    result = '0' + result;
  }
  return result;
}

export function bigToHexDec(d: BigNumber) {
  let result = '';
  result = d.toString(16);
  if (Math.abs(result.length % 2) == 1) {
    result = '0' + result;
  }
  return result;
}
