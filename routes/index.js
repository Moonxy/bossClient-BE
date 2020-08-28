const express = require('express')
const router = express.Router()
const {Boss, Chat} = require('../db/model')

router.post('/register', (req, res) => {
  const {username, type, password} = req.body

  Boss.findOne({username}, (err, boss) => {
    if(boss){
      res.send({code:1, msg: '用户已存在'})
    } else{
      new Boss({username, type, password}).save((err, user) => {
        res.cookie('userId', user._id, {maxAge: 1000*60*60*24*7})
        const data = {username, type, _id: user._id}
        res.send({code:0, data: data})
      })
    }
  })
})

router.post('/login', (req, res) => {
  Boss.findOne(req.body, (err, user) => {
    if(user){
      res.cookie('userId', user._id, {maxAge: 1000*60*60*24*7})
      res.send({code:0, data: user})
    }
    else
      res.send({code:1, msg:'用户名或密码不正确'})
  })
})

router.post('/update', (req, res) => {
  const user = req.body
  const _id = req.cookies.userId
  if(!_id){
    return res.send({code:1, msg: '请先登录'})
  }
  Boss.findByIdAndUpdate(_id, user, (err, oldUser) => {
    if(!oldUser){
      res.clearCookie('userId')
      res.send({code:1, msg: '请先登录'})
    }else{
      const {type, username, _id} = oldUser
      let data = Object.assign(user, {type, username, _id})
      res.send({code: 0, data})
    }
  })
})

router.get('/user', (req, res) => {
  const userId = req.cookies.userId
  if(!userId)
    return res.send({code:1, msg:'请先登录'})
  Boss.findOne({_id: userId}, (err, user) => {
    res.send({code:0, data:user})
  })
})

router.get('/userlist', (req, res) => {
  const {type} = req.query
  Boss.find({type}, (err, users) => {
    res.send({code:0, data:users})
  })
})

router.get('/msglist', (req, res) => {
  const userId = req.cookies.userId

  Boss.find((err, bossDoc) => {
    let users = {}
    users = bossDoc.reduce((pre, cur) => {
      return pre[cur._id] = {username: cur.username, header: cur.header}
    }, {})
  })

  Chat.find({'$or': [{from: userId, to: userId}]},(err, chatMsgs) => {
    res.send({code: 0, data: {users, chatMsgs}})
  })
})

router.post('/readmsg', (req, res) => {
  const from = req.body.from
  const to = req.cookies.userId
  Chat.update({from, to, read: false}, {read: true}, {multi: true}, (err, doc) => {
    res.send({code: 0, data: doc.nModified}) /*更新的数量*/
  })
})

module.exports = router