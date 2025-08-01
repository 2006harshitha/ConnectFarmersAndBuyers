import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background: #81c784;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
  color: white;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const BuyerNavbar = () => {
  return (
    <Nav>
      <h2>Buyer Dashboard</h2>
      <NavLinks>
        <StyledLink to="/buyer">Home</StyledLink>
        <StyledLink to="/buyer/cart">Cart</StyledLink>
        <StyledLink to="/buyer/orders">Orders</StyledLink>
        <StyledLink to="/buyer/profile">Profile</StyledLink>
      </NavLinks>
    </Nav>
  );
};

export default BuyerNavbar;
