const hostLink = "https://crm-api-gold.vercel.app"

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
const getProjectData = `${hostLink}/project/multiple`;

// audio
const audioUpdateLink = `${hostLink}/audio/update`;

export {hostLink, registerNewUserLink, signinLink, updateUserLink, fetchAllUsers, deleteUser, registerNewProjectLink, replaceProjectFiles, appendProjectFiles, updateProject, allProjects, getUserData, getProjectData, audioUpdateLink, updateHeaderLink};
