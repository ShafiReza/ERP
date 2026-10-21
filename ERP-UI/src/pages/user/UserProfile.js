import { Fragment, useCallback, useEffect, useState } from "react";
import { Card, Row, Col, Table, Nav, Button, Spinner } from "react-bootstrap";
import useFetch from "../../components/hooks/useFetch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Actionbar from "../../components/layout/Actionbar";
import AttendanceComp from "../../components/hr/AttendanceComp";
import PaySlip from "../../components/hr/PaySlip";
import LeaveApplication from "../../components/hr/LeaveApplication";

const UserProfile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [flag, setFlag] = useState("Attendance");
  const [res, getData] = useFetch();
  const [leaveEntry, setLeaveEntry] = useState({});

  const getLeaveBalance = useCallback(() => {
    getData("Leave/GetLeaveBalance?cardNo=" + user.cardNo, "GET");
  }, [getData, user.cardNo]);

  useEffect(() => {
    getLeaveBalance();
  }, [getLeaveBalance]);

  return (
    <Fragment>
      <Actionbar pageTitle="User Profile">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => setFlag("Attendance")}
        >
          <FontAwesomeIcon icon="fa-solid fa-fingerprint" /> Attendance
        </Nav.Link>
        <Nav.Link
          className="nav-link text-success"
          onClick={() => setFlag("Leave")}
        >
          <FontAwesomeIcon icon="fa-solid fa-person-walking-arrow-right" />{" "}
          Leave
        </Nav.Link>
        {/* <Nav.Link
          className="nav-link text-secondary"
          onClick={() => setFlag("PaySlip")}
        >
          <FontAwesomeIcon icon="fa-solid fa-receipt" /> Pay Slip
        </Nav.Link> */}
      </Actionbar>
      <Row className="mt-2">
        <Col sm="3">
          <Card className="min-vh-100 mb-2">
            <Card.Body>
              <div className="text-center mb-3">
                <h5 className="fw-bold">
                  {user?.fullName} @{user?.userName}
                </h5>
                <h6>
                  {user?.cardNo} - {user?.role}
                </h6>
              </div>

              <Table striped hover size="sm" className="caption-top">
                <caption>Leave Summary:</caption>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Days</th>
                    <th>Taken</th>
                    <th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {res.data?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.LeaveTypeName}</td>
                      <td>{item.LeaveDays}</td>
                      <td>{item.LeaveTaken}</td>
                      <td>{item.LeaveBalance}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Table striped hover size="sm" className="caption-top">
                <caption>Leave Application:</caption>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>From Date</th>
                    <th>To Date</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data?.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data?.map((item, index) => (
                    <tr
                      key={item.LeaveApplicationID}
                      className={
                        item.LeaveApplicationID ===
                        leaveEntry.LeaveApplicationID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{item.EmployeeName}</td>
                      <td>{item.LeaveTypeName}</td>
                      <td>{item?.FromDate?.split("T")[0]}</td>
                      <td>{item?.ToDate?.split("T")[0]}</td>
                      <td>{item?.ApplicationDate?.split("T")}</td>

                      <td>{item.ReasonOfLeave}</td>
                      <td>{item.Status === 0 ? "Pending" : "Approved"}</td>
                      <td>
                        <Button variant="btn btn-sm btn-outline-primary">
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col sm="9">
          {flag === "Attendance" && <AttendanceComp />}
          {flag === "Leave" && (
            <LeaveApplication
              leaveEntry={leaveEntry}
              setLeaveEntry={setLeaveEntry}
            />
          )}
          {flag === "PaySlip" && <PaySlip />}
        </Col>
      </Row>
    </Fragment>
  );
};

export default UserProfile;
