const ratingCalculator = (data) => {
  const { facility_id } = data[0];
  const ratingTable = {
    facility_id,
    ratings: {
      '5-stars': 0,
      '4-stars': 0,
      '3-stars': 0,
      '2-stars': 0,
      '1-star': 0,
    }
  };

  for (let i = 0; i < data.length; i += 1) {
    ratingTable.ratings[`${data[i].rating}-stars`] += 1;
  }

  return ratingTable;
};

export default ratingCalculator;
