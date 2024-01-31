var express = require('express');
var router = express.Router();
let checkTokenMiddleware = require('../middlewares/checkTokenMiddleware');
let checkSessionMiddleware = require('../middlewares/checkSessionMiddleware');
const { UserModel } = require('../models/user');
const { ForumPostModel } = require('../models/forumPost');
const { FINDUSERINFOFAIL, SUCCESSCALLBACK, DELETEBYIDFAIL, SEARCHBYNAMEFAIL, SEARCHBYIDFAIL, EDITBYBYIDFAIL } = require('../error/codeCollection');
const { getErrorReason, errorData } = require('../public/javascripts/errorReason');

/** 获取用户信息 */
router.get('/userInfo', checkSessionMiddleware, checkTokenMiddleware, function (req, res, next) {
  UserModel.findOne({ _id: req.user._id }).then(user => {
    if (user) {
      res.json(SUCCESSCALLBACK(user));
    } else {
      res.json(FINDUSERINFOFAIL);
    }
  })
});

/** 添加话题 */
router.post('/postinfo/add', checkTokenMiddleware, function (req, res, next) {
  ForumPostModel.insertMany(req.body).then((data) => {
    res.json(SUCCESSCALLBACK(data))
  }).catch(err => {
    let firstError = Object.values(getErrorReason(err))[0]
    res.json(errorData(firstError))
  });
});

/** 通过标题查询话题（模糊查询） */
router.get('/postinfo/findname', checkTokenMiddleware, function (req, res, next) {
  ForumPostModel.find({ post_caption: { $regex: `.*${req.query?.search}.*` }, isDelete: false, user_id: req.user._id }).then((data) => {
    res.json(SUCCESSCALLBACK(data))
  }).catch((err) => {
    res.json(SEARCHBYNAMEFAIL)
  })
});

/** 通过id查询指定话题 */
router.get('/postinfo/findid', checkTokenMiddleware, function (req, res, next) {
  ForumPostModel.findOne({ _id: req.query?.search, isDelete: false, user_id: req.user._id }).then((data) => {
    res.json(SUCCESSCALLBACK(data))
  }).catch(() => {
    res.json(SEARCHBYIDFAIL)
  })
});

//备用
// ForumPostModel.updateOne({_id: data[0]._id},{ $push: { likedBy: '659ff051e7310701fd457c7d' } }).then((data)=>{
//   console.log(data);
// })
/** 根据喜欢的人数排序,返回最受欢迎的十条 */
router.get('/postinfo/findhot', checkTokenMiddleware, function (req, res, next) {
  ForumPostModel.find({}, { post_caption: 1 }).sort({ likedBy: -1 }).then((data) => {
    res.json(SUCCESSCALLBACK(data.slice(0, 10)))
  }).catch(() => {
    res.json()
  })
});

/** 修改话题 */
router.post('/postinfo/edit', checkTokenMiddleware, function (req, res, next) {
  ForumPostModel.updateOne({ _id: req.body.post_id, user_id: req.user._id }, { post_caption: req.body.post_caption, post_text: req.body.post_text }).then((data) => {
    res.json(SUCCESSCALLBACK(data))
  }).catch(() => {
    res.json(EDITBYBYIDFAIL)
  })
});

/** 删除话题 */
router.get('/postinfo/delete', checkTokenMiddleware, function (req, res, next) {
  ForumPostModel.updateOne({ _id: req.query?.id, user_id: req.user._id }, { isDelete: true }).then((data) => {
    res.json(SUCCESSCALLBACK(data))
  }).catch(() => {
    res.json(DELETEBYIDFAIL)
  })
});


module.exports = router;
