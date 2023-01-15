const UserService = require('../services/user.service');
const UserServiceInstance = new UserService();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const postLogin = async (req, res) => {
    console.log('reached');
    try {
        const { username, email } = req.body;
        const result = await UserServiceInstance.exists({ email: email, username: username });
        console.log(result);
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


const getHome = async (req, res) => {
    res.end();
}

const getProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const result = await UserServiceInstance.getByEmail(email);
        console.log(result);
        res.status(200).json(result);
        res.end();
    } catch (error) {
        res.status(500).end();
    }
}


module.exports = { postLogin, postLogin2 ,getHome,getProfile}