import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import useLocation from '../../hooks/useLocation';
import useWebsocket from '../../hooks/useWebsocket';
import PolarView from '../components/UI/PolarView';
import TrackingForm from '../components/UI/TrackingForm';

function TrackingPage() {
  const { opened, openConnection, closeConnection, message, isOpening, isClosing } = useWebsocket();
  const { getLocation, location } = useLocation();

  return (
    <Container className="mt-3">
      <Row className="gy-3">
        <Col lg={5} md={12}>
          <TrackingForm
            opened={opened}
            isOpening={isOpening}
            isClosing={isClosing}
            openConnection={openConnection}
            closeConnection={closeConnection}
            location={location}
            getLocation={getLocation}
          />
        </Col>
        <Col lg={7} md={12}>
          <Card>
            <Card.Header>Tracking panel</Card.Header>
            <Card.Body>
              <h4>
                {message ? message.SatelliteName : 'No satellite tracking'}
              </h4>
              <Row>
                <Col md={6} sm={12}>
                  {message && (
                    <>
                      <Row>
                        <Col sm={4}>Azimuth:</Col>
                        <Col>
                          <Badge>{message.Azimuth.toFixed(2)}</Badge>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={4}>Elevation:</Col>
                        <Col>
                          <Badge>{message.Elevation.toFixed(2)}</Badge>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={4}>Latitude:</Col>
                        <Col>
                          <Badge>{message.SatLat.toFixed(2)}</Badge>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={4}>Longitude:</Col>
                        <Col>
                          <Badge>{message.SatLng.toFixed(2)}</Badge>
                        </Col>
                      </Row>
                    </>
                  )}
                </Col>
                <Col md={6} sm={12}>
                  <PolarView
                    azimuth={message ? Number(message.Azimuth.toFixed(2)) : null}
                    elevation={message ? Number(message.Elevation.toFixed(2)) : null}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TrackingPage;
