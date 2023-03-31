const jwt = require("jsonwebtoken");

function chechAuth(req, res, next) {
  //! this func decides is token true and go to the app/get
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, ""); //! try to get token from user request (header)

  if (token) {
    try {
      const decodedToken = jwt.verify(token, "secretKey123"); //! try to decode token

      req.userID = decodedToken._id; //! add user id from decoded token to use in in req body anywhere

      next();
    } catch (error) {
      return res.status(403).json({
        message: "No access",
      });
    }
  } else {
    return res.status(403).json({
      message: "No access",
    });
  }

  // next();
}

module.exports = chechAuth;
