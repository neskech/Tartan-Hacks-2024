import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

//stolen from bootstrap docs
function DarkNavbar() {
  return (
    <Navbar  variant="dark" bg="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand href="#home">Vimplify</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Collapse id="navbar-dark-example">
          <Nav>
            <NavDropdown
              id="nav-dropdown-dark-example"
              title="Options"
              menuVariant="dark"
            >
              <NavDropdown.Item href="#action/3.1">Toggle GPT</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Toggle Music
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                Toggle Images
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default DarkNavbar;
