import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import Navbar from './components/UI/Navbar';
import TrackingForm from './components/UI/TrackingForm';

function App() {
  return (
    <>
      <Navbar />
      <Container className="mt-3">
        <Row className="gy-3">
          <Col md={5} sm={12}>
            <Card>
              <Card.Header>Tracking configuration</Card.Header>
              <Card.Body>
                <TrackingForm />
              </Card.Body>
              <Card.Footer>
                <div className="d-flex justify-content-end gap-1">
                  <Button variant="danger">Stop</Button>
                  <Button variant="success">Start</Button>
                </div>
              </Card.Footer>
            </Card>
          </Col>
          <Col md={7} sm={12}>
            <Card>
              <Card.Header>Tracking</Card.Header>
              <Card.Body>placeholder</Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
