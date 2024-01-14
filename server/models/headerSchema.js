import mongoose from "mongoose";

const headerSchema = new mongoose.Schema({
    uniqueId: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "uniqueId" },
    },
    fileName: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "fileName" },
    },
    audioFileLink : {
        status : {type : Boolean, default : false},
        nickName : { type : String, default : "link"}
    },
    name: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "name" },
    },
    age: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "age" },
    },
    gender: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "gender" },
    },
    casteCategory: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "casteCategory" },
    },
    category: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "category" },
    },
    locality: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "locality" },
    },
    ac: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "ac" },
    },
    pc: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "pc" },
    },
    district: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "district" },
    },
    occupation: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "occupation" },
    },
    income: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "income" },
    },
    education: {
        status: { type: Boolean, default: true },
        nickName: { type: String, default: "education" },
    },
    adhoc1: {
        status: { type: Boolean, default: false },
        nickName: { type: String, default: "adhoc1" },
    },
    adhoc2: {
        status: { type: Boolean, default: false },
        nickName: { type: String, default: "adhoc2" },
    },
    adhoc3: {
        status: { type: Boolean, default: false },
        nickName: { type: String, default: "adhoc3" },
    },
    adhoc4: {
        status: { type: Boolean, default: false },
        nickName: { type: String, default: "adhoc4" },
    },
    comments: {
        status: { type: Boolean, default: false },
        nickName: { type: String, default: "Comments" },
    }
})

const headerModel = new mongoose.model("Header", headerSchema);

export default headerModel;