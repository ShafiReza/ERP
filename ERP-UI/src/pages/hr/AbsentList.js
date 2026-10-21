import { Card, Table, Row, Col } from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { Fragment } from "react";

const AbsentList = () => {
  return (
    <Fragment>
      <Actionbar pageTitle="Absent List"></Actionbar>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">
                Arunima Sportswear Ltd.
              </Card.Title>
              <Row>
                <Col className="fw-bold">Absent List On</Col>
              </Row>

              <Table responsive striped hover bordered size="sm">
                <thead className="text-center">
                  <tr>
                    <th>SL No</th>
                    <th>Card No </th>
                    <th>Employee Name </th>
                    <th>Designation </th>
                    <th>In Time</th>
                    <th colSpan={2}> Signature</th>
                    <th> Remarks</th>
                  </tr>
                  <tr>
                    <th colSpan={5}></th>
                    <th> Worker</th>
                    <th> Incharge</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody></tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AbsentList;
