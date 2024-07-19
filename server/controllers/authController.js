const User = require('../schemas/authentication/userSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

exports.create = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    user = new User({
      username,
      email,
      password,
    });

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };
    if (user) {
      res.json({ msg: 'User created successfully' });
    }

    // jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
    //   if (err) throw err;
    //   res.json({ token });
    // });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.viewAll = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
