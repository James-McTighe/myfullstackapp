import { NavLink as RouterNavLink } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  background: #111827;
  min-height: 72px;
  display: flex;
  align-items: center;
  padding: 0 24px;
`;

export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const NavLink = styled(RouterNavLink)`
  color: #f9fafb;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 8px 0;
  border-bottom: 2px solid transparent;

  &.active {
    border-bottom-color: #22c55e;
  }
`;
