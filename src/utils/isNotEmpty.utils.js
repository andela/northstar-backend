/**
 * Function to check if value is empty
 * @param {string} value
 * @param {string} message
 * @return {(error|bool)} returns error or true
 */
function isNotEmpty(value, message) {
    if (value === '') {
      throw new Error(message);
    }
  
    return true;
  }
  
  export default isNotEmpty;
  