const jwt = require('jsonwebtoken');
const User = require('../../database/models/user');

module.exports.verifyUser = async (req) => {
  try {
    req.email = null;
    req.loggedInUserId = null;
    req.role = null;
    const bearerHeader = req.headers.authorization;
    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1];
      const payload=jwt.verify(token,process.env.JWT_SECRET_KEY||'10Naaaite10')
      req.email = payload.email;
      const user = await User.findOne({ email: payload.email });
      req.role = user.role;
      req.loggedInUserId = user._id;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}



