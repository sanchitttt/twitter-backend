const UserService = require('../services/user.service');
const UserServiceInstance = new UserService();

const toggleLike =  async (req, res) => {
    try {
        const result = UserServiceInstance.toggleLike(req.user.email,req.body.id);
    } catch (error) {
        throw error;
    }
}

module.exports = { toggleLike }