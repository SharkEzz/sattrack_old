import { Navbar as BSNavbar, Container, Nav } from 'react-bootstrap';

function Navbar() {
  return (
    <BSNavbar bg="dark" className="navbar-dark" expand="lg">
      <Container>
        <BSNavbar.Brand href="#home">SatTrack</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav>
            <Nav.Link href="#" className="active">
              Home
            </Nav.Link>
            <Nav.Link href="#">
              About
            </Nav.Link>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
