import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Button, Col, Form, Row, Card, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function TrackingForm({
  opened,
  openConnection,
  closeConnection,
  getLocation,
  location,
  isOpening,
  isClosing,
  error,
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
      if (location.alt) {
        setValue('alt', location.alt);
      }
    }
  }, [location, setValue]);

  const handleCloseConnection = (e) => {
    e.preventDefault();
    closeConnection();
  };

  const handleOpenConnection = ({ catnbr, lat, lng, alt }) => {
    openConnection('ws://127.0.0.1:8000/ws/tracking', catnbr, {
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
            <h4 className="mb-3">Satellite catalog number</h4>
            <Form.Control
              min={0}
              type="number"
              placeholder="25544"
              {...register('catnbr', {
                required: 'You must enter a satellite catalog number',
              })}
            />
            {error && (
              <Alert className="mt-2" variant="danger">
                {error.message}
              </Alert>
            )}
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
                  placeholder="20,33"
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
                  placeholder="4,88"
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
                  placeholder="57"
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
  error: PropTypes.shape({
    status: PropTypes.number,
    message: PropTypes.string,
  }),
};

TrackingForm.defaultProps = {
  location: null,
  error: null,
};

export default TrackingForm;
