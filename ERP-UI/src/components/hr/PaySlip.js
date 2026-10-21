import { Card, Table, Row, Col, Form } from "react-bootstrap";
import { Fragment } from "react";
import { Year, Month } from "../DropDown";

const PaySlip = () => {
  return (
    <Fragment>
      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
          <Form.Control placeholder="Card No" />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Month />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Year />
        </Form.Group>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Card.Subtitle className="text-center">Pay Slip</Card.Subtitle>

              <Table striped size="sm" hover></Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default PaySlip;
