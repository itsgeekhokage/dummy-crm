import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: {type : String, required : true},
    status: {type : String, default : "Active"},
    deadline: {type : Date, default : new Date('2030-01-01')},
    limit: {type : Number, default : 0},
    headers: {type : mongoose.Types.ObjectId, ref : "Header", required : true},
    audioFiles: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Audio",
            required: true
        }
    ]
});

const projectModel = mongoose.model("Project", projectSchema);

export default projectModel;

// assignedUsers: [
//     {
//         user : {type: mongoose.Types.ObjectId,
//         required: true,
//         ref: "User"},
//         extraCount : {type : Number, default : 0}
//     }
// ],