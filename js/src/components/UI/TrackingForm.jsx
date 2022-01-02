import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Button, Col, Form, Row, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function TrackingForm({
  opened,
  openConnection,
  closeConnection,
  getLocation,
  location,
  isOpening,
  isClosing,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    if (location) {
      setValue('lat', location.lat);
      setValue('lng', location.lng);
      setValue('alt', location.alt);
    }
  }, [location, setValue]);

  const handleCloseConnection = (e) => {
    e.preventDefault();
    closeConnection();
  };

  const handleOpenConnection = ({ satellite, lat, lng, alt }) => {
    openConnection('ws://127.0.0.1:8000/ws/tracking', satellite, {
      lat,
      lng,
      alt,
    });
  };

  return (
    <Form onSubmit={handleSubmit(handleOpenConnection)}>
      <Card>
        <Card.Header>Tracking configuration</Card.Header>
        <Card.Body>
          <Form.Group className="mb-3" controlId="form-select-satellite">
            <h4 className="mb-3">Satellite</h4>
            <Form.Select
              {...register('satellite', {
                required: 'You must select a satellite',
              })}
            >
              <option value={33591}>ISS</option>
            </Form.Select>
          </Form.Group>
          <hr />
          <Form.Group className="mb-3" controlId="form-set-location">
            <Row className="mb-2">
              <Col>
                <h4>Location</h4>
              </Col>
              <Col className="text-end">
                <Button size="sm" onClick={getLocation}>
                  Localize
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step={0.01}
                  min={0}
                  isInvalid={errors?.lat}
                  {...register('lat', {
                    required: 'Latitude is required',
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  Invalid latitude
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step={0.01}
                  min={0}
                  isInvalid={errors?.lng}
                  {...register('lng', {
                    required: 'Longitude is required',
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  Invalid longitude
                </Form.Control.Feedback>
              </Col>
              <Col>
                <Form.Label>Altitude (meters)</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  isInvalid={errors?.alt}
                  {...register('alt', {
                    required: 'Altitude is required',
                  })}
                />
                <Form.Control.Feedback type="invalid">
                  Invalid altitude
                </Form.Control.Feedback>
              </Col>
            </Row>
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-end">
            {opened ? (
              <Button
                variant="danger"
                size="sm"
                type="button"
                onClick={handleCloseConnection}
                disabled={isClosing}
              >
                Stop
              </Button>
            ) : (
              <Button
                variant="success"
                size="sm"
                type="submit"
                disabled={isOpening}
              >
                Start
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </Form>
  );
}

TrackingForm.propTypes = {
  opened: PropTypes.bool.isRequired,
  openConnection: PropTypes.func.isRequired,
  closeConnection: PropTypes.func.isRequired,
  getLocation: PropTypes.func.isRequired,
  location: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
    alt: PropTypes.number,
  }),
  isOpening: PropTypes.bool.isRequired,
  isClosing: PropTypes.bool.isRequired,
};

TrackingForm.defaultProps = {
  location: null,
};

export default TrackingForm;
