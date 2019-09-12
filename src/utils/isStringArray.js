/**
 * Function to check if an array is an array of strings
 * @param {string} value
 * @param {string} message
 * @return {(error|bool)} returns error or true
 */
function isStringArray(value, message) {
  const isValidArray = Array.isArray(value) && value.length;


  if (typeof value === 'string') {
    // if (value.includes('[')) {
    value = trimArrayValues(value.replace(/[\[\]"']+/g, '').split(','));
    // } else {
    //   value = trimArrayValues(values.destination.replace(/["']+/g, '').split(','));
    // } else {
    //   values[field] = value.trim();
    // }
  }

  if (!isValidArray || !isArrayOfValidStrings) {
    throw new Error(message);
  }

  return true;
}

export default isStringArray;
