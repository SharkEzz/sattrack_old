import { Card, Col, Container, Row } from 'react-bootstrap';
import useWebsocket from '../../hooks/useWebsocket';
import TrackingForm from '../components/UI/TrackingForm';

function TrackingPage() {
  const { opened, openConnection, closeConnection, message } = useWebsocket();

  return (
    <Container className="mt-3">
      <Row className="gy-3">
        <Col md={5} sm={12}>
          <TrackingForm
            opened={opened}
            openConnection={openConnection}
            closeConnection={closeConnection}
          />
        </Col>
        <Col md={7} sm={12}>
          <Card>
            <Card.Header>Tracking</Card.Header>
            <Card.Body>{message}</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TrackingPage;
