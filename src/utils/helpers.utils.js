/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const validationHelpers = {
  checkForEmptyFields: (field, value) => {
    if (!value) return [`${field} is required`];
    return [];
  },

  fieldNotNeeded: (field, value) => {
    if (value) return [`${field} is not required`];
  },

  checkPatternedFields: (field, value, regex) => {
    if (!regex.test(value)) return [`${field} is invalid`];
    return [];
  },

  trimArrayValues: (arrayValues) => arrayValues.map((value) => value.trim()),

  trimValues: (values) => {
    for (const field in values) {
      const value = values[field];

      if (typeof value === 'string') {
        if (value.includes('[')) {
          values[field] = validationHelpers.trimArrayValues(value.replace(/[[\]"']+/g, '').split(','));
        } else if (field === 'destination') {
          values.destination = validationHelpers.trimArrayValues(values.destination.replace(/["']+/g, '').split(','));
        } else {
          values[field] = value.trim();
        }
      }

      if (Array.isArray(value)) {
        values[field] = validationHelpers.trimArrayValues(value);
      }
    }

    return values;
  },

};

export default validationHelpers;
