import audioModel from "../models/audioSchema.js";

const updateAudio = async (req, res) => {
    const {id, data} = req.body;
    try {
        await audioModel.findByIdAndUpdate(id, data);
        res.json({message : "audio successfully uploaded", response : 202});
    } catch (error) {
        console.log(error)
        res.json({message : "Internal Server Error", data});
    }
}

export {updateAudio};