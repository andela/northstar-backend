import isBefore from 'validator/lib/isBefore';

/**
 * Function to check if an date is before a date
 * @param {string} value date to check
 * @param {string} date date to validate against
 * @param {string} message
 * @return {(error|bool)} returns error or true
 */
function isBeforeDate(value, date, message) {
  if (!isBefore(value, date)) {
    throw new Error(message);
  }

  return true;
}

export default isBeforeDate;
