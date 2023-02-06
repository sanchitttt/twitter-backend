const UserService = require('../services/user.service');
const UserServiceInstance = new UserService();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const postLogin = async (req, res) => {
    try {
        const { username, email } = req.body;
        const result = await UserServiceInstance.exists({ email: email, username: username });
        if (result.exists) {
            const token = result.token;
            res.cookie('login', token, { maxAge: 1000 * 60 * 60, httpOnly: true });
            res.status(200).json({ "message": "User exists in the database" });
        }
        else {
            res.status(404).json({ "message": "User doesnt exists in database" });
        }

    } catch (error) {
        res.status(500).end();
    }
}

const postLogin2 = (req, res) => {
    try {
        const { token } = req.cookie;
        if (!token) {
            res.status(404).json({ "message": "Cookie doesn't exists" });
        }
        else {
            const result = jwt.verify(token, JWT_SECRET);
            if (result) {
                res.status(200).json({ "message": "Valid token" });
            }
        }
    } catch (error) {
        res.status(403).json(error);
    }
}

const patchFollow = async (req, res) => {
    try {
        const { followRequestReciever } = req.body;
        const { accountHandle, accountName, verified, typeOfVerification, profileSrc } = req.user;
        let alreadyFollows = await UserServiceInstance.alreadyFollows(req.user.email, followRequestReciever);
        // console.log(req.user.email, followRequestReciever.accountHandle, alreadyFollows)
        if (!alreadyFollows) {
            const result = await UserServiceInstance.follow({ accountHandle, accountName, verified, typeOfVerification, profileSrc }, followRequestReciever);
            res.status(200).json({ "message": "Successfully followed" });
        }
        else {
            const result = await UserServiceInstance.unfollow({ accountHandle, accountName, verified, typeOfVerification, profileSrc }, followRequestReciever);
            res.status(204).json({ "message": "Successfully unfollowed" });
        }
    }
    catch (err) {
        throw err;
    }
}

const getHome = async (req, res) => {
    res.end();
}

const getProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const result = await UserServiceInstance.getByEmail(email);
        res.status(200).json(result);
        res.end();
    } catch (error) {
        res.status(500).end();
    }
}


const patchEditProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const { accountBio, location, website, accountName, profileSrc, profileBanner } = req.body;
        const result = await UserServiceInstance.editProfile(
            email, accountName, accountBio, location, website, profileSrc, profileBanner);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const postNewReel = async (req, res) => {
    try {
        const { email } = req.user;
        const result = await UserServiceInstance.newReel(email, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const postNewImageStory = async (req, res) => {
    try {
        const { email } = req.user;
        const result = await UserServiceInstance.newImageStory(email, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getHomeTimeline = async (req, res) => {
    try {
        const { email } = req.user;
        const result = await UserServiceInstance.getTimeline(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const postBookmarks = async (req, res) => {
    try {
        const { email } = req.user;
        const { tweetBody } = req.body;
        const result = await UserServiceInstance.postBookmarks(email, tweetBody);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
}

const getBookmarks = async (req, res) => {
    try {
        const { email } = req.user;
        const result = await UserServiceInstance.getBookmarks(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error)
    }
}


const getBookmarkAlreadyExists = async (req, res) => {
    try {
        const { email } = req.user;
        const { id } = req.body;
        const result = await UserServiceInstance.bookmarkExists(email, id);
        if (result) res.status(200).json({ "message": "Exists" });
        else res.status(200).json({ "message": "Doesnt exist" });
    } catch (error) {
        res.status(500).json(error)
    }
}

const getTweetByItsId = async (req, res) => {
    try {
        const { email } = req.user;
        const { accountHandle, tweetId } = req.params;
        const result = await UserServiceInstance.getTweetById(email, accountHandle, tweetId);
        res.status(200).json(result);
    } catch (error) {
        console.log('error', error);
        res.status(500).json(error);
    }
}

const getAllReels = async (req, res) => {
    try {
        const result = await UserServiceInstance.getAllReels();
        // console.log(result)
        res.status(200).json(result);
    }
    catch (err) {
        console.log('error', err);
        res.status(500).json(err);
    }
}

const postAlreadyFollows = async (req, res) => {
    try {

        const { accountHandle } = req.body;
        const result = await UserServiceInstance.alreadyFollowing(req.user.email, accountHandle);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const postNewFollow = async (req, res) => {
    try {
        const { accountHandle } = req.body;
        const result = await UserServiceInstance.follow({ accountHandle: req.user.accountHandle }, { accountHandle: accountHandle });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getOwnStory = async (req, res) => {
    try {
        const { email } = req.user;
        const result = await UserServiceInstance.getStoryByEmail(email);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).end();
    }
}

const getOtherStories = async (req, res) => {
    try {
        const { email } = req.user;
        const result = await UserServiceInstance.getOtherStories(email);
        // console.log(result);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).end();
    }
}

const postNewTextStory = async (req, res) => {
    try {
        const { email } = req.user;
        const result = await UserServiceInstance.newTextStory(email, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getTweetsOfAttachment = async (req, res) => {
    try {
        const {accountHandle} = req.params;
        const result = await UserServiceInstance.getTweetsOfAttachment(accountHandle);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.log('error bc error')
        res.status(500).json(error);
    }
}

const getTweetsByLikes = async (req, res) => {
    try {
        const {accountHandle} = req.params;
        console.log('hi',accountHandle)
        const result = await UserServiceInstance.getLikedTweets(accountHandle);
        res.json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}
module.exports = {
    getHomeTimeline,
    postLogin,
    postLogin2,
    getHome,
    getProfile,
    patchFollow,
    patchEditProfile,
    postNewReel,
    postNewImageStory,
    getBookmarks,
    postBookmarks,
    getBookmarkAlreadyExists,
    getTweetByItsId,
    getAllReels,
    postAlreadyFollows,
    postNewFollow,
    getOtherStories,
    getOwnStory,
    postNewTextStory,
    getTweetsOfAttachment,
    getTweetsByLikes,

}