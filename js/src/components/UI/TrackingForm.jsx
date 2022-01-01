import { Button, Col, Form, Row } from 'react-bootstrap';

function TrackingForm() {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="form-select-satellite">
        <h4 className="mb-3">Satellite</h4>
        <Form.Select>
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
            <Form.Control type="number" min={0} />
          </Col>
          <Col>
            <Form.Label>Longitude</Form.Label>
            <Form.Control type="number" min={0} />
          </Col>
          <Col>
            <Form.Label>Altitude</Form.Label>
            <Form.Control type="number" min={0} />
          </Col>
        </Row>
      </Form.Group>
    </Form>
  );
}

export default TrackingForm;
