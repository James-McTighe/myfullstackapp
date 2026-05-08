import { NavLink } from "react-router-dom";
import "./NavbarElements.css";

const Navbar = () => {
  return (
    <>
      <h1 className="p-5 pb-0.5 text-2xl text-emerald-500 bg-[#111827] ">James McTighe's Full Stack web app!</h1>
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
    </>
  );
};

export default Navbar;
