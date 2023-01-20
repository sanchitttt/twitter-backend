const Users = require('../modals/user.modal');
const jwt = require('jsonwebtoken');

class UserService {
    async newThread(email, payload) {
        try {
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