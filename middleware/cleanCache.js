const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  // this allows the route handler to perform its function, then continue this function
  await next();
  
  clearHash(req.user.id);
};
