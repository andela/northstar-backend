import validationHelpers from './helpers.utils';

/**
 * Function to check if an array is an array of strings
 * @param {string} value
 * @param {string} message
 * @return {(error|bool)} returns error or true
 */
function isValidArray(value, message) {
  if (typeof value === 'string') {
    value = validationHelpers.trimArrayValues(value.replace(/[[\]"']+/g, '').split(','));
  }

  const isArrayOfValidStrings = value.every((item) => item && typeof item === 'string');

  if (!Array.isArray(value) || !isArrayOfValidStrings) {
    throw new Error(message);
  }

  return true;
}

export default isValidArray;
