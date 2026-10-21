import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <Nav className="flex-column" variant="dark" defaultActiveKey="/dashboard">
      <NavLink className="nav-link" to="/dashboard">
        <i className="bi bi-speedometer text-primary"> </i>
        <span className="px-4">Dashboard</span>
      </NavLink>

      <NavLink className="nav-link" to="/costsheet">
        <i className="bi bi-hdd-fill text-primary"> </i>
        <span className="px-4">Cost Sheet</span>
      </NavLink>
      <NavLink className="nav-link" to="/booking">
        <i className="bi bi-hdd-fill text-primary"> </i>
        <span className="px-4">Booking</span>
      </NavLink>

      <NavLink className="nav-link" to="/stationaryrequisition">
        <i className="bi bi-hdd-fill text-primary"> </i>
        <span className="px-4">Stationary Requisition</span>
      </NavLink>
      <NavLink className="nav-link" to="/stationarystorereceive">
        <i className="bi bi-hdd-fill text-primary"> </i>
        <span className="px-4">Stationary Store Receive</span>
      </NavLink>
      <NavLink className="nav-link" to="/stationarystoreissue">
        <i className="bi bi-hdd-fill text-primary"> </i>
        <span className="px-4">Stationary Store Issue</span>
      </NavLink>

      <NavLink className="nav-link" to="/supplier">
        <i className="bi bi-hdd-fill text-primary"> </i>
        <span className="px-4">Supplier</span>
      </NavLink>
    </Nav>
  );
};
export default Sidebar;
