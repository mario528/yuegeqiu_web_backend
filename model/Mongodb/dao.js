const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const teamChat = new Schema({
    date: {
        type: Date,
        default: Date.now,
    },
    content: String,
    publish_id: String,
    team_id: String,
    publish_icon_url: String,
    publish_nick_name: String
})
const TeamChat = mongoose.model('TeamChat', teamChat)