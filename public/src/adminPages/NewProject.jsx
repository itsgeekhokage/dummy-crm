import React, {useState} from 'react';
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import { registerNewProjectLink } from '../../api';
import { toast } from "react-toastify"

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 800px;
  gap: 1rem;
  margin: auto;
  padding: 4rem 5rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  margin-top: 5rem;

  div {
    display: flex;
    gap: 20px;
    font-size: 1.2rem;
    align-items: center;
    label {
      width: 30%;
    }
    input {
      width: 70%;
      font-size: 1.2rem;
      padding: 5px 10px;
    }
  }
  button {
    background-color: var(--heading-color);
    font-size: 1.2rem;
    padding: 0.4rem;
    max-width: max-content;
    color: var(--font-color);
    border: 0;
    outline: 0;
    border-radius: 0.4rem;
    margin-bottom: -2rem;
    margin-left: 80%;
    cursor: pointer;
  }
  p {
    color: red;
    text-align: center;
    margin: 2rem;
    margin-bottom: 0;
  }
`;

const inputStyles = {
  width: "100%",
  minWidth: "300px",
};

const buttonStyles = {
  fontSize: "1.4rem",
};

const NewProject = () => {
    const [projectName, setProjectName] = useState("");
    const navigate = useNavigate();

    const navigator = (data) => {
      if (data.response === 400)
        toast.error("User already registered...");
      else if (data.response === 202)
        navigate("../createProject", { state: data.project });
    };

    const createProject = () => {
      const postData = {
        projectName,
      };

      fetch(registerNewProjectLink, {
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
          // console.error(error);
        });
    };


    const handleSubmit = (e) => {
      e.preventDefault();
      if (projectName.length == 0 )
        toast.warn("Fields cannot be kept empty...");
      else createProject();
    };

  return (
    <StyledForm>
      <h2>Create New Project</h2>
      <div>
        <label htmlFor="">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>
      <button onClick={(e) => handleSubmit(e)}>Create</button>
    </StyledForm>
  );
}

export default NewProject
