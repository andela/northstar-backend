/* eslint-disable no-useless-escape */
/* eslint-disable require-jsdoc */
function isValidArray(value, message) {
  if (typeof value === 'string') {
    value = value.replace(/[\[\]"' ]+/g, '').split(',');
  }

  const isArrayOfValidStrings = value.every((item) => item && typeof item === 'string');

  if (!Array.isArray(value) || !isArrayOfValidStrings) {
    throw new Error(message);
  }
  return true;
}

export default isValidArray;
