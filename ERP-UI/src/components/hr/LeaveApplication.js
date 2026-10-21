import { Card, Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { useState, Fragment, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { EmployeeWithCardNo, LeaveType } from "../DropDown";

const LeaveApplication = ({ leaveEntry, setLeaveEntry }) => {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetch(
      process.env.REACT_APP_API_URL +
        "DropDown/GetEmployeeWithCardNoDropDown?" +
        new URLSearchParams({ searchCriteria: leaveEntry.EmployeeCardNo }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setSelectedOption(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [leaveEntry.EmployeeCardNo]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLeaveEntry({ ...leaveEntry, [name]: value });
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setLeaveEntry({});
  };

  const saveLeaveEntry = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = leaveEntry.LeaveApplicationID ? "PUT" : "POST";

    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Leaves", {
      method: methodType,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(leaveEntry),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
        } else {
          response.json().then((data) => {
            toast.error(response.statusText + " - " + data.Message, {
              position: "bottom-right",
            });
          });
        }
        setValidated(false);
        setLoading(false);
        setToggle(!toggle);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSelectChange = (option) => {
    setSelectedOption(option);
    setLeaveEntry({
      ...leaveEntry,
      EmployeeID: option ? option.value : null,
    });
  };

  const dayCalculation = () => {
    let date1 = new Date(leaveEntry.FromDate);
    let date2 = new Date(leaveEntry.ToDate);

    let Difference_In_Time = date2.getTime() - date1.getTime();

    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Difference_In_Days + 1;
  };

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={saveLeaveEntry}
            method="POST"
          >
            <Row className="mb-3">
              <Form.Group as={Col} md={4}>
                <Form.Label>Employee</Form.Label>
                <EmployeeWithCardNo
                  onChange={handleSelectChange}
                  value={selectedOption}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Leave Type</Form.Label>
                <LeaveType
                  onChange={(value, action) =>
                    setLeaveEntry({
                      ...leaveEntry,
                      [action.name]: value ? value.value : null,
                    })
                  }
                  name="LeaveTypeID"
                  selected={leaveEntry.LeaveTypeID}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Leave Balance</Form.Label>
                <Form.Control readOnly />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Application Date</Form.Label>
                <Form.Control
                  onChange={(e) => handleChange(e)}
                  type="date"
                  name="ApplicationDate"
                  value={leaveEntry.ApplicationDate}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>FromDate</Form.Label>
                <Form.Control
                  onChange={(e) => handleChange(e)}
                  type="date"
                  name="FromDate"
                  value={leaveEntry.FromDate}
                  required
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>ToDate</Form.Label>
                <Form.Control
                  onChange={(e) => {
                    handleChange(e);
                    dayCalculation();
                  }}
                  type="date"
                  name="ToDate"
                  value={leaveEntry.ToDate}
                  required
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>Days</Form.Label>
                <Form.Control type="number" value={dayCalculation()} readOnly />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Reason</Form.Label>
                <Form.Control
                  onChange={(e) => handleChange(e)}
                  as="textarea"
                  name="ReasonOfLeave"
                  value={leaveEntry.ReasonOfLeave}
                  required
                />
              </Form.Group>
            </Row>

            <Button variant="light" onClick={handleReset}>
              Reset
            </Button>
            {loading ? (
              <Button variant="primary" className="float-end" disabled>
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
              <Button variant="primary" type="submit" className="float-end">
                Save
              </Button>
            )}
          </Form>
        </Card.Body>
      </Card>

      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default LeaveApplication;
