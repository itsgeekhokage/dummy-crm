/** @format */

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineTwoToneIcon from "@mui/icons-material/DriveFileRenameOutlineTwoTone";
import { fetchAllUsers } from "../../api";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../api";

const Dashboard = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  width: 100%;
  div {
    width: 100%;
    display: flex;
    justify-content: center;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 90%;
  overflow: scroll;
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
    span {
      display: flex;
      justify-content: center;
      width: 15%;
    }
  }
`;
const editButtonStyles = {
  color: "green",
  margin: "0 2px",
  cursor: "pointer",
};
const deleteButtonStyles = {
  color: "#800020",
  margin: "0 2px",
  cursor: "pointer",
};

const AllUsers = () => {
  const [userList, setUserList] = useState([]);
  const [sampleList, setSampleList] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();

  const filterData = (key) => {
    setSearchKey(key);
    let newList = userList.filter((item) =>
      item.userName.toLowerCase().includes(key.trim().toLowerCase())
    );
    if (key === "") newList = userList;
    setSampleList(newList);
  };
  const getAllUsers = () => {
    fetch(fetchAllUsers, {
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
        setUserList(data.allUsers);
        setSampleList(data.allUsers);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  const deleteApi = (id) => {
    fetch(`${deleteUser}/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        getAllUsers();
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };


  const deleteHandler = (item) => {
    let name = item.userName;
    const confirmation = confirm(
      `Do you really want to delete ${name}, You can mark him/her inactive instead`
    );
    if (confirmation) deleteApi(item._id);
  };
  return (
    <Dashboard>
      <div className="userDashboardSearchDiv">
        <input
          type="text"
          placeholder="Search User Here..."
          className="userDashboardSearchBar"
          value={searchKey}
          onChange={(e) => filterData(e.target.value)}
        />
      </div>
      <div>
        <Container>
          <div style={{ fontWeight: "700" }}>
            <span>User Name</span>
            <span>Password</span>
            <span>Status</span>
            <span>Assigned Projects</span>
            <span>Logins</span>
            <span>Audio Played</span>
            <span>Commands</span>
          </div>
          {sampleList.map((item) => {
            return (
              <div>
                <span>{item.userName}</span>
                <span>{item.password}</span>
                <span>{item.status}</span>
                <span> {item.assignedProject.length}</span>
                <span> {item.logins.length}</span>
                <span> {item.audioPlayed.length}</span>
                {""}
                {item.admin && (
                  <span>
                    <DriveFileRenameOutlineTwoToneIcon
                      onClick={() => alert("not allowed, contact head admin")}
                      style={editButtonStyles}
                    />
                  </span>
                )}
                {!item.admin && (
                  <span>
                    <DriveFileRenameOutlineTwoToneIcon
                      onClick={() =>
                        navigate("/admin/singleUser", { state: item })
                      }
                      style={editButtonStyles}
                    />
                  </span>
                )}
              </div>
            );
          })}
        </Container>
      </div>
    </Dashboard>
  );
};

export default AllUsers;
