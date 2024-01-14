import userModel from "../models/userSchema.js";

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
        if(user) res.json({user, response : 202});
        else res.json({response : 404});
    } catch (error) {
        res.json({message : "Internal Server Error", response : 404})
    }
}

export { registerNewUser, getUser }