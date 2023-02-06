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

const postToggleRetweet = async (req, res) => {
    try {
        const { email } = req.user;
        const { id, accountHandle } = req.body;
        const result = await UserServiceInstance.toggleRetweet(email, accountHandle, id);
        console.log(result);
        if (result === 'added') {
            res.status(200).json({ "message": "Successfully retweeted!" });
        }
        else {
            res.status(200).json({ "message": "Successfully removed retweet!" });
        }

    } catch (error) {
        console.log("Error", error);
        res.status(500).json(error);
    }
}

const postAddReply = async (req, res) => {
    try {
        const { email } = req.user; 
        const {accountHandle,payload,id} = req.body;

        console.log('reached',id)
   
        const result = await UserServiceInstance.addReply(accountHandle, id, payload);
        console.log('reached2')
        res.status(200).json(result);
        // res.end();
    } catch (error) {
        console.log("Error", error);
        res.status(500).json(error);
    }
}

module.exports = { toggleLike, postPollChoice, postToggleRetweet, postAddReply }