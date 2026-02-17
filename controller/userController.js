// db conection
import dbConection from "../db/dbconfig.js";
// bcrypt for password hashing
import bcrypt from "bcrypt";
// http status codes
import statuscode from "http-status-codes";
// json web token for token generation
import jwt from "jsonwebtoken";

// user registration controller
export async function register(req, res) {
  const { username, firstname, lastname, email, PASSWORD } = req.body;
  if (!username || !firstname || !lastname || !email || !PASSWORD) {
    return res
      .status(statuscode.BAD_REQUEST)
      .json({ msg: "please provide all required information" });
  }

  try {
    const [user] = await dbConection.query(
      "SELECT username,userid,password FROM users WHERE username = ? OR email = ?",
      [username, email]
    );
    // check double registration
    if (user.length > 0) {
      return res
        .status(statuscode.BAD_REQUEST)
        .json({ mge: "the user already registered" });
    }
    // check password length
    if (PASSWORD.length < 8) {
      return res
        .status(statuscode.BAD_REQUEST)
        .json({ msg: "password must be at least 9 characters" });
    }
    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(PASSWORD, salt);

    await dbConection.query(
      "INSERT INTO users (username, firstname, lastname, email, PASSWORD) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res
      .status(statuscode.CREATED)
      .json({ msg: "user registered successfully" });
  } catch (error) {
    console.log(error.message);
    res
      .status(statuscode.INTERNAL_SERVER_ERROR)
      .json({ msg: "server error, try again" });
  }
}

export async function login(req, res) {
  const { email, PASSWORD } = req.body;
  if (!email || !PASSWORD) {
    return res
      .status(statuscode.BAD_REQUEST)
      .json({ msg: "please provide all required information" });
  }
  try {
    const [user] = await dbConection.query(
      "SELECT userid, username, PASSWORD FROM users WHERE email = ?",
      [email]
    );

    //there is no user
    if (user.length === 0) {
      return res
        .status(statuscode.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }
    //compare password
    const isMatch = await bcrypt.compare(PASSWORD, user[0].PASSWORD);
    if (!isMatch) {
      return res
        .status(statuscode.BAD_REQUEST)
        .json({ msg: "invalid credentials" });
    }

    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(statuscode.OK)
      .json({ msg: "user login successfully", token ,username});

    // return res .status(statuscode.OK).json({ msg: "login successful", user: user[0] });
  } catch (error) {
    console.log(error.message);
    res
      .status(statuscode.INTERNAL_SERVER_ERROR)
      .json({ msg: "server error, try again" });
  }
}

export async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  return res.status(statuscode.OK).json({msg:"valid user",username,userid});
  res.send("check user");
}

// export default dbConection;
export default { register, login, checkUser, dbConection };
