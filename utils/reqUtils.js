const filterObj = function (obj, ...properties) {
  const filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (properties.includes(el)) filteredObj[el] = obj[el];
  });
  return filteredObj;
};

module.exports = filterObj;
