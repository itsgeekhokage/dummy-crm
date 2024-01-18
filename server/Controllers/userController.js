import userModel from "../models/userSchema.js";

const getAllUsers = async (req, res) => {
    try {
        let allUsers = await userModel.find();
        allUsers = allUsers.filter(user => user.admin !== true);
        res.json({allUsers, response : 202})
    } catch (error) {
        console.log(error);
        res.json({message : "Internal Server Error", response : 404})
    }
}
const updateUser = async (req, res) => {
    const {id} = req.body;
    try {
        const updateDocument = await userModel.findByIdAndUpdate(id, req.body, {new : true, runValidators : true})
        if(!updateDocument){
            return res.json({response : 404, message : "document not found"});
        }
        else return res.json({response : 202, updateDocument})
    } catch (error) {
        console.log(error)
        res.json({message : "Internal Server Error"})
    }
}
const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const response = await userModel.findByIdAndDelete(id);
        if (response) {
            return res.json({ response: 202 });
        } else {
            return res.json({ response: 404 });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ response: 'Internal Server Error' });
    }
};
const getUserData = async(req, res) => {
    const id = req.params.id;
    try {
        const data = await userModel.findOne(id);
        if(data){
            res.status(202).json({data, response : 200});
        }
        else{
            res.status(200).json({ message : 'user Not Found', response : 200});
        }
    } catch (error) {
        console.log(error);
    }
}

export {updateUser, getAllUsers, deleteUser, getUserData}