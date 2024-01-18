/** @format */

import React, { useEffect, useState } from "react";
import AudioCard from "../parts/AudioCard.jsx";
import Table from "../parts/Table.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserData } from "../../api.js";
import { getProjectData, updateUserLink } from "../../api.js";
import  LogoutIcon  from "@mui/icons-material/Logout.js";

const UserDashboard = () => {
  let [userData, setUserData] = useState([]);
  let [audioFiles, setAudioFiles] = useState([]);
  let [selectedAudio, setSelectedAudio] = useState([]);
  let [projects, setProjects] = useState([]);
  let [project, setProject] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const fetchUserData = () => {
    fetch(`${getUserData}/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        console.log(data);
      });
  };

  const fetchProjectData = () => {
    const postData = {
      idArray: location.state.assignedProject,
    };
    fetch(getProjectData, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status : ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.response == 202) setProjects(data.result);
      });
  };

  const ipHandler = (key) => {
    console.log(typeof key, key);
    const timeStamp = new Date.now();
    function formatTimestamp(timestamp) {
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return timestamp.toLocaleDateString("en-GB", options);
    }
    const formattedTimestamp = formatTimestamp(timeStamp);
    console.log(formattedTimestamp);

    if (userData.logins.length === 0) {
      userData.logins.push({ ip: key, lastLogin: formattedTimestamp });
    } else {
      if (!userData.logins.includes(key)) {
        userData.logins.push({ip : key, lastLogin : formattedTimestamp});
      }
    }
    const postData = {
      id: userData._id,
      logins: userData.logins,
    };
    console.log(postData);
    fetch(updateUserLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };
  useEffect(() => {
    console.log("state", location.state);
    setUserData(location.state);
    fetchProjectData();
  }, []);

  const handleSelect = (e) => {
    let ind = e.target.value;
    console.log("ind", ind);
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].projectName == ind) {
        setProject(projects[i]);
      }
      console.log(projects[i].projectName);
    }
  };
  return (
    <div className="userDashboard">
      <div className="userDashboardFrontRow">
        {" "}
        <form className="userDashBoardFrontRowForm">
          <select
            id="dropdown"
            name="dropdown"
            className="userDashboardSelector"
            value={project.id}
            onChange={handleSelect}>
            <option value="0">Click to Choose Project</option>
            {projects.map((file) => (
              <option value={file.projectName}>{file.projectName}</option>
            ))}
          </select>
        </form>
        <LogoutIcon style={{position:"absolute", right: "3rem", top : ".8rem", color: "white", cursor: "pointer"}} onClick={() => navigate("/")} />
      </div>
      <div className="userDashboardAudiosContainer">
        {Object.keys(project).length === 0  ? (
          <h4>Please choose any project to begin with...</h4>
        ) : (
          <Table
            data={project}
            userData={userData}
            userName={userData.userName}
          />
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
