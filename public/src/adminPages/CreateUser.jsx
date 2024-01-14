import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import { registerNewUserLink } from '../../api';

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

const CreateUser = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const navigator = (data) => {
      console.log(data.response);
      if(data.response === 404) setErrorMessage("User already registered, kindly try another one ")
      else if(data.response === 202) navigate("../singleuser", {state : data.user});
    };

    const createUser = () => {
      const postData = {
        userName,
        password
      };
      fetch(registerNewUserLink, {
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
          console.error("Fetch error:", error);
        });
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      if (userName.length == 0 || password.length == 0)
        setErrorMessage("Fields cannot be kept empty...");
      else createUser();
    };

  return (
     <StyledForm>
        <h2>
            Create New User
        </h2>
        <div>
            <label htmlFor="">User Name</label>
            <input type="text" value={userName} onChange={(e)=>setUserName(e.target.value)} />
        </div>
        <div>
            <label htmlFor="">Password</label>
            <input type="text"  value={password} onChange={(e)=>setPassword(e.target.value)} />
        </div>
        <button onClick={(e)=> handleSubmit(e)}>
            Create
        </button>
        <p>{errorMessage}</p>
     </StyledForm>
  )
}

export default CreateUser
