/** @format */

import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

const NavbarContainer = styled.nav`
  background-color: #333;
  color: #fff;
  padding: 10px 3rem;
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ul {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    list-style: none;
  }

  li {
    position: relative;
    width: 150px;
    cursor: pointer;
  }

  a {
    color: #fff;
    text-decoration: none;
    padding: 10px;
    display: block;
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #333;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: 200px;

  a {
    width: 180px;
    color: #fff;
    padding: 12px 16px;
    display: block;
    text-decoration: none;
  }
`;

const DropdownWrapper = styled.li`
  &:hover ${DropdownContent} {
    display: block;
  }
`;

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <NavbarContainer>
      <div>CRM</div>
      <ul>
        <DropdownWrapper onClick={toggleDropdown}>
          <Link to="#">Users</Link>
          {isDropdownOpen && (
            <DropdownContent>
              <Link to="/admin/newUser">Create New Users</Link>
              <Link to="/admin/allUser">All Users</Link>
            </DropdownContent>
          )}
        </DropdownWrapper>
        <DropdownWrapper onClick={toggleDropdown}>
          <Link to="#">Projects</Link>
          {isDropdownOpen && (
            <DropdownContent>
              <Link to="/admin/newproject">Create Project</Link>
              <Link to="/admin/allProjects">All Projects</Link>
            </DropdownContent>
          )}
        </DropdownWrapper>
        <LogoutIcon style={{cursor: "pointer"}} onClick={()=> navigate('/')}/>
      </ul>
    </NavbarContainer>
  );
};

export default Navbar;
