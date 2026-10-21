import {
  Row,
  Col,
  Form,
  Card,
  Table,
  Image,
  Button,
  Spinner,
  Nav,
} from "react-bootstrap";

import { useState, Fragment, useRef } from "react";
import Actionbar from "../../components/layout/Actionbar";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EmployeeVarification = () => {
  const [searchCriteria, setSearchCriteria] = useState({ Decision: "NID" });
  const [employeeDetails, setEmployeeDetails] = useState({});
  const [loading, setLoading] = useState(false);
  let componentRef = useRef();

  const searchePersonDetails = () => {
    if (searchCriteria.NID && searchCriteria.birthDate) {
      setLoading(true);
      fetch(
        process.env.REACT_APP_API_URL +
          "Employees/EmployeeVarification?" +
          new URLSearchParams(searchCriteria),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((response) => {
          setEmployeeDetails(response);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  return (
    <Fragment>
      <Actionbar pageTitle="Employee Varification">
        {" "}
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => componentRef}
        />
      </Actionbar>

      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
          <Form.Control
            type="text"
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                NID: e.target.value,
              })
            }
          />
        </Form.Group>

        <Form.Group as={Col} sm="3">
          <Form.Control
            type="Date"
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                birthDate: e.target.value,
              })
            }
            value={searchCriteria.birthDate}
          />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          {loading ? (
            <Button variant="primary" disabled>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </Button>
          ) : (
            <Button onClick={searchePersonDetails}>Preview</Button>
          )}
        </Form.Group>
      </Row>
      <Row className="mt-2 mb-2">
        <Col ref={(el) => (componentRef = el)}>
          <Card>
            <Card.Body>
              <Image
                src={employeeDetails?.data?.nid?.photoUrl}
                className="d-block w-25"
                thumbnail
                alt="Person Image"
              />
              <Table responsive bordered striped hover className="mt-2">
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="12" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!loading && !employeeDetails?.data?.nid && (
                    <tr>
                      <td colSpan="12" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {employeeDetails?.data?.nid ? (
                    <Fragment>
                      {" "}
                      <tr>
                        <td>NID</td>
                        <td>{employeeDetails?.data?.nid?.nationalIdNumber}</td>
                      </tr>
                      <tr>
                        <td>Name (Bangla)</td>
                        <td>{employeeDetails?.data?.nid?.fullNameBN}</td>
                      </tr>
                      <tr>
                        <td>Name (English)</td>
                        <td>{employeeDetails?.data?.nid?.fullNameEN}</td>
                      </tr>
                      <tr>
                        <td>Gender</td>
                        <td>{employeeDetails?.data?.nid?.gender}</td>
                      </tr>
                      <tr>
                        <td>Date of Birth</td>
                        <td>{employeeDetails?.data?.nid?.dateOfBirth}</td>
                      </tr>
                      <tr>
                        <td>Profession</td>
                        <td>{employeeDetails?.data?.nid?.profession}</td>
                      </tr>
                      <tr>
                        <td>Father Name</td>
                        <td>{employeeDetails?.data?.nid?.fathersNameBN}</td>
                      </tr>
                      <tr>
                        <td>Father Name (Eng)</td>
                        <td>{employeeDetails?.data?.nid?.fathersNameEN}</td>
                      </tr>
                      <tr>
                        <td>Mother Name</td>
                        <td>{employeeDetails?.data?.nid?.mothersNameBN}</td>
                      </tr>
                      <tr>
                        <td>Mother Name (Eng)</td>
                        <td>{employeeDetails?.data?.nid?.mothersNameEN}</td>
                      </tr>
                      <tr>
                        <td>Spouse</td>
                        <td>{employeeDetails?.data?.nid?.dateOfBirth}</td>
                      </tr>
                      <tr>
                        <td>Permanent Address</td>
                        <td>
                          {employeeDetails?.data?.nid?.permanentAddressBN}
                        </td>
                      </tr>
                      <tr>
                        <td>Permanent Address (Eng)</td>
                        <td>
                          {employeeDetails?.data?.nid?.permenantAddressEN}
                        </td>
                      </tr>
                      <tr>
                        <td>Present Address</td>
                        <td>{employeeDetails?.data?.nid?.presentAddressBN}</td>
                      </tr>
                      <tr>
                        <td>Present Address (Eng)</td>
                        <td>{employeeDetails?.data?.nid?.presentAddressEN}</td>
                      </tr>
                    </Fragment>
                  ) : null}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col></Col>
      </Row>
    </Fragment>
  );
};

export default EmployeeVarification;
