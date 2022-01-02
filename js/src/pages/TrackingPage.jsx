import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import useLocation from '../../hooks/useLocation';
import useWebsocket from '../../hooks/useWebsocket';
import PolarView from '../components/UI/PolarView';
import TrackingForm from '../components/UI/TrackingForm';

function TrackingPage() {
  const { opened, openConnection, closeConnection, message: data, isOpening, isClosing } = useWebsocket();
  const { getLocation, location } = useLocation();

  return (
    <Container>
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
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <span>
                  Tracking panel
                </span>
                <Badge bg={opened ? "success" : "warning"}>{opened ? "Tracking" : "Idle"}</Badge>
              </div>

            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center gap-4 mb-3">
                <h4 className="m-0">
                  {data ? data.SatelliteName : 'No satellite currently tracked'}
                </h4>
                {data && (
                  <Badge bg={data.Visible ? "primary" : "danger"}>{data.Visible ? "Visible" : "Not visible"}</Badge>
                )}
              </div>
              <Row>
                <Col md={4} sm={12}>
                  <Row>
                    <Col>Azimuth:</Col>
                    <Col>
                      <Badge>{data?.Azimuth.toFixed(2) ?? 'N/A'}</Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Elevation:</Col>
                    <Col>
                      <Badge>{data?.Elevation.toFixed(2) ?? 'N/A'}</Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Latitude:</Col>
                    <Col>
                      <Badge>{data?.SatLat.toFixed(2) ?? 'N/A'}</Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Longitude:</Col>
                    <Col>
                      <Badge>{data?.SatLng.toFixed(2) ?? 'N/A'}</Badge>
                    </Col>
                  </Row>
                </Col>
                <Col md={8} sm={12}>
                  <PolarView
                    azimuth={data ? Number(data.Azimuth.toFixed(2)) : null}
                    elevation={data ? Number(data.Elevation.toFixed(2)) : null}
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
