// const hostLink = "https://dummy-crm.vercel.app"
// const hostLink = "https://api.audioconnect.com";
const hostLink = import.meta.env.VITE_HOST_API;
// const hostLink = "https://client-crm-eta.vercel.app/"

const registerNewUserLink = `${hostLink}/auth/newUser`;
const signinLink = `${hostLink}/auth/signin`;
const updateUserLink = `${hostLink}/auth/updateUser`;
const fetchAllUsers = `${hostLink}/auth/allUsers`;
const deleteUser = `${hostLink}/auth/deleteUser`;

// project links
const registerNewProjectLink = `${hostLink}/project/new`;
const replaceProjectFiles = `${hostLink}/project/files/replace`;
const appendProjectFiles = `${hostLink}/project/files/append`;
const updateProject = `${hostLink}/project/update`;
const allProjects = `${hostLink}/project/all`;
const updateHeaderLink = `${hostLink}/project/headers/update`;

// userDashBoard
const getUserData = `${hostLink}/user/data/:id`;
export const projectList = `${hostLink}/project/list`; // TODO:
const getProjectData = `${hostLink}/project/multiple`;

// audio
const audioUpdateLink = `${hostLink}/audio/update`;

export { hostLink, registerNewUserLink, signinLink, updateUserLink, fetchAllUsers, deleteUser, registerNewProjectLink, replaceProjectFiles, appendProjectFiles, updateProject, allProjects, getUserData, getProjectData, audioUpdateLink, updateHeaderLink };
