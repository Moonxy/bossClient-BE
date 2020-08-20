const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/bossDb', { useNewUrlParser: true })

const Schema = mongoose.Schema

const BossSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    header: {type: String},
    post: {type: String},
    info: {type: String},
    company: {type: String},
    salary: {type: String},
})

module.exports = mongoose.model('Boss', BossSchema)