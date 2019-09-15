import validationHelpers from './helpers.utils';

/**
 * Function to check if an array is an array of strings
 * @param {string} value
 * @param {string} message
 * @return {(error|bool)} returns error or true
 */
function isArrayOfValidStrings(value, message) {
  if (typeof value === 'string') {
    value = validationHelpers.trimArrayValues(value.replace(/[[\]"']+/g, '').split(','));
  }

  const hasValidStrings = value.every((item) =>
    item
    && typeof item === 'string'
    && !(/[\d]+/.test(item)) // item does not contain any numbers from 0 - 9
  );

  if (!Array.isArray(value) || !hasValidStrings) {
    throw new Error(message);
  }

  return true;
}

export default isArrayOfValidStrings;
