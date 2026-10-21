import { Card, Table, Row, Col } from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { Fragment } from "react";

const DetailsWorkingReport = () => {
  return (
    <Fragment>
      <Actionbar pageTitle="Details Working Report"></Actionbar>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">
                Arunima Sportswear Ltd.
              </Card.Title>
              <Card.Subtitle className="text-center">
                Details Working Report For No Of Workers
              </Card.Subtitle>

              <Table responsive striped bordered size="sm" hover className="mt-1">
                <thead className="text-center">
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th colSpan={4}>Type Of Hours</th>
                    <th></th>
                  </tr>
                  <tr>
                    <th>Shift</th>
                    <th>Section</th>
                    <th>Designation</th>
                    <th>40</th>
                    <th>48</th>
                    <th>60</th>
                    <th>72</th>
                    <th>Grand Total</th>
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

export default DetailsWorkingReport;
