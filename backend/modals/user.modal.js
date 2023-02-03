const mongoose = require('mongoose');
const validator = require('validator');

function validateEmail(value) {
    return validator.isEmail(value);
}
function arrayLimit(val) {
    return val.length <= 4;
}

const reelsSchema = new mongoose.Schema({
    videoSrc: { type: String, required: true },
    text: { type: String, default: '' },
    views: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
}, { timestamps: true })

const storiesSchema = new mongoose.Schema({
    type: { type: String, required: 'true', enum: ['text', 'image'] },
    imageSrc: { type: String, default: null },
    scaleLevel: { type: String, default: null },
    rotateLevel: { type: String, default: null },
    text: { type: String, default: null },
    fontFamily: { type: String, default: 'Poppins', enum: ['Poppins', 'Raleway', 'Caveat', 'Permanent Marker', 'Russo One'] },
    textColor: { type: String, default: null },
    backgroundColor: { type: String, default: null },
    backgroundImage: { type: String, default: null }
}, { timestamps: true })



const pollSchema = new mongoose.Schema({
    votes: { type: [], default: [] },
    expiresAt: { type: Date, default: null },
    options: {},
})

const tweetSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId },
    tweetText: { type: String, default: "" },
    poll: { type: pollSchema },
    scheduledDate: { type: Date, default: null },
    views: { type: Number, default: 0 },
    retweets: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    likedBy: { type: [], default: [] },
    retweetedBy: { type: [], default: [] },
    audience: { type: String, enum: ["Everyone", "Twitter circle"], default: "Everyone" },
    whoCanReply: { type: String, enum: ['Everyone', 'People you follow', 'Only people you mention'], default: "Everyone" },
    attachments: { type: Array, validate: (val) => arrayLimit(val) }
}, { timestamps: true, id: true, _id: true })

const followingAndFollowerSchema = new mongoose.Schema({
    typeOfVerification: { type: String, default: null },
    verified: { type: Boolean, default: false },
    profileSrc: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' },
    accountName: { type: String, maxLength: 50, required: true },
    accountHandle: { type: String, maxLength: 15, required: true },
})

const userSchema = new mongoose.Schema({
    profileSrc: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' },
    email: { type: String, validate: (val) => validateEmail(val), required: true, unique: true },
    accountName: { type: String, maxLength: 50, required: true },
    accountHandle: { type: String, maxLength: 15, required: true, unique: true },
    dob: { type: Date, default: '' },
    bio: { type: String, maxLength: 160, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    typeOfVerification: { type: String, default: null },
    tweets: { type: [tweetSchema | [tweetSchema]], default: [] },
    following: { type: [], default: [] },
    followers: { type: [followingAndFollowerSchema], default: [] },
    stories: { type: [storiesSchema], default: [] },
    reels: { type: [reelsSchema], default: [] },
    likedTweets: { type: [], default: [] },
    retweetedTweets: { type: [], default: [] },
    bookmarks : {type:[],default:[]}
}, { timestamps: true })



const User = mongoose.model('users', userSchema);

module.exports = User;