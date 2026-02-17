import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
async function authMiddleware(req, res, next) {
  const authheader = req.headers.authorization;
  if (!authheader||!authheader.startsWith("Bearer")) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "authorization invalid ddd" });
  }
  const token = authheader.split(' ')[1];
  console.log(authheader);
  console.log(token);

  try {
    const {username,userid} = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { username, userid };
    next();
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: "authorization invalid" });
  }
}

export default authMiddleware;
