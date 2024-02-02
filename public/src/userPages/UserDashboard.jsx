
import React, { useEffect, useState } from "react";
import Table from "../parts/Table.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { getProjectData, updateUserLink } from "../../api.js";
import LogoutIcon from "@mui/icons-material/Logout.js";
import MenuIcon from "@mui/icons-material/Menu";

const UserDashboard = () => {
  let [userData, setUserData] = useState([]);
  let [projects, setProjects] = useState([]);
  let [project, setProject] = useState({});
  let [loading, setLoading] = useState(true);
  let [projectsBox, setProjectsBox] = useState(true);
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

  const handleSelect = (ind) => {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].projectName == ind) {
        setProject(projects[i]);
      }
    }
  };

  return (
    <div className="userDashboard">
      {projectsBox ? (
        <div className="userDashboardFrontRow">
          <button
            onClick={() => setProjectsBox(false)}
            style={{
              cursor: "pointer",
              color: "white",
              background: "transparent",
              padding: ".3rem 1rem",
              margin: ".8rem",
              fontSize: "1rem",
            }}>
            Close
          </button>
          <div className="userDashboardProjectList">
            <div
              className="userDashboardSelector"
              style={{ color: "yellow" }}>
              Choose Project
            </div>
            {loading ? (
              <div className="userDashboardSelector">Loading</div>
            ) : (
              projects.map((file, index) => (
                <div
                  key={index}
                  className="userDashboardSelector"
                  onClick={() => handleSelect(file.projectName)}>
                  {file.projectName}
                </div>
              ))
            )}
          </div>
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
      ) : (
        <MenuIcon
          onClick={() => setProjectsBox(true)}
          style={{ cursor: "pointer", fontSize: "2.5rem", margin:".8rem" }}
        />
      )}
      <div className="userDashboardAudiosContainer">
        {Object.keys(project).length === 0 ? (
          <h3 style={{ display: "flex", justifyContent: "center" }}>
            Please choose any project to begin with...
          </h3>
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
