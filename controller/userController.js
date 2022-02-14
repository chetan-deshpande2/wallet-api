const Users = require("../model/userModel");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
 const sendMail = require("../sendMail");

 exports.register = async (req, res) => {
   try {
     const { name, email, password } = req.body;
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
   return jwt.sign(payload, process.env.JWT_ACC_ACTIVATE, { expiresIn: "5m" });
 };

 
//  const validateEmail = (email) => {};

exports.login = async () => {};
exports.logout = async () => {};
