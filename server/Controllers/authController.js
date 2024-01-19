import userModel from "../models/userSchema.js";
import jwt from "jsonwebtoken"

const registerNewUser = async (req, res) => {
    const { userName, password } = req.body;
    const existingUser = await userModel.findOne({ userName });
    const user = new userModel({
        userName,
        password,
    });
    if (existingUser) {
        res.json({ response: 404, user: existingUser });
    } else {
        await user.save();
        res.json({ response: 202, user });
    }
};

const getUser = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await userModel.findOne({ userName });
        const ip = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        let ind = user.logins.findIndex(item => item.ip === ip);
        if(ind === -1){
            user.logins.push({ip, lastLogin : Date.now()});
        }
        else {
            user.logins[ind].lastLogin = Date.now();
        }
        await user.save();
        if (user && password === user.password) {
            user.password = "";
            const token = jwt.sign({ user: { ...user } }, '@crm#abb', { expiresIn: '1h' });
            res.json({token, response: 202 });
        } else {
            res.json({ response: 404 });
        }
    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error", response: 500 });
    }
};

export { registerNewUser, getUser }