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
};
