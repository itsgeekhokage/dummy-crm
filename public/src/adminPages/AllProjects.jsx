/** @format */

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineTwoToneIcon from "@mui/icons-material/DriveFileRenameOutlineTwoTone";
import DownloadTwoToneIcon from "@mui/icons-material/DownloadTwoTone";
import { allProjects } from "../../api";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

const Dashboard = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  div {
    display: flex;
    justify-content: center;
    min-width: 800px;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 90%;
  margin: 2rem 0;
  div {
    margin: 0;
    width: 90%;
    display: flex;
    justify-content: space-between;
    background-color: var(--background-color);
    font-size: 1.2rem;
    margin: 0.8rem 0;
    padding: 0.8rem 2rem;
    border-radius: 4px;
  }
  span {
    display: flex;
    justify-content: center;
    width: 20%;
  }
`;

const AllProjects = () => {
  const [projectList, setProjectList] = useState([]);
  const [sampleList, setSampleList] = useState([]);
  const [searchKey, setSearchKey] = useState([]);
  const navigate = useNavigate();

  const filterData = (key) => {
    setSearchKey(key);
    let newList = projectList.filter((item) =>
      item.projectName.toLowerCase().includes(key.trim().toLowerCase())
    );
    if (key === "") newList = projectList;
    setSampleList(newList);
  };

  const getAllUsers = () => {
    fetch(allProjects, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const statusOrder = { Inactive: 1, Active: 0 };

        const sortedData = [...data.all].sort((a, b) => {
          const statusA = statusOrder[a["status"]];
          const statusB = statusOrder[b["status"]];

          return statusA - statusB;
        });

        setProjectList(sortedData);
        setSampleList(sortedData);
      })
      .catch((error) => {
        // console.error("Fetch error:", error);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Dashboard>
      <div className="userDashboardSearchDiv">
        <input
          type="text"
          placeholder="Search Project Here..."
          className="userDashboardSearchBar"
          value={searchKey}
          onChange={(e) => filterData(e.target.value)}
        />
      </div>
      <div>
        <Container>
          <div style={{ fontWeight: "700" }}>
            <span>Project Name</span>
            <span>Status</span>
            <span>Audio Files</span>
            <span>Deadline</span>
            <span>Audio Play Limit</span>
            <span>Commands</span>
          </div>
          {!sampleList && (
            <div>
              No projects yet for you to see, wait and refresh or reload/
              recreate
            </div>
          )}
          {sampleList.length ?
            sampleList.map((item, index) => (
              <div key={index}>
                <span>{item.projectName}</span>
                <span>{item.status}</span>
                <span>{item.audioFiles.length}</span>
                <span>{item.deadline.slice(0, 10)}</span>
                <span>{item.limit}</span>
                <span>
                  {/* <DownloadTwoToneIcon
                    style={{ color: "#d88511", margin: "0 5px" }}
                  /> */}
                  <DriveFileRenameOutlineTwoToneIcon

                    onClick={() =>
                      navigate("../createProject", { state: item })
                    }
                    style={{ color: "#2b412b", margin: "0 5px", cursor: "pointer" }}
                  />
                </span>
              </div>
            )):
            <div> loading...</div>
            }
        </Container>
      </div>
    </Dashboard>
  );
};

export default AllProjects;
