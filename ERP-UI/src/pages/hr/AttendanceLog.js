import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  Nav,
  Pagination,
  InputGroup,
} from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { useState, createRef, Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Floor, Section } from "../../components/DropDown";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const AttendanceLog = () => {
  const [searchCriteria, setSearchCriteria] = useState({});
  const [attendance, setAttendacne] = useState({});
  const [res] = useState([]);

  return (
    <Fragment>
      <Actionbar pageTitle="Attendance Log"></Actionbar>
      <Row className="mt-2">
        <Col>
          <InputGroup>
            <InputGroup.Text>From</InputGroup.Text>
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
          <InputGroup>
            <InputGroup.Text>To</InputGroup.Text>
            <Form.Control
              type="date"
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  toDate: e.target.value,
                })
              }
              value={searchCriteria.toDate}
            />
          </InputGroup>
        </Col>
        <Col>
          <Floor />
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text>Card No</InputGroup.Text>
            <Form.Control
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  cardNo: e.target.value,
                })
              }
              value={searchCriteria.cardNo}
            />
          </InputGroup>
        </Col>
        <Col sm="1" className="text-end">
          <Button>Preview</Button>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover size="sm" striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Employee</th>
                    <th>Date</th>
                    <th>In Time</th>
                    <th>Out Time</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data?.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data?.map((item, index) => (
                    <tr
                      key={item.id}
                      className={
                        item.id === attendance.id ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.employeeName}</td>
                      <td>{item.date.split("T")[0]}</td>
                      <td>{item.inOutTime}</td>
                      <td>{item.remarks}</td>
                      <td>
                        <Button variant="btn btn-sm btn-outline-primary">
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Pagination className="float-end">
                <Pagination.Prev
                  onClick={() =>
                    setSearchCriteria({
                      ...searchCriteria,

                      pageIndex:
                        searchCriteria.pageIndex === 1
                          ? 1
                          : searchCriteria.pageIndex - 1,
                    })
                  }
                />

                <Pagination.Next
                  onClick={() =>
                    setSearchCriteria({
                      ...searchCriteria,

                      pageIndex: searchCriteria.pageIndex + 1,
                    })
                  }
                />
              </Pagination>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default AttendanceLog;
