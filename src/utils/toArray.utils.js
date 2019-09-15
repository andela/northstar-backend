import validationHelpers from './helpers.utils';

/**
 * Function to change stringified array to array
 * @param {string} value
 *
 * @returns {Array} array of strings
 */
function toArray(value) {
  const getArrayValue = () => {
    if (typeof value === 'string') {
      return validationHelpers.trimArrayValues(value.replace(/[[\]"'{}]+/g, '').split(','));
    }

    return [];
  }
  

  return Array.isArray(value)
    ? value
    : getArrayValue()
}

export default toArray;
