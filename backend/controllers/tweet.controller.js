const UserService = require('../services/user.service');
const UserServiceInstance = new UserService();

const postNewThread = async (req, res) => {
    try {
        const result = await UserServiceInstance.newThread(req.user.email, req.body);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

const postNewTweet = async (req, res) => {
    try {
        const result = await UserServiceInstance.newTweet(req.user.email, req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).end();
    }
}

module.exports = { postNewThread, postNewTweet }