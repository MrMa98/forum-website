const { SESSIONFAILURE, SESSIONFAIL } = require('../error/codeCollection');
const { UserModel } = require('../models/user');

module.exports = (req, res, next) => {
    if (req.session._id) {
        let _id = req.session._id;
        UserModel.findOne({ _id: _id }).then(user => {
            if (user) {
                req.user = user
                next();
            } else {
                res.json(SESSIONFAIL);
            }

        })
    }else {
        res.json(SESSIONFAILURE);
    }
};
