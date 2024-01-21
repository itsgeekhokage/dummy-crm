import projectModel from "../models/projectSchema.js";
import headerModel from "../models/headerSchema.js";
import audioModel from "../models/audioSchema.js";
import mongoose from "mongoose";

const allProjects = async (req, res) => {
    try {
        const all = await projectModel.find();
        const modifiedAll = [];

        for (const item of all) {
            let getHeaders = await headerModel.findOne(item.headers);
            item.headers = getHeaders;

            let getAudioFiles = await Promise.all(item.audioFiles.map(async (audio) => await audioModel.findOne(audio)));
            item.audioFiles = getAudioFiles;

            modifiedAll.push(item);
        }

        res.json({ all: modifiedAll, response: 202 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mes: "Internal Server Error" });
    }
};

const getProject = async (req, res) => {
    const id = req.params.id;
    try {
        const project = await projectModel.findOne(id);
        res.status(200).json({message : "project fetched successfully..."});
    } catch (error) {
        console.log(error)
    }
}

const multipleProject = async(req, res) => {
    const {idArray}= req.body;
    try {
        const result = [];
        for(let proj of idArray){
            let project = await projectModel.findOne({_id : proj.project});

            if(project.status === "Active"){
                let getHeaders = await headerModel.findOne(project.headers);
                project.headers = getHeaders;

                let getAudioFiles = await Promise.all(project.audioFiles.map(async (audio) => await audioModel.findOne(audio)));
                project.audioFiles = getAudioFiles;
                result.push(project);
            }
        }
        res.json({result, message : "user projects retreived successfully...", response : 202});
    } catch (error) {
        console.log(error);
        res.json({mesage : "internal server problem", repsonse : 404});
    }
}

const newProject = async (req, res) => {
    const {projectName} = req.body;
    try {
        const existingProject = await projectModel.findOne({projectName});
        if(existingProject){
            res.status(202).json({response : 400, project : existingProject})
            console.log("hre")
        }
        else {
            const header = new headerModel({});
            const project = new projectModel({
                projectName,
                headers : header
            })
            await header.save();
            await project.save();
            res.status(202).json({response : 202, project});
        }
    } catch (error) {
        console.log(error)
    }
}

const replaceAudios = async (req, res) => {
    const { id, data } = req.body;
    try {
        // Step 1: Find the project by its ID
        const project = await projectModel.findById(id);

        if (!project) {
            return res.status(404).json({ response: "Project not found" });
        }

        // Step 2: Retrieve existing audio files' IDs from the project
        const existingAudioIds = project.audioFiles;

        // Step 3: Delete existing audio files
        await audioModel.deleteMany({ _id: { $in: existingAudioIds } });

        // Step 4: Create new audio models for the provided data
        const newAudioModels = data.map((audioData) => new audioModel({ ...audioData, project: project._id }));

        // Step 5: Push newly created audio models to the project's audioFiles array
        project.audioFiles = await audioModel.insertMany(newAudioModels);

        // Step 6: Save the project
        await project.save();

        res.json({ response : 202, message: "Audios replaced successfully", newAudioModels });
    } catch (error) {
        console.log(error);
        res.status(500).json({ response: "Internal Server Error" });
    }
};
const appendAudios = async (req, res) => {
    const { id, data } = req.body;

    try {
        const project = await projectModel.findById(id);

        let existingAudioIds = project.audioFiles;
        let existingAudioModels = [];

        for (const item of existingAudioIds) {
            const audioModelResult = await audioModel.findById(item);
            existingAudioModels.push(audioModelResult);
        }

        let count = 0;

        for(const newFile of data){
            let ind =  existingAudioModels.findIndex((item) => item.fileName === newFile.fileName);
            if(ind === -1){
                let newAudio = new audioModel({...newFile, project : project._id});
                newAudio.save();
                existingAudioModels.push(newAudio);
                existingAudioIds.push(newAudio._id);
                count++;
            }
        }
        await project.save();
        res.json({ files : existingAudioModels, count, response : 202 });
    } catch (error) {
        console.log(error)
        res.json({ error: error })
    }
};


const updateHeader = async (req, res) => {
    const {id, data} = req.body;
    try {
        await headerModel.findByIdAndUpdate(id, data);
        res.json({message : "headers successfully updated", response : 202});
    } catch (error) {
        console.log(error);
        res.json({message : "Interval Server Error", response : 404});
    }
}

const updateProject = async (req, res) => {
    const {data, id} = req.body;
    try {
        await projectModel.findByIdAndUpdate(id, data);
        res.json({response : 202});
    } catch (error) {
        console.log(error);
    }
}


export {newProject, replaceAudios, appendAudios, updateProject, allProjects, multipleProject, updateHeader};