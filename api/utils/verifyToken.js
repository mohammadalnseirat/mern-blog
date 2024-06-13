const jwt = require("jsonwebtoken");
const { handleError } = require("./error");

const verifyToken = (req, res, next) => {
  // get cookie from browser:
  const token = req.cookies.jwt;
  // verify the token:
  if (!token) {
    return next(handleError(401, "UnAuthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return next(handleError(401, "UnAuthorized"));
    }
    req.user = user;
    next();
  });
};


module.exports = {verifyToken}
