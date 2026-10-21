import { Container, Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Actionbar = (props) => {
  return (
    <Navbar
      bg="white"
      expand="lg"
      className="rounded action-bar"
      style={{ padding: 2 }}
    >
      <Container fluid>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/dashboard" className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-house" /> Home{" "}
              <FontAwesomeIcon icon="fa-solid fa-chevron-right" />{" "}
              {props.pageTitle}
            </NavLink>
          </Nav>

          <Nav className="ms-auto">{props.children}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Actionbar;
