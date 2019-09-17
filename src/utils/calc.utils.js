const occurrence = (data) => {
  if (data.length == 0) { return null; }
  const modeMap = {};
  let maxEl = data[0], maxCount = 1;
  for (let i = 0; i < data.length; i++) {
    const el = data[i];
    if (modeMap[el] == null) { modeMap[el] = 1; } else { modeMap[el]++; }
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
};
export default occurrence;
