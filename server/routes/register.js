const express = require('express');
const router = express.Router();
const { UserModel } = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWTPUBLICKEY } = require('../config/config');
const { SUCCESS, REGISTRATIONFAIL } = require('../error/codeCollection');
const { getErrorReason, errorData } = require('../public/javascripts/errorReason');

router.post('/register', function (req, res, next) {
  const data = {...req.body}
  UserModel.insertMany(data).then((user) => {
    if (user) {
      const token = jwt.sign({ _id: user._id }, JWTPUBLICKEY);
      res.json(SUCCESS(token, '注册成功'));
    } else {
      res.json(REGISTRATIONFAIL);
    }
  }).catch(err => {
    if (err) {
      let firstError = Object.values(getErrorReason(err))[0]
      res.json(errorData(firstError))
    }
  })
});

module.exports = router;

