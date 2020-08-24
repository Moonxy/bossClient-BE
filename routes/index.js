const express = require('express')
const router = express.Router()
const Boss = require('./boss')

router.get('/', (req, res) => {
  res.send('aaa')
})

router.post('/register', (req, res) => {
  const {username, type, password} = req.body

  Boss.findOne({username}, (err, boss) => {
    if(boss){
      res.send({code:1, msg: '用户已存在'})
    } else{
      new Boss({username, type, password}).save((err, user) => {
        res.cookie('userId', user._id, {maxAge: 1000*60*60*24})
        const data = {username, type, _id: user._id}
        res.send({code:0, data: data})
      })
    }
  })
})

router.post('/login', (req, res) => {
  Boss.findOne(req.body, (err, user) => {
    if(user){
      res.cookie('userId', user._id, {maxAge: 1000*60*60*24})
      res.send({code:0, data: user})
    }
    else
      res.send({code:1, msg:'用户名或密码不正确'})
  })
})

router.post('/update', (req, res) => {
  const user = req.body
  const _id = req.cookies.userId
  console.log(_id)
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

module.exports = router