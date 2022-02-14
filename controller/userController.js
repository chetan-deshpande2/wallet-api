const Users = require("../model/userModel");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    res.json({ msg: "resi" });
  } catch (error) {
    return res.status(500).json({ msg: "error" });
  }
};

exports.login = async () => {};
exports.logout = async () => {};
