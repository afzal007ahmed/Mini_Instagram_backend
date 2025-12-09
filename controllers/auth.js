const bcrypt = require("bcrypt");
const { users } = require("../models/index");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");

const authController = {
  register: async (req, res) => {
    try {
      const { name, password, email, age, gender } = req.body;
      let message = null;
      if (name.length === 0 || password.length === 0 || email.length === 0) {
        message = "Enter valid credentials.";
      } else if (age < 18) {
        message = "Age must be above 18.";
      } else if (gender.length === 0) {
        message = "Please mention your gender";
      }
      if (message) {
        return res.status(400).send({
          success: false,
          error: message,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = v4();
      const response = await users.create({
        id: userId,
        name: name,
        password: hashedPassword,
        age: age,
        email: email,
        gender : gender 
      });

      res.send({
        success: true,
        error: null,
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        error: err.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      let message = "";
      const user = await users.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        message = "User doesn't exists.";
      } else if (!(await bcrypt.compare(password, user.password))) {
        message = "Please enter valid password.";
      }

      if (message) {
        return res.status(400).send({
          data: null,
          error: message,
        });
      }

      const temp = {
        email: user.email,
        id: user.id,
        name: user.name,
        age: user.age,
        gender : user.gender,
        url : user.url ,
        public_id : user.public_id
      };

      const token = jwt.sign(temp, process.env.JWT_SECRET, { expiresIn: "2h" });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.send({
        data: temp,
        error: null,
      });
    } catch (error) {
      res.status(500).send({
        data: null,
        error: error.message || "Something went wrong.",
      });
    }
  },
};

module.exports = { authController };
