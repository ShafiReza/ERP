import Actionbar from "../../components/layout/Actionbar";
import { Fragment, useState, useCallback, useRef } from "react";
import {
  Row,
  Col,
  InputGroup,
  Form,
  Button,
  Card,
  Table,
  Spinner,
  Nav,
} from "react-bootstrap";
import { Floor, Shift } from "../../components/DropDown";
import useFetch from "../../components/hooks/useFetch";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AttendanceSummary = () => {
  const [searchCriteria, setSearchCriteria] = useState({ employeeType: 0 });

  const [res, getData] = useFetch();
  let componentRef = useRef();
  const getAttendanceSummary = useCallback(() => {
    getData(
      "Attendance/GetDailyAttendanceSummary?" +
        new URLSearchParams(searchCriteria),
      "GET"
    );
  }, [getData, searchCriteria]);

  return (
    <Fragment>
      <Actionbar pageTitle="Attendance Summary">
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
        <Col>
          <InputGroup>
            <InputGroup.Text>Date</InputGroup.Text>
            <Form.Control
              type="date"
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  fromDate: e.target.value,
                })
              }
              value={searchCriteria.fromDate}
            />
          </InputGroup>
        </Col>
        <Col>
          <Floor
            onChange={(value, action) =>
              setSearchCriteria({
                ...searchCriteria,
                [action.name]: value ? value.value : null,
              })
            }
            name="floor"
            selected={searchCriteria.shiftId}
          />
        </Col>
        <Col>
          <Shift
            onChange={(value, action) =>
              setSearchCriteria({
                ...searchCriteria,
                [action.name]: value ? value.value : null,
              })
            }
            name="shiftId"
            selected={searchCriteria.shiftId}
          />
        </Col>

        <Col sm="1" className="text-end">
          <Button onClick={() => getAttendanceSummary()}>Preview</Button>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card ref={(el) => (componentRef = el)}>
            <Card.Body>
              <Table responsive striped hover bordered size="sm">
                <thead className="text-center">
                  <tr>
                    <th>Description</th>
                    <th>Budget</th>
                    <th>Total(Strength)</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Leave</th>
                    <th>Late</th>
                    <th>Male</th>
                    <th>Female</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="13" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data?.length === 0 && (
                    <tr>
                      <td colSpan="13" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Section}</td>
                      <td>{item.Budget}</td>
                      <td className="text-center">{item.GrandTotal}</td>
                      <td className="text-center">{item.TotalPresent}</td>
                      <td className="text-center">{item.AbsentDays}</td>
                      <td className="text-center">{item.Leave}</td>
                      <td className="text-center">{item.Late}</td>
                      <td className="text-center">{item.Male}</td>
                      <td className="text-center">{item.Female}</td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td>Total</td>
                    <td className="text-center">
                      {res.data.reduce((total, item) => {
                        return (total += item.Budget);
                      }, 0)}
                    </td>
                    <td className="text-center">
                      {res.data.reduce((total, item) => {
                        return (total += item.GrandTotal);
                      }, 0)}
                    </td>
                    <td className="text-center">
                      {res.data.reduce((total, item) => {
                        return (total += item.TotalPresent);
                      }, 0)}
                    </td>
                    <td className="text-center">
                      {res.data.reduce((total, item) => {
                        return (total += item.AbsentDays);
                      }, 0)}
                    </td>
                    <td className="text-center">
                      {res.data.reduce((total, item) => {
                        return (total += item.Leave);
                      }, 0)}
                    </td>
                    <td className="text-center">
                      {res.data.reduce((total, item) => {
                        return (total += item.Late);
                      }, 0)}
                    </td>
                    <td className="text-center">
                      {res.data.reduce((total, item) => {
                        return (total += item.Male);
                      }, 0)}
                    </td>
                    <td className="text-center">
                      {res.data.reduce((total, item) => {
                        return (total += item.Female);
                      }, 0)}
                    </td>
                  </tr>
                  <tr className="fw-bold">
                    <td colSpan={2}>%</td>
                    <td className="text-center">100%</td>
                    <td className="text-center">
                      {(
                        (res.data.reduce((total, item) => {
                          return (total += item.TotalPresent);
                        }, 0) /
                          res.data.reduce((total, item) => {
                            return (total += item.GrandTotal);
                          }, 0)) *
                        100
                      ).toFixed(2)}
                      %
                    </td>
                    <td className="text-center">
                      {(
                        (res.data.reduce((total, item) => {
                          return (total += item.AbsentDays);
                        }, 0) /
                          res.data.reduce((total, item) => {
                            return (total += item.GrandTotal);
                          }, 0)) *
                        100
                      ).toFixed(2)}
                      %
                    </td>
                    <td className="text-center">
                      {(
                        (res.data.reduce((total, item) => {
                          return (total += item.Leave);
                        }, 0) /
                          res.data.reduce((total, item) => {
                            return (total += item.GrandTotal);
                          }, 0)) *
                        100
                      ).toFixed(2)}
                      %
                    </td>
                    <td className="text-center">
                      {(
                        (res.data.reduce((total, item) => {
                          return (total += item.Late);
                        }, 0) /
                          res.data.reduce((total, item) => {
                            return (total += item.GrandTotal);
                          }, 0)) *
                        100
                      ).toFixed(2)}
                      %
                    </td>
                    <td className="text-center">
                      {(
                        (res.data.reduce((total, item) => {
                          return (total += item.Male);
                        }, 0) /
                          res.data.reduce((total, item) => {
                            return (total += item.GrandTotal);
                          }, 0)) *
                        100
                      ).toFixed(2)}
                      %
                    </td>
                    <td className="text-center">
                      {(
                        (res.data.reduce((total, item) => {
                          return (total += item.Female);
                        }, 0) /
                          res.data.reduce((total, item) => {
                            return (total += item.GrandTotal);
                          }, 0)) *
                        100
                      ).toFixed(2)}
                      %
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AttendanceSummary;
