// client/src/components/Layout/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #f8fff8;
  height: 100vh;
  position: fixed;
  left: ${({ isOpen }) => (isOpen ? "0" : "-250px")};
  top: 0;
  z-index: 1000;
  transition: left 0.3s ease;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  padding-top: 70px;
`;

const SidebarLink = styled(Link)`
  display: block;
  padding: 15px 20px;
  color: #2e7d32;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e8f5e9;
  }
`;

const Sidebar = ({ isOpen, toggle }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarLink to="/farmer/products" onClick={toggle}>
        Products
      </SidebarLink>
      <SidebarLink to="/farmer/orders" onClick={toggle}>
        Orders
      </SidebarLink>
      <SidebarLink to="/farmer/analytics" onClick={toggle}>
        Analytics
      </SidebarLink>
    </SidebarContainer>
  );
};

export default Sidebar;
