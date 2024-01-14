import mongoose, { MongooseError, mongo } from "mongoose";

const audioSchema = new mongoose.Schema({
    project: { type: mongoose.Types.ObjectId, ref: "Project", required: true },
    uniqueId: String,
    fileName: String,
    audioFileLink: String,
    name: String,
    age: Number,
    gender: String,
    casteCategory: String,
    caste: String,
    locality: String,
    ac: String,
    pc: String,
    district: String,
    occupation: String,
    income: String,
    education: String,
    adhoc1: { type: String, default: "" },
    adhoc2: { type: String, default: "" },
    adhoc3: { type: String, default: "" },
    adhoc4: { type: String, default: "" },
    comments: [
        {
            userName: String,
            comment: String
        }
    ],
    plays : [
        {
            userName : String,
            plays : {type : Number, default : 0}
        }
    ]
})

const audioModel = new mongoose.model("Audio", audioSchema);

export default audioModel;