const invalidDateError = 'Invalid date. Please ensure the date in the format YYYY-MM-DD';

export default {
  checkForEmptyFields: (field, value) => {
    if (!value) return [`${field} is required`];
    return [];
  },

  checkRange: (field, value, rangeX, rangeY) => {
    if (value >= rangeX && value <= rangeY) {
      return [];
    }
    return [`${field} must be between ${rangeX} and ${rangeY}`];
  },

  fieldNotNeeded: (field, value) => {
    if (value) return [`${field} is not required`];
  },

  checkPatternedFields: (field, value, regex) => {
    if (!regex.test(value)) return [`${field} is invalid`];
    return [];
  },

  trimValues: (values) => {
    const trimArrayValues = (arrayValues) => arrayValues.map((value) => value.trim());

    for (const field in values) {
      const value = values[field];

      if (typeof value === 'string') {
        if (value.includes('[')) {
          values[field] = trimArrayValues(value.replace(/[\[\]"']+/g, '').split(','));
        } else if (field === 'destination') {
          values.destination = trimArrayValues(values.destination.replace(/["']+/g, '').split(','));
        } else {
          values[field] = value.trim();
        }
      }

      if (Array.isArray(value)) {
        values[field] = trimArrayValues(value);
      }
    }

    return values;
  },

  /**
  * Validates the format
  * @param {object} fields
  * @param {object} errors
  * @param {string} errorMessage
  * @returns {undefined}
  */
  validateDatesFieldFormat(fields, errors, errorMessage = invalidDateError) {
    // eslint-disable-next-line no-useless-escape
    const dateRegex = /^[1-9]\d{3}\-(?:0[1-9]|1[0-2])\-(?:0[1-9]|[12][0-9]|3[01])$/;
    Object.entries(fields).forEach(([key, value]) => {
      if (!dateRegex.test(value)) errors[key] = errorMessage;
    });
  }
};
