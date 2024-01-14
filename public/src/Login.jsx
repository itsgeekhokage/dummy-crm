/** @format */

import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import styled from "styled-components";
import { signinLink } from "../api";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;
const Heading = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  gap: 1rem;
  margin: auto;
  padding: 4rem 5rem;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  p{
    color: red;
    text-align: center;
  }
`;

const inputStyles = {
  width: "100%",
  minWidth: "300px",
};

const buttonStyles = {
  fontSize: "1.4rem",
};

const UserLogin = () => {
  let [userName, setUserName] = useState("");
  let [password, setPassword] = useState("");
  let [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const navigator = (data) => {
    console.log("navigation", data);
    if(data?.user.admin === true) navigate("/admin/allUser", {state : data.user})
    // else if(data?.admin === false) navigate("/home", {state : data});
    else navigate("/home", {state : data.user});
  }
  const authChecker = () => {
    const postData = {
      userName,
      password,
    };
    fetch(signinLink, {
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
        if(data.response === 202) navigator(data);
        else alert("Authentication failed, kindly enter correct userId or password");
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(userName.length == 0 || password.length == 0) setErrorMessage("Fields cannot be kept empty...");
    else authChecker();
  };

  return (
    <Container>
      <StyledForm>
        <Heading>Sign IN</Heading>
        <TextField
          label="Username"
          variant="outlined"
          margin="normal"
          style={inputStyles}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          style={inputStyles}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          style={buttonStyles}
          onClick={(e) => handleSubmit(e)}>
          Login
        </Button>
        <p>{errorMessage}</p>
      </StyledForm>
    </Container>
  );
};

export default UserLogin;
