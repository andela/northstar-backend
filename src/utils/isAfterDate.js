import isAfter from 'validator/lib/isAfter';

/**
 * Function to check if an date is after a date
 * @param {string} value date to check
 * @param {string} date date to validate against
 * @param {string} message
 * @return {(error|bool)} returns error or true
 */
function isAfterDate(value, date, message) {
  if (!isAfter(value, date)) {
    throw new Error(message);
  }

  return true;
}

export default isAfterDate;
