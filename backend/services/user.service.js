const Users = require('../modals/user.modal');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');


class UserService {
    async newImageStory(email, payload) {
        try {
            const obj = {
                imageSrc : payload.imgSrc,
                scaleLevel : payload.scaleValue,
                rotateLevel: payload.rotateValue
            }
            const result = await Users.updateOne({email:email} , {
                $push : {stories : obj}
            })
            return result;
        } catch (error) {
            throw error;
        }
    }
    async newReel(email, payload) {
        try {
            const result = await Users.updateOne({ email: email }, {
                $push: { reels: payload }
            })
            console.log(result);
            return result;
        } catch (error) {
            throw error;
        }
    }
    async editProfile(email, accountName, accountBio, location, website) {
        try {
            const user = await Users.findOne({ email: email });
            user.accountName = accountName;
            user.bio = accountBio;
            user.location = location;
            user.website = website;
            await Users.updateOne({ email: email }, user);
            return true;
        } catch (error) {
            throw error;
        }
    }
    async alreadyFollowing(followRequestSenderEmail, accountHandle) {
        try {
            const result = await Users.findOne({ email: followRequestSenderEmail })
            const following = result.following;
            for (let i = 0; i < following.length; i++) {
                if (following[i].accountHandle === accountHandle) return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    async unfollow(followRequestSender, followRequestReciever) {
        // console.log(followRequestSender, followRequestReciever)
        try {
            await Users.updateOne({ accountHandle: followRequestSender.accountHandle }, {
                $pull: { "following": { "accountHandle": followRequestReciever.accountHandle } }
            })
            await Users.updateOne({ accountHandle: followRequestReciever.accountHandle }, {
                $pull: { "followers": { "accountHandle": followRequestSender.accountHandle } }
            })
            return true;
        } catch (error) {
            throw error;
        }
    }
    async follow(followRequestSender, followRequestReciever) {

        try {
            await Users.updateOne({ accountHandle: followRequestSender.accountHandle }, {
                $push: { following: followRequestReciever }
            })
            await Users.updateOne({ accountHandle: followRequestReciever.accountHandle }, {
                $push: { followers: followRequestSender }
            })
            return true;
        } catch (error) {
            throw error;
        }
    }
    async alreadyFollows(followRequestSenderEmail, followRequestReciever) {
        try {
            const result = await Users.findOne({ email: followRequestSenderEmail })
            const following = result.following;
            for (let i = 0; i < following.length; i++) {
                if (following[i].accountHandle === followRequestReciever.accountHandle) return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
    async findByAccountHandle(accountHandle) {
        try {
            const results = await Users.findOne({ accountHandle: accountHandle });
            return results;
        } catch (error) {
            throw error;
        }
    }
    async searchByAccountHandle(text) {
        try {
            const results = await Users.find({ accountHandle: { $regex: text } });
            return results;
        } catch (error) {
            throw error;
        }
    }
    async getDetails(email) {
        try {
            const details = await Users.findOne({ email: email }, { likedTweets: 0, retweetedTweets: 0 });
            return details;
        } catch (error) {
            throw error;
        }
    }
    async toggleLike(email, tweetId) {
        try {
            const likedAlready = await Users.findOne({ "likedAlready._id": { $eq: tweetId } });
            if (likedAlready) {
                const result = Users.updateOne({ email: email }, { lik })
            }
        } catch (error) {
            throw error;
        }
    }
    async newThread(email, payload) {
        try {
            for (let i = 0; i < payload.length; i++) {
                const newId = new mongoose.Types.ObjectId();
                payload[i]._id = newId;
                payload[i].createdAt = new Date();
            }
            const result = await Users.updateOne({ email: email }, {
                $push: { tweets: payload }
            })
            return result;
        } catch (error) {
            throw err;
        }
    }
    async newTweet(email, payload) {
        try {
            const newId = new mongoose.Types.ObjectId();
            payload = { ...payload, _id: newId, createdAt: new Date() }
            const result = await Users.updateOne({ email: email }, {
                $push: { tweets: payload }
            })
            return result;
        } catch (error) {
            throw err;
        }
    }
    async getByEmail(email) {
        try {
            const user = await Users.findOne({ email: email });
            return user;
        }
        catch (err) {
            throw err;
        }
    }
    async existsByEmail(email) {
        try {
            const user = await Users.findOne({ email: email });
            return user;
        }
        catch (err) {
            throw err;
        }
    }
    async generateJWT(payload) {
        try {
            console.log(payload)
            const SECRET = process.env.JWT_SECRET;
            const options = { expiresIn: 60 * 60 * 1000 }
            const token = jwt.sign(payload, SECRET, options);
            return token;
        } catch (error) {
            throw error;
        }
    }
    async existsByUsername(username) {
        try {
            const user = await Users.findOne({ accountHandle: username });
            return user;
        }
        catch (err) {
            throw err;
        }
    }
    async exists({ email, username }) {
        try {
            const user = await Users.findOne({ $or: [{ accountHandle: username }, { email: email }] })
            if (user) {
                const token = this.generateJWT({ "id": user._id });
                return { exists: true, token: token };
            }
            else {
                return { exists: false };
            }
        } catch (error) {
            throw error;
        }
    }
    async create({ id, profileSrc, email, accountName, accountHandle }) {
        try {
            const newUser = new Users({
                id: id,
                profileSrc: profileSrc,
                email: email,
                accountName: accountName,
                accountHandle: accountHandle,
            })
            await newUser.save();
            return newUser;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;