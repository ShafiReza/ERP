import { Card, Row, Col, Table } from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { Fragment } from "react";

const EmployeeCard = () => {
  return (
    <Fragment>
      <Actionbar pageTitle="Employee Card"></Actionbar>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Row className="text-center">
                <Col sm="3" className="border border-dark p-3">
                  <div>
                    <h4>Arunima Group</h4>
                    <h6>Dewan Idris Road, Zirabo</h6>
                    <h6>Savar, Dhak-1341</h6>
                  </div>
                  <Table borderless size="sm" className="mt-5 ms-5">
                    <tbody className="text-start">
                      <tr>
                        <td className="col-sm-3">Name</td>
                        <td>: Amor Nath</td>
                      </tr>
                      <tr>
                        <td>ID Card No</td>
                        <td>: 1234</td>
                      </tr>
                      <tr>
                        <td>Issue Date</td>
                        <td>: 02/09/2021</td>
                      </tr>
                      <tr>
                        <td>Designation</td>
                        <td>: Engineer</td>
                      </tr>
                      <tr>
                        <td>Department</td>
                        <td>: Software</td>
                      </tr>
                      <tr>
                        <td>Nature Of Work</td>
                        <td>:</td>
                      </tr>
                      <tr>
                        <td>Tiket/Card No</td>
                        <td>: 3456</td>
                      </tr>
                      <tr>
                        <td>Joining Date</td>
                        <td>: 20/9/2021</td>
                      </tr>
                      <tr>
                        <td>Blood Group</td>
                        <td>: B+</td>
                      </tr>
                    </tbody>
                  </Table>
                  <Row className="mt-4">
                    <Col className="border-top border-dark ms-2 me-2">
                      <p>Employee Signature</p>
                    </Col>
                    <Col className="border-top border-dark ms-2 me-2">
                      <p>Authorized Signature</p>
                    </Col>
                  </Row>
                </Col>

                <Col sm="3" className="border border-dark ms-1">
                  <Table borderless size="sm" className="mt-5 ms-5">
                    <tbody className="text-start">
                      <tr>
                        <td className="col-sm-3">Tenure</td>
                        <td>: 5 Years From Issue Date</td>
                      </tr>
                      <tr>
                        <td>E. Contact No</td>
                        <td>: 01716886885</td>
                      </tr>
                      <tr>
                        <td>NID/ B.C No</td>
                        <td>: 3313031014010</td>
                      </tr>
                      <tr>
                        <td>Permanent Address</td>
                        <td>
                          : Vill:Hakimpur Po:Hakimpur Ps:Bagerhat Dist:Bagerhat
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <h4>Factory Address:</h4>
                  <p>
                    Holding No- 08/63/04, Road No 01 <br /> Word No - 8, Block
                    No - D <br /> Zirabo, Ashulia, Savar, Dhaka - 1341 <br />{" "}
                    Contact No: 8809613000777
                  </p>
                  <h6>www.arunimagroup.com</h6>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default EmployeeCard;
