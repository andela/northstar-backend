const getValuestoUpdate = (reqObject) => {
  const permittedValues = [
    'destination',
    'departure_date',
    'return_date',
    'origin',
    'reason',
    'category'
  ];

  const valuesToUpdate = {};

  permittedValues.forEach((val) => {
    if (reqObject[val]) valuesToUpdate[val] = reqObject[val];
  });

  return valuesToUpdate;
};

export default getValuestoUpdate;
