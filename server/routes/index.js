var express = require('express');
var router = express.Router();
let checkTokenMiddleware = require('../middlewares/checkTokenMiddleware');
let checkSessionMiddleware = require('../middlewares/checkSessionMiddleware');
const { UserModel } = require('../models/user');
const { ForumPostModel } = require('../models/forumPost');
const { FINDUSERINFOFAIL, SUCCESSCALLBACK, ADDCOMMENTFAIL, DELETEBYIDFAIL, FINDPOSTINFOFAIL, SEARCHBYNAMEFAIL, EDITBYBYIDFAIL, RECOVERBYBYIDFAIL, ADDTAGFAIL, ADDDEFAULTTAGFAIL } = require('../error/codeCollection');
const { getErrorReason, errorData } = require('../public/javascripts/errorReason');
/** 添加操作记录 */
const { OperationModel } = require('../models/operation');
const { CommentModel } = require('../models/comment');

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
    const { user_id, _id } = data[0];
    OperationModel.insertMany({ user_id: user_id, post_id: _id, operation: 'add' }).then();
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

/** 通过id查询指定话题(个人) */
router.get('/postinfo/findid', checkTokenMiddleware, function (req, res, next) {
  ForumPostModel.findOne({ _id: req.query?.search, isDelete: false, user_id: req.user._id }).then((data) => {
    console.log(data);
    res.json(SUCCESSCALLBACK(data))
  }).catch(() => {
    res.json(FINDPOSTINFOFAIL);
  })
});

