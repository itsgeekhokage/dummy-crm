/** @format */

import React, { useEffect, useState } from "react";
import Table from "../parts/Table.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { getProjectData, updateUserLink } from "../../api.js";
import LogoutIcon from "@mui/icons-material/Logout.js";
import MenuIcon from "@mui/icons-material/Menu";
import { useQuery } from "@tanstack/react-query";

const UserDashboard = () => {
  let [project, setProject] = useState({});
  let [userData, setUserData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { data, isLoading } =
    useQuery({
      queryKey: ["userProjects"],
      queryFn: () => fetchProjectData(),
    }) || {};
  console.log(data);
  const fetchProjectData = () => {
    console.log(location.state.assignedProject);
    return new Promise((resolve, reject) => {
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
          if (data.response == 200) {
            // setProjects(data.result);
            // setLoading(false);
            resolve(data.result);
          }
        });
    });
  };

  // Project List
  useEffect(() => {
    if (location.state) {
      setUserData(location.state);
      // fetchProjectData();
    } else navigate("/");
  }, [location.state]);

  const handleSelect = (proj) => {
    setProject(proj);
  };

  return (
    <div className="userDashboard">
      <div className="userDashboardFrontRow">
        <div className="userDashboardProjectList">
          <div
            className="userDashboardSelector"
            style={{ color: "yellow" }}>
            Choose Project
          </div>
          {data?.map((file, index) => (
            <div
              key={index}
              className="userDashboardSelector"
              onClick={() => handleSelect(file)}>
              {file.projectName}
            </div>
          ))}
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
