const userSignupData = (reqObj) => (
  {
    first_name: reqObj.first_name,
    last_name: reqObj.last_name,
    email: reqObj.email,
    gender: reqObj.gender,
    birth_date: reqObj.birth_date,
    preferred_language: reqObj.preferred_language,
    preferred_currency: reqObj.preferred_currency,
    location: reqObj.location
  }
);

export default userSignupData;
