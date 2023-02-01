const UserService = require("../services/user.service");
const UserServiceInstance = new UserService();

const getProfileByAccountHandle = async (req, res) => {
    try {
        const { accountHandle } = req.params;
        const result = await UserServiceInstance.findByAccountHandle(accountHandle);
        const alreadyFollowing = await UserServiceInstance.alreadyFollowing(req.user.email, accountHandle);
        const resultJSON = {...result._doc,alreadyFollowing:alreadyFollowing};
        console.log(resultJSON)
        if (!result) res.status(404).json({ "message": "User doesnt exist!" })
        else res.status(200).json(resultJSON);
    }
    catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getProfileByAccountHandle }