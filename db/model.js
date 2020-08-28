const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/bossDb', { useNewUrlParser: true })

const Schema = mongoose.Schema

const BossSchema = new Schema({
    username: {type: String, required: true}, //用户名
    password: {type: String, required: true}, //用户密码
    type: {type: String, required: true},  //用户类型
    header: {type: String},  //用户头像
    post: {type: String},  //用户投递职位
    info: {type: String},  //用户信息
    company: {type: String},  //用户公司
    salary: {type: String},  //用户薪资
})

const ChatSchema = mongoose.Schema({
    from: {type: String, required: true}, // 发送用户的id
    to: {type: String, required: true}, // 接收用户的id
    chat_id: {type: String, required: true}, // from和to组成的字符串
    content: {type: String, required: true}, // 内容
    read: {type:Boolean, default: false}, // 标识是否已读
    create_time: {type: Number} // 创建时间
})

exports.Boss = mongoose.model('Boss', BossSchema)
exports.Chat = mongoose.model('Chat', ChatSchema)
