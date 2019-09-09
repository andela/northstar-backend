export default {
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
  }
};
