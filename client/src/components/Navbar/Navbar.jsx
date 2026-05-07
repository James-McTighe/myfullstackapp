import { NavLink } from "react-router-dom";
import "./NavbarElements.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__menu">
        <NavLink className="navbar__link" to="/">
          Home
        </NavLink>
        <NavLink className="navbar__link" to="/job-apps">
          Job Apps
        </NavLink>
        <NavLink className="navbar__link" to="/test-page">
          Test Page
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
