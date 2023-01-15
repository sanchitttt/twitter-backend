const mongoose = require('mongoose');
const validator = require('validator');

function validateEmail(value) {
    return validator.isEmail(value);
}
function arrayLimit(val) {
    return val.length <= 4;
}

const tweetSchema = new mongoose.Schema({
    tweetText: { type: String, default: "" },
    threadNumber : {type:Number,default:0},
    views: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    audience : {type:String, enum : ["Everyone", "Twitter circle"] , default: "Everyone"},
    whoCanReply: { type: String, enum: ['Everyone', 'People you follow', 'Only people you mention'] , default:"Everyone"},
    attachments: { type: Array, validate: (val) => arrayLimit(val) }
}, { timestamps: true })

const followingAndFollowerSchema = new mongoose.Schema({
    typeOfVerification: { type: String, default: null },
    verified: { type: Boolean, default: false },
    profileSrc: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' },
    accountName: { type: String, maxLength: 50, required: true },
    accountHandle: { type: String, maxLength: 15, required: true, unique: true },
})

const userSchema = new mongoose.Schema({
    profileSrc: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' },
    email: { type: String, validate: (val) => validateEmail(val), required: true, unique: true },
    accountName: { type: String, maxLength: 50, required: true },
    accountHandle: { type: String, maxLength: 15, required: true, unique: true },
    dob: { type: Date },
    bio : {type:String,maxLength:160,default: ''},
    location: { type: String, default: '' },
    website: { type: String },
    verified: { type: Boolean, default: false },
    typeOfVerification: { type: String, default: null },
    tweets: [tweetSchema],
    following: { type: [followingAndFollowerSchema], default: [] },
    followers: { type: [followingAndFollowerSchema], default: [] }
}, { timestamps: true })



const User = mongoose.model('users', userSchema);

module.exports = User;