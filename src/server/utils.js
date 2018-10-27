exports.random = () => Math.random()
  .toString(36)
  .substr(2);

exports.base64 = string => Buffer.from(string).toString('base64');

exports.unique = (array, callback) => {
  const seen = new Set();
  return array.filter((item) => {
    const key = callback(item);
    return seen.has(key) ? false : seen.add(key);
  });
};
