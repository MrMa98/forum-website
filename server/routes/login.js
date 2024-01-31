const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWTPUBLICKEY } = require('../config/config');
const { SUCCESS, ACCOUNTPASSWORDMISMATCH } = require('../error/codeCollection');

router.post('/login', function (req, res, next) {
  UserModel.findOne({ username: req.body.username, password: req.body.password}).then(user => {
    if (user) {
      const token = jwt.sign({ _id: user._id }, JWTPUBLICKEY);
      req.session.username = user.username;
      req.session._id = user._id;
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
        }
      });
      res.json(SUCCESS(token, '登录成功', user)); // 返回登录成功信息或其他数据
    } else {
      res.json(ACCOUNTPASSWORDMISMATCH);
    }
  }).catch(err => {
    res.json({ error: 'Server error' });
  });
});

module.exports = router;
