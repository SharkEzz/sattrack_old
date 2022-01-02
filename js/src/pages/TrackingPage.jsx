import { Card, Col, Container, Row } from 'react-bootstrap';
import useLocation from '../../hooks/useLocation';
import useWebsocket from '../../hooks/useWebsocket';
import TrackingForm from '../components/UI/TrackingForm';

function TrackingPage() {
  const { opened, openConnection, closeConnection, message } = useWebsocket();
  const { getLocation, location } = useLocation();

  return (
    <Container className="mt-3">
      <Row className="gy-3">
        <Col lg={5} md={12}>
          <TrackingForm
            opened={opened}
            openConnection={openConnection}
            closeConnection={closeConnection}
            location={location}
            getLocation={getLocation}
          />
        </Col>
        <Col lg={7} md={12}>
          <Card>
            <Card.Header>Tracking panel</Card.Header>
            <Card.Body>{message?.SatLat}</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TrackingPage;
