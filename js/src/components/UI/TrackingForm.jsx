import { Button, Col, Form, Row, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

function TrackingForm({ opened, openConnection, closeConnection }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleOpenConnection = (data) => {
    console.log(data);
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
              <option value={1}>Test</option>
            </Form.Select>
          </Form.Group>
          <hr />
          <Form.Group className="mb-3" controlId="form-set-location">
            <Row className="mb-2">
              <Col>
                <h4>Location</h4>
              </Col>
              <Col style={{ textAlign: 'right' }}>
                <Button size="sm">Localize</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  {...register('latitude', {
                    required: 'Latitude is required',
                  })}
                />
              </Col>
              <Col>
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  {...register('longitude', {
                    required: 'Longitude is required',
                  })}
                />
              </Col>
              <Col>
                <Form.Label>Altitude</Form.Label>
                <Form.Control
                  type="number"
                  min={0}
                  {...register('altitude', {
                    required: 'Altitude is required',
                  })}
                />
              </Col>
            </Row>
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <div className="d-flex justify-content-end">
            {opened ? (
              <Button variant="danger" onClick={closeConnection}>
                Stop
              </Button>
            ) : (
              <Button variant="success" type="submit">
                Start
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </Form>
  );
}

export default TrackingForm;
