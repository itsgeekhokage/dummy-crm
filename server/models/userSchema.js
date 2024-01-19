import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: String,
    password: String,
    status: { type: String, default: "Active" },
    admin: Boolean,
    assignedProject: [
        {
            project: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Project"
            },
            extraCount: { type: Number, default: 0 }
        }
    ],
    logins: [{ip : String, lastLogin : String}],
    audioPlayed: [String]
})

const userModel = new mongoose.model("User", userSchema);

export default userModel;