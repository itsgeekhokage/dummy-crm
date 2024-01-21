/** @format */

import React, { useEffect, useState } from "react";
import Table from "../parts/Table.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { getProjectData, updateUserLink } from "../../api.js";
import LogoutIcon from "@mui/icons-material/Logout.js";

const UserDashboard = () => {
  let [userData, setUserData] = useState([]);
  let [projects, setProjects] = useState([]);
  let [project, setProject] = useState({});
  let [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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
        if (data.response == 202) {
          setProjects(data.result);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    if (location.state) {
      setUserData(location.state);
      fetchProjectData();
    } else navigate("/");
  }, [location.state]);

  const handleSelect = (e) => {
    let ind = e.target.value;
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].projectName == ind) {
        setProject(projects[i]);
      }
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
            <option value="0">
              {loading ? "Loading" : "Click to Choose Project"}
            </option>
            {projects.map((file, index) => (
              <option key={index} value={file.projectName}>{file.projectName}</option>
            ))}
          </select>
        </form>
        <LogoutIcon
          style={{
            position: "absolute",
            right: "3rem",
            top: ".8rem",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        />
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
