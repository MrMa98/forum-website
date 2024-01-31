const jwt = require('jsonwebtoken');
const { TOKENFAILURE, TOKENFAIL } = require('../error/codeCollection');
const { JWTPUBLICKEY } = require('../config/config');


module.exports = (req, res, next) => {
    let token = req.get('token');
    if (!token) {
        return res.json(TOKENFAILURE);
    }

    jwt.verify(token, JWTPUBLICKEY, (err, data) => {
        if (err) {
            res.json(TOKENFAIL);
        }
        req.user = data;
        next();
    })
};
