/** @format */

import React, { useEffect, useState } from "react";
import AudioCard from "../parts/AudioCard.jsx";
import Table from "../parts/Table.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserData } from "../../api.js";
import { getProjectData, updateUserLink } from "../../api.js";

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
        console.log("projects", data);
        if (data.response == 202) setProjects(data.result);
      });
  };

  const ipHandler = (key) => {
    console.log(typeof key);
    if (userData.logins.length === 0) {
      userData.logins.push(key);
    } else {
      if (!userData.logins.includes(key)) {
        userData.logins.push(key);
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

    console.log("ips", location.state.logins);

    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => ipHandler(data.ip))
      .catch((error) => console.log(error));
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
      </div>
      <div className="userDashboardAudiosContainer">
        {Object.keys(project).length === 0 ? (
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
