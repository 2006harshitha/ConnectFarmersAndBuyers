// client/src/components/Layout/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../context/authContext";

const NavbarContainer = styled.nav`
  background-color: #e8f5e9;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-bottom: 4px solid #2e7d32;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e7d32;
  text-decoration: none;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
`;

const NavItem = styled.div`
  margin-left: 20px;
  cursor: pointer;
  color: #2e7d32;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const MenuIcon = styled.div`
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 20px;
`;

const ProfileDropdown = styled.div`
  position: relative;
`;

const DropdownContent = styled.div`
  position: absolute;
  right: 0;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 4px;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  color: #333;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Navbar = ({ toggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <NavbarContainer>
      <div style={{ display: "flex", alignItems: "center" }}>
        <MenuIcon onClick={toggleSidebar}>☰</MenuIcon>
        <Logo to="/farmer/dashboard">FarmConnect</Logo>
      </div>

      <NavItems>
        <ProfileDropdown>
          <NavItem onClick={() => setDropdownOpen(!dropdownOpen)}>
            👤 Profile
          </NavItem>
          <DropdownContent isOpen={dropdownOpen}>
            <DropdownItem onClick={() => navigate("/farmer/profile")}>
              View Profile
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </DropdownContent>
        </ProfileDropdown>
      </NavItems>
    </NavbarContainer>
  );
};

export default Navbar;
