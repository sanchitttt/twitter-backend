const UserService = require('../services/user.service');
const UserServiceInstance = new UserService();

const getAccountDetails = async (req, res) => {
    try {
        let result = await UserServiceInstance.getDetails(req.user.email);
        if (!result.length) res.status(404).json({ "message": "No results found" });
        else res.status(200).json(result);
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

module.exports = { getAccountDetails, getSearchResults };