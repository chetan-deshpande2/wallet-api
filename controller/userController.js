const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mail = require("../sendMail");
const { transferFunds } = require("../controller/transactionController");
const moment = require("moment");

exports.register = async (req, res) => {
  try {
    const { name, email, password, accNo } = req.body;
    // if (!name || !email || !passwordconst transactionMail = () => {

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User Already Exits" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      accNo,
    };
    const activateToken = createToken(newUser);
    console.log(activateToken);
    const url = `${process.env.CLIENT_URL}/user/activate/${activateToken}`;
    Mail.sendMail(email, url);
    res
      .status(200)
      .json({ msg: "Registeration Success !!Please activate email" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACC_ACTIVATE, {
    expiresIn: "20m",
  });
};

exports.activateEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const user = jwt.verify(token, process.env.JWT_ACC_ACTIVATE);

    console.log(user);
    const { name, email, password, accNo } = user;

    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({ msg: "User Already Exits" });
    }
    const newUser = new User({
      name,
      email,
      password,
      accNo,
    });
    await newUser.save();
    res.status(200).json({ msg: "Account activaed Sucessfully" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "email not found" });
    }
    const emilMatch = await bcrypt.compare(password, user.password);

    if (!emilMatch) {
      return res.status(404).json({ msg: "password is incorrect" });
    }

    const refreshToken = loginToken({ id: user._id });
    res.cookie("token ", refreshToken, {
      httpOnly: true,
      path: "/users/refreshToken",
      maxAge: 2 * 60 * 60 * 1000, // 2day
    });
    await transferFunds();
    res.json({ msg: "login success" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const loginToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACC_LOGIN, {
    expiresIn: "7days",
  });
};

exports.getUserInfo = async (req, res) => {
  try {
    const id = req.body.id;
    console.log(id);
    const user = await User.findOne({ _id: id }, "transaction");

    res.json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.getAllUsersInfo = async (req, res) => {
  try {
    console.log(req.user);
    const users = await User.find(req.user, "email transaction");
    res.json(users);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role, id } = req.body;
    await User.findOneAndUpdate({ _id: id }, { role });
    res.json({ msg: "role updated" });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};