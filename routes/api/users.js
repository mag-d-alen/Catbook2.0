const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('./models/User');

//route POST to endpoint api/users
//description: register user
//access value: public
router.post(
  '/',

  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password needs to be at least 5 characters long').isLength({
    min: 5,
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    //check if user already exists
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      //create avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pd',
        d: 'mm',
      });

      //create user
      user = new User({ name, email, avatar, password });

      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //save new user
      await user.save();
      res.send(`${name} is now registered`);

      //create payload
      const payload = {
        user: {
          id: user.id,
        },
      };
      //sign json web token return the token
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
