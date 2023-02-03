const UserService = require('../services/user.service');
const UserServiceInstance = new UserService();

const getAccountDetails = async (req, res) => {
    try {
        let result = await UserServiceInstance.getDetails(req.user.email);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getSearchResults = async (req, res) => {
    try {
        const { text } = req.query;
        let result = await UserServiceInstance.searchByAccountHandle(text);
        if (!result.length) res.status(404).json({ "message": "No results found" });
        else res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getWhoToFollow = async (req, res) => {
    try {
        const result = await UserServiceInstance.generateWhoToFollow(req.user.email);
        res.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const getTrendingTweets = async (req, res) => {
    try {

    }
    catch (err) {
        res.status(500).json(err);
    }
}

module.exports = { getAccountDetails, getWhoToFollow, getSearchResults, getTrendingTweets };