/** @format */

import React, { useEffect, useState } from "react";
import { TextField, Button, selectClasses } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { updateUserLink, allProjects } from "../../api";
import { Edit } from "@mui/icons-material";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 800px;
  gap: 1.2rem;
  padding: 4rem 5rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin: 5rem auto;

  div {
    display: flex;
    gap: 20px;
    font-size: 1.1rem;

    label {
      width: 30%;
      display: flex;
      align-items: center;
    }
    input {
      width: 70%;
      font-size: 1.2rem;
      padding: 2px 8px;
    }
    div {
      width: 70%;
      font-size: 1.2rem;
      display: flex;
      justify-content: space-between;
      button {
        margin: 0;
        min-width: 30%;
        background-color: var(--heading-color);
      }
    }
    button {
      background-color: var(--heading-color);
      font-size: 1.2rem;
      padding: 0.4rem 2.5rem;
      max-width: max-content;
      color: var(--font-color);
      border: 0;
      outline: 0;
      border-radius: 0.1rem;
      margin-bottom: -2rem;
      margin-left: 75%;
      cursor: pointer;
    }
  }
`;

const StyledSelect = styled.select`
  width: 75%;
  font-size: 1.2rem;
  padding: 2px 8px;
  background-color: var(--background-color);
  cursor: pointer;
`;

const SelectedProject = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 90vw;
  margin: 5px auto;
  padding: 0px 5rem;
  gap: 10px;
  div {
    margin: 0;
    width: max-content;
    display: flex;
    justify-content: flex-start;
    background-color: var(--background-color);
    font-size: 1.4rem;
    margin: 0.8rem 0;
    padding: 0.8rem 1rem;
    border-radius: 4px;
    div {
      margin: 0;
      padding: 0;
      display: flex;
      font-size: 1rem;
      min-width: 40px;
      span {
        width: 30px;
        margin: 0 10px;
        text-align: center;
        background-color: #d2d1d1;
        border-radius: 3px;
      }
    }
  }
`;

const SingleUser = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [assignedProject, setAssignedProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectlist, setProjectList] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state) {
      setUserId(location.state._id);
      setUserName(location.state.userName);
      setPassword(location.state.password);
      setStatus(location.state.status);
      setAssignedProject(location.state.assignedProject);
    }
    else navigate('/');
  }, [location]);

  // to load pre-assigned project in selected projects
  useEffect(() => {
    let newList = assignedProject.map((item) => {
      return projectlist.find((data) => data._id === item.project);
    });

    setSelectedProjects(newList);
  }, [assignedProject, projectlist]);

  const optionSetter = () => {
    const options = projectlist.map((item) => item.projectName);
    setProjectOptions(options);
  };

  const getAllProjects = () => {
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
        setProjectList(data.all);
        setLoading(false);
      })
      .catch((error) => {
        // console.error("Fetch error:", error);
      });
  };
  useEffect(() => {
    getAllProjects();
  }, [location]);
  useEffect(() => {
    optionSetter();
  }, [projectlist]);

  const navigator = (data) => {
    if (data.response === 202) navigate("../allUser");
  };
  const updateUser = () => {
    const postData = {
      id: userId,
      userName,
      password,
      status,
      assignedProject,
    };
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
        navigator(data);
      })
      .catch((error) => {
        // console.error("Fetch error:", error);
      });
  };
  
  const handleAddProject = (e) => {
    e.preventDefault();
    const isProjectSelected = selectedProjects.some(
      (item) => item.projectName === selectedOption
    );

    if (!isProjectSelected) {
      const project = projectlist.find(
        (proj) => proj.projectName === selectedOption
      )._id;

      setAssignedProject((prevAssignedProject) => [
        ...prevAssignedProject,
        { project, extraCount: 0 },
      ]);
    }
    else{
      toast.info("already added!")
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // if (userName.length == 0 || password.length == 0)
    // setErrorMessage("Fields cannot be kept empty...");
    // else authChecker();
    updateUser();
  };
  const calculateCount = (id) => {
    return assignedProject.find((item) => item.project === id)?.extraCount;
  };

  const extraCountHandler = (id) => {
    let key = prompt("Kindly enter new count");
    let newList = [...assignedProject];
    newList.find((proj) => proj.project === id).extraCount = key;
    setAssignedProject(newList);
  };

  const deleteProjectHandler = (key) => {
    const newlist = assignedProject.filter((item) => item.project !== key);
    setAssignedProject(newlist);
  };


  return (
    <>
      <StyledForm>
        <div>
          <label htmlFor="">User Name</label>
          <input
            type="text"
            value={userName}
          />
        </div>
        <div>
          <label htmlFor="">Pasword</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="">Status</label>
          <div>
            <label htmlFor="active">Active</label>
            <input
              type="radio"
              id="active"
              name="status"
              value="Active"
              checked={status === "Active"}
              onChange={(e) => setStatus(e.target.value)}
            />
            <label htmlFor="inactive">Inactive</label>
            <input
              type="radio"
              id="inactive"
              name="status"
              value="Inactive"
              checked={status === "Inactive"}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="">Assign Projects</label>
          <div>
            <StyledSelect
              id="dropdown"
              value={selectedOption}
              onChange={(e) => handleOptionChange(e.target.value)}>
              <option
                value=""
                disabled>
                {loading ? "loading": "Select an option"}
              </option>
              {projectOptions.map((option, index) => (
                <option
                  key={index}
                  value={option}>
                  {option}
                </option>
              ))}
            </StyledSelect>
            <button onClick={handleAddProject}>Add</button>
          </div>
        </div>
        <div>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </StyledForm>
      <div>
        <SelectedProject>
          {!selectedProjects.length && <div>No Projects Assigned yet!!!!!</div>}
          {selectedProjects.length > 0 &&
            !loading ?
            selectedProjects.map((item) => {
              return (
                <div>
                  <div>{item?.projectName}</div>
                  <div>
                    <span>{calculateCount(item?._id)}</span>
                    <Edit onClick={() => extraCountHandler(item._id)} />
                    <DeleteIcon
                      onClick={() => deleteProjectHandler(item._id)}
                    />
                  </div>
                </div>
              );
            }) : "loading..."}
        </SelectedProject>
      </div>
    </>
  );
};

export default SingleUser;
