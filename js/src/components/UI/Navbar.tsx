import { Navbar as BSNavbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <BSNavbar bg="dark" className="navbar-dark mb-3" expand="lg">
      <Container>
        <BSNavbar.Brand href="#home">SatTrack</BSNavbar.Brand>
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
