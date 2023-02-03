const UserService = require('../services/user.service');
const UserServiceInstance = new UserService();

const postPollChoice = async (req, res) => {
    try {
        const { email } = req.user;
        const { accountHandle, id, pollChoice } = req.body;
        const result = UserServiceInstance.makePollChoice(email, pollChoice, accountHandle, id);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
}

const toggleLike = async (req, res) => {
    try {
        const { email } = req.user;
        const { tweetId, tweetsWriter } = req.body;
        const alreadyLiked = await UserServiceInstance.alreadyLiked(email, tweetsWriter, tweetId);
        console.log(alreadyLiked)
        if (alreadyLiked) {
            const afterUnliking = await UserServiceInstance.removeLike(email, tweetsWriter, tweetId);
            res.status(200).json({ "message": "Successfully unliked!" });
        }
        else {
            const afterLiking = await UserServiceInstance.addLike(email, tweetsWriter, tweetId);
            res.status(200).json({ "message": "Successfully liked!" });

        }
    } catch (error) {
        throw error;
    }
}

module.exports = { toggleLike, postPollChoice }