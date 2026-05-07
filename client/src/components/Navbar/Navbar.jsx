import { Nav, NavLink, NavMenu } from "./NavbarElements";

const Navbar = () => {
  return (
    <Nav>
      <NavMenu>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">Test Page</NavLink>
        <NavLink to="/job-apps">Job Apps</NavLink>
      </NavMenu>
    </Nav>
  );
};

export default Navbar;
