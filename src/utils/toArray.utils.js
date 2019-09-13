import validationHelpers from './helpers.utils';

/**
 * Function to change stringified array to array
 * @param {string} value
 *
 * @returns {Array} array of strings
 */
function toArray(value) {
  if (typeof value === 'string') {
    value = validationHelpers.trimArrayValues(value.replace(/[[\]"']+/g, '').split(','));
  }

  return value;
}

export default toArray;
