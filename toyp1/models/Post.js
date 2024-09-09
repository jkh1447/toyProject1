const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    userId : {
        type : String,
        required : true,
    },
    title : {
        type : String,
        required : true,
    },
    content : {
        type : String,
    },
    date : {
        type : Date,
        default : Date.now,

    },
});

const Post = mongoose.model('Post', postSchema);
module.exports = {Post};