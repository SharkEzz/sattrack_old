import { Navbar as BSNavbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import getVersion from '../../utils/getVersion';

function Navbar() {
  return (
    <BSNavbar bg="dark" className="navbar-dark mb-3" expand="lg">
      <Container>
        <BSNavbar.Brand href="#home">
          SatTrack
          <small className="ms-1 fs-6 text-muted">{getVersion()}</small>
        </BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link as={Link} to="/" href="#" className="active">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" href="#">
              About
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
