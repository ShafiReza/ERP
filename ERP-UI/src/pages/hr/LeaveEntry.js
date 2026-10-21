import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  Nav,
  Offcanvas,
  Pagination,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import { useState, Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDialog from "../../components/ConfirmDialog";
import { EmployeeWithCardNo } from "../../components/DropDown";
import LeaveApplication from "../../components/hr/LeaveApplication";

const LeaveEntry = () => {
  const [leaveEntry, setLeaveEntry] = useState({});
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    toggle: false,
  });

  const [res] = useGetAll("Leaves?", searchCriteria, toggle);

  const handleClose = () => {
    setShowCanvas(false);
    setSearchCriteria((pre) => {
      return {
        ...pre,
        toggle: !pre.toggle,
      };
    });
  };

  const handleRowClick = (item) => {
    item.startDate = item.startDate?.split("T")[0];
    item.endDate = item.endDate?.split("T")[0];
    setLeaveEntry(item);
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const handleDialogYes = () => {
    fetch(process.env.REACT_APP_API_URL + "EmployeeLeave/" + leaveEntry.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      setShowDialog(false);
      toast.warn("Data Deleted", {
        position: "bottom-right",
      });
    });
  };

  const removeRowClick = (e, index, item) => {
    e.preventDefault();
    e.stopPropagation();
    fetch(process.env.REACT_APP_API_URL + "EmployeeLeave", {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          toast.success("Data Delete Successfuly", {
            position: "bottom-right",
          });
        } else {
          toast.error(response.statusText + "(" + response.status + ")", {
            position: "bottom-right",
          });
        }
        setToggle(!toggle);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment>
      <Actionbar pageTitle="LeaveEntry">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setLeaveEntry({});
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
        {leaveEntry.id && (
          <Nav.Link
            className="nav-link text-primary"
            onClick={() => setShowCanvas(true)}
          >
            <FontAwesomeIcon icon="fa-solid fa-pen" /> Edit
          </Nav.Link>
        )}

        <NavLink to="/support" className="nav-link text-success">
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </NavLink>
        {leaveEntry.id && (
          <Nav.Link
            className="nav-link text-danger"
            onClick={() => {
              setShowDialog(true);
              setLeaveEntry({});
            }}
          >
            <FontAwesomeIcon icon="fa-solid fa-trash-can" /> Delete
          </Nav.Link>
        )}
      </Actionbar>
      <Row className="mt-2">
        <Col sm="3">
          <Form.Group>
            <EmployeeWithCardNo
              onChange={(value) =>
                setSearchCriteria({
                  ...searchCriteria,
                  employeeId: value ? value.value : null,
                })
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsiv hover size="sm" striped>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>Leave Type</th>
                    <th>From Date</th>
                    <th>To Date</th>
                    <th>Application Date</th>

                    <th>Reason</th>
                    <th>Status</th>
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
                      onClick={() => {
                        handleRowClick(item);
                      }}
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
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => setShowCanvas(true)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-danger ms-1"
                          onClick={(e) => removeRowClick(e, index, item)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-trash-can" />
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
      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-50"
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Leave Application</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <LeaveApplication
            leaveEntry={leaveEntry}
            setLeaveEntry={setLeaveEntry}
          />
        </Offcanvas.Body>
      </Offcanvas>
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogYes={handleDialogYes}
        handleDialogNo={handleDialogNo}
      />
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default LeaveEntry;
