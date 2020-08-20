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
      new Boss({username, type, password}).save((err, bossDoc) => {
        const data = {username, type}
        res.send({code:0, data: data})
      })
    }
  })
})

router.post('/login', (req, res) => {
  Boss.findOne(req.body, (err, tarBoss) => {
    if(tarBoss)
      res.send({code:0, data: tarBoss})
    else
      res.send({code:1, msg:'用户名或密码不正确'})
  })
})

module.exports = router