/** 通过id查询指定话题（全部） */
router.get('/postinfo/findid/all', checkTokenMiddleware, function (req, res, next) {
  ForumPostModel.findOne({ _id: req.query?.search, isDelete: false }).then((data) => {
    res.json(SUCCESSCALLBACK(data))
  }).catch(() => {
    res.json(FINDPOSTINFOFAIL);
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
  const { post_id, post_caption, post_text, post_type } = req.body
  const user_id = req.user._id;
  ForumPostModel.updateOne({ _id: post_id, user_id: user_id }, { post_caption: post_caption, post_text: post_text, post_type: post_type }).then((data) => {
    OperationModel.insertMany({ user_id: user_id, post_id: post_id, operation: 'update' }).then();
    res.json(SUCCESSCALLBACK(data))
  }).catch(() => {
    res.json(EDITBYBYIDFAIL)
  })
});

/** 删除话题 */
router.get('/postinfo/delete', checkTokenMiddleware, function (req, res, next) {
  const post_id = req.query?.id;
  const user_id = req.user._id;
  ForumPostModel.updateOne({ _id: post_id, user_id: user_id }, { isDelete: true }).then((data) => {
    OperationModel.insertMany({ user_id: user_id, post_id: post_id, operation: 'delete' }).then();
    res.json(SUCCESSCALLBACK(data))
  }).catch(() => {
    res.json(DELETEBYIDFAIL)
  })
});

/** 恢复删除的话题 */
router.get('/postinfo/recover', checkTokenMiddleware, function (req, res, next) {
  const post_id = req.query?.id;
  const user_id = req.user._id;
  ForumPostModel.findOne({ _id: post_id, user_id: user_id }).then((data) => {
    if (data.isDelete === true) {
      ForumPostModel.updateOne({ _id: post_id, user_id: user_id, isDelete: true }, { isDelete: false }).then((data) => {
        OperationModel.insertMany({ user_id: user_id, post_id: post_id, operation: 'recover' }).then();
        res.json(SUCCESSCALLBACK(data))
      })
    } else {
      res.json(RECOVERBYBYIDFAIL);
    }
  }).catch(() => {
    res.json(RECOVERBYBYIDFAIL);
  })
});

/** 添加自定义标签 */
router.post('/user/add/tag', checkSessionMiddleware, checkTokenMiddleware, function (req, res, next) {
  if (!['影视', '彩妆', '美食', '穿搭', '影视', '职场', '情感', '家居', '游戏', '旅行', '健身'].includes(req.body.tag)) {
    UserModel.updateOne({ _id: req.user._id }, { $addToSet: { custom_type: req.body.tag } }).then(data => {
      res.json(SUCCESSCALLBACK({}));
    }).catch(() => {
      res.json(ADDTAGFAIL);
    })
  } else {
    res.json(ADDDEFAULTTAGFAIL);
  }
});

/** 获取自定义标签 */
router.get('/user/tag', checkTokenMiddleware, function (req, res, next) {
  UserModel.find({ _id: req.user._id }, { custom_type: 1 }).then(data => {
    res.json(SUCCESSCALLBACK(data[0]))
  })
});

/** 获取操作记录 */
router.get('/postinfo/operation', checkTokenMiddleware, function (req, res, next) {
  OperationModel.find({ user_id: req.user._id }).populate('post_id').then(data => {
    res.json(SUCCESSCALLBACK(data));
  })
});

/** 获取全部话题并按时间安排序 */
router.post('/postinfo/all', checkTokenMiddleware, async function (req, res, next) {
  try {
    const { current, pageSize, gauge, keywords } = req.body;

    const data = {
      total: 0,
      current: current,
      pageSize: pageSize,
      data: null,
    };

    let params = {};

    // 构建查询条件
    if (keywords !== '') {
      if (gauge === 'title') {
        params = {
          post_caption: {
            $regex: `.*${keywords}.*`
          }
        };
      } else if (gauge === 'type') {
        params = {
          post_type: {
            $all: keywords.split('#').filter(element => element !== '')
          }
        };
      } else {
        params = {
          user_id: { $in: await UserModel.find({ nickname: { $regex: `.*${keywords}.*` } }) }
        }
      }
    }

    // 组合计数和查询操作
    const [total, response] = await Promise.all([
      ForumPostModel.countDocuments(params).then(),
      ForumPostModel.find(params)
        .populate({
          path: 'user_id',
          select: {
            nickname: 1,
            create_at: 1,
          },
        })
        .sort({ create_at: -1 })
        .skip((current - 1) * pageSize)
        .limit(pageSize)
        .then()
    ]);
    data.data = response;
    data.total = total;

    res.json(SUCCESSCALLBACK(data));
  } catch (error) {
    // 处理错误
    res.json(FINDPOSTINFOFAIL);
  }
});

/** 新增评论 */
router.post('/comment/add', checkTokenMiddleware, function (req, res, next) {
  const user_id = req.user._id;
  const { post_id, parent_id, comment_text, mention_id } = req.body;
  const data = {
    user_id,
    post_id,
    parent_id,
    mention_id,
    comment_text,
  }
  if (parent_id) {
    console.log(parent_id);
    CommentModel.updateOne({ _id: parent_id }, { $addToSet: { children: data } }).then((data) => {
      res.json(SUCCESSCALLBACK(data))
    }).catch(() => {
      res.json(ADDCOMMENTFAIL);
    })
  } else {
    CommentModel.insertMany(data).then((data) => {
      res.json(SUCCESSCALLBACK(data[0]));
    }).catch(() => {
      res.json(ADDCOMMENTFAIL);
    })
  }
});

/**获取当前话题评论 */
router.get('/comment/all', checkTokenMiddleware, function (req, res, next) {
  const post_id = req.query?.id;
  CommentModel.find({ post_id }).populate({
    path: 'user_id',
    select: {
      nickname: 1,
      avatar: 1,
    },
  }).populate({
    path: 'children.user_id',
    select: {
      nickname: 1,
      avatar: 1,
    },
  }).populate({
    path: 'children.mention_id',
    select: {
      nickname: 1,
    },
  }).then((data) => {
    res.json(SUCCESSCALLBACK(data));
  }).catch((err) => {
    console.log(err);
  })
});

/** 修改头像 */
router.post('/user/update/avator', checkTokenMiddleware, function (req, res, next) {
    UserModel.updateOne({ _id: req.user._id }, { avatar: req.files.avator.data }).then(data => {
      res.json(SUCCESSCALLBACK({}));
    }).catch((err) => {
      // res.json(UPDATEAVATORFAIL);
      console.log(err);
    })
});





module.exports = router;
