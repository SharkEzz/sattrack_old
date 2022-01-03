import { useMemo } from 'react';
import { Badge, Card, Col, Container, Row } from 'react-bootstrap';
import useLocation from '../hooks/useLocation';
import useWebsocket from '../hooks/useWebsocket';
import PolarView from '../components/UI/PolarView';
import TrackingForm from '../components/UI/TrackingForm';

function TrackingPage() {
  const {
    opened,
    openConnection,
    closeConnection,
    message,
    isOpening,
    isClosing,
    error,
  } = useWebsocket();

  const trackingData = useMemo(() => {
    if (message?.Status && message.Status === 404) {
      return null;
    }

    return message;
  }, [message]);
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
            error={error}
          />
        </Col>
        <Col lg={7} md={12}>
          <Card>
            <Card.Header>
              <div className="d-flex align-items-center justify-content-between">
                <span>Tracking panel</span>
                <Badge bg={opened ? 'success' : 'warning'}>
                  {opened ? 'Tracking' : 'Idle'}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-center gap-4 mb-3">
                <h4 className="m-0">
                  {trackingData
                    ? trackingData.Data.SatName
                    : 'No satellite currently tracked'}
                </h4>
                {trackingData && (
                  <Badge bg={trackingData.Data.Visible ? 'primary' : 'danger'}>
                    {trackingData.Data.Visible ? 'Visible' : 'Not visible'}
                  </Badge>
                )}
              </div>
              <Row>
                <Col md={4} sm={12}>
                  <Row>
                    <Col>Azimuth:</Col>
                    <Col>
                      <Badge>
                        {trackingData?.Data.Azimuth.toFixed(2) ?? 'N/A'}
                      </Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Elevation:</Col>
                    <Col>
                      <Badge>
                        {trackingData?.Data.Elevation.toFixed(2) ?? 'N/A'}
                      </Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Latitude:</Col>
                    <Col>
                      <Badge>
                        {trackingData?.Data.SatLat.toFixed(2) ?? 'N/A'}
                      </Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col>Longitude:</Col>
                    <Col>
                      <Badge>
                        {trackingData?.Data.SatLng.toFixed(2) ?? 'N/A'}
                      </Badge>
                    </Col>
                  </Row>
                </Col>
                <Col md={8} sm={12}>
                  <PolarView
                    azimuth={
                      trackingData
                        ? Number(trackingData.Data.Azimuth.toFixed(2))
                        : null
                    }
                    elevation={
                      trackingData
                        ? Number(trackingData.Data.Elevation.toFixed(2))
                        : null
                    }
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
