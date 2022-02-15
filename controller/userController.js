const Users = require("../model/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
 const sendMail = require("../sendMail");

 exports.register = async (req, res) => {
   try {
     const { name, email, password, accountN0 } = req.body;
     // if (!name || !email || !password) {
     //   res.json({ msg: "Fill up all the fields" });
     // }

     const user = await Users.findOne({ email });
     if (user) {
       return res.status(400).json({ msg: "User Already Exits" });
     }

     const hashedPassword = await bcrypt.hash(password, 12);
     const newUser = {
       name,
       email,
       password: hashedPassword,
     };
     const activateToken = createToken(newUser);
     //  console.log(activateToken);
     const url = `${process.env.CLIENT_URL}/user/activate/${activateToken}`;
     sendMail(email, url);
     res
       .status(200)
       .json({ msg: "Registeration Success !!Please activate email" });
   } catch (error) {
     return res.status(500).json({ msg: "error" });
   }
 };

 const createToken = (payload) => {
   return jwt.sign(payload, process.env.JWT_ACC_ACTIVATE, {
     expiresIn: "1day",
   });
 };

 exports.activateEmail = async (req, res) => {
   try {
     const { token } = req.body;
     const user = jwt.verify(token, process.env.JWT_ACC_ACTIVATE);

     console.log(user);
     const { name, email, password } = user;

     const check = await Users.findOne({ email });
     if (user) {
       return res.status(400).json({ msg: "User Already Exits" });
     }
     const newUser = new User({
       name,
       email,
       password,
     });
     await newUser.save();
     res.status(200).json({ msg: "Account activaed Sucessfully" });
   } catch (error) {
     return res.status(500).json({ msg: "error" });
   }
 };

 //  const validateEmail = (email) => {};

 exports.login = async (req, res) => {
   try {
     const { email, password } = req.body;
     const user = await Users.findOne({ email });
     if (!user) {
       return res.status(400).json({ msg: "email not found" });
     }
     const emilMatch = await bcrypt.compare(password, user.password);

     if (!emilMatch) {
       return res.status(404).json({ msg: "password is incorrect" });
     }

     const refreshToken = createToken({ id: _user._id });
     res.cookie("token ", refreshToken, {
       httpOnly: true,
       maxAge: 24 * 60 * 60 * 1000, // 1day
     });
     res.json({ msg: "login success" });
   } catch (error) {
     return res.status(500).json({ msg: "error" });
   }
 };

 exports.getAccessToken = (req, res) => {
   try {
     const rf_token = req.cookies.refreshtoken;
     if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

     jwt.verify(rf_token, process.env.JWT_ACC_ACTIVATE, (err, user) => {
       if (err) return res.status(400).json({ msg: "Please login now!" });

       const access_token = createAccessToken({ id: user.id });
       res.json({ access_token });
     });
   } catch (err) {
     return res.status(500).json({ msg: err.message });
   }
 };
 
exports.logout = async () => {};
