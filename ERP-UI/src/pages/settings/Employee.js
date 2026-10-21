import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Table,
  Nav,
  Offcanvas,
  Pagination,
  Dropdown,
  FormGroup,
} from "react-bootstrap";

import { useState, createRef, Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import Dialog from "../../components/Dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Designation,
  Department,
  Section,
  SalaryGrade,
  Branch,
  ProductionUnit,
  Gender,
  MaritalStatus,
  Shift,
  EmployeeType,
  EmployeeWithCardNo,
} from "../../components/DropDown";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const EmployeeSetup = () => {
  const [employee, setEmployee] = useState({});
  const [employeeSalary, setEmployeeSalary] = useState({ employeeId: "" });
  const [employeeSalaryList, setEmployeeSalaryList] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [flag, setFlag] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [grossWage, setGrossWage] = useState(0);
  const [otRate, setOtRate] = useState(0);
  const [salaryIncrement, setSalaryIncrement] = useState({});
  const [promotion, setPromotion] = useState({});
  const [reason, setReason] = useState("");
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [res] = useGetAll("Employees?", searchCriteria, toggle);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };
  const handleDialogNo = () => {
    setShowDialog(false);
    setValidated(false);
  };
  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setEmployee({});
  };

  const handleClose = () => {
    setShowCanvas(false);
    setEmployeeSalaryList([]);
    setSalaryIncrement({});
    setPromotion({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEmployee({ ...employee, [name]: value });
  };

  const handleSalaryIncrement = (event) => {
    let { name, value } = event.target;
    if (name === "IncrementAmount") {
      value = parseFloat(value);
    }
    setSalaryIncrement({
      ...salaryIncrement,
      EmployeeID: employee.EmployeeID,
      [name]: value,
    });
  };

  const handlePromotion = (event) => {
    let { name, value } = event.target;
    setPromotion({
      ...promotion,
      EmployeeID: employee.EmployeeID,
      [name]: value,
    });
  };

  const handleGrossWageChange = (e) => {
    setGrossWage(e.target.value);
    let salaryWithoutAllowance = parseInt(e.target.value) - 1850;
    let houseRent = salaryWithoutAllowance / 3;
    let basicSalary = houseRent * 2;
    setOtRate(parseInt(basicSalary / 104));
    let list = [...employeeSalaryList];
    let tempList = list.map((ele) => {
      if (ele.SalaryTypeName === "Food Allowance") {
        ele.Amount = 900;
      } else if (ele.SalaryTypeName === "Medical Allowance") {
        ele.Amount = 600;
      } else if (ele.SalaryTypeName === "Conveyance") {
        ele.Amount = 350;
      } else if (ele.SalaryTypeName === "Basic Salary") {
        ele.Amount = parseInt(basicSalary);
      } else if (ele.SalaryTypeName === "House Rent") {
        ele.Amount = parseInt(houseRent);
      }
      return ele;
    });
    setEmployeeSalaryList(tempList);
  };

  const handleSalaryChange = (event, index) => {
    let list = [...employeeSalaryList];
    list[index].Amount = parseInt(event.target.value);

    setEmployeeSalaryList(list);
  };

  const clickSalaryAdd = () => {
    fetch(
      process.env.REACT_APP_API_URL +
        "Employees/GetEmployeeSalary?" +
        new URLSearchParams({ id: employee.EmployeeID }),
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
        setEmployeeSalary(result);
        setEmployeeSalaryList(result);
        result.forEach((item) => {
          if (item.SalaryTypeName === "Basic Salary") {
            setOtRate(parseInt(item.Amount / 104));
          }
        });
        let temp = result.reduce((tot, it) => {
          if (it.Amount) {
            tot += it.Amount;
          }
          return tot;
        }, 0);
        setGrossWage(temp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveEmployee = (e) => {
    if (flag === "Employee") {
      e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }

      const methodType = employee.EmployeeID ? "PUT" : "POST";
      setLoading(true);
      fetch(process.env.REACT_APP_API_URL + "Employees", {
        method: methodType,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(employee),
      })
        .then((response) => {
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
    }
  };

  const inActiveEmployee = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    fetch(process.env.REACT_APP_API_URL + "Employees", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        EmployeeID: employee.EmployeeID,
        Reason: reason,
        InActiveType: 3,
        ApplicableDate: new Date(),
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Deleted Successfuly", {
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
        setToggle(!toggle);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveEmployeeSalary = (e) => {
    e.preventDefault();
    if (flag === "Salary") {
      e.preventDefault();
      const form = e.currentTarget;
      if (form.checkValidity() === false) {
        e.stopPropagation();
        setValidated(true);
        return;
      }
      setLoading(true);
      fetch(process.env.REACT_APP_API_URL + "Employees/EmployeeSalary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          EmployeeID: employeeSalaryList[0].EmployeeID,
          SalaryList: employeeSalaryList,
        }),
      })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Data Added Successfuly", {
              position: "bottom-right",
            });
          } else {
            toast.error(response.statusText + "(" + response.status + ")", {
              position: "bottom-right",
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
    }
  };

  const saveSalaryIncrement = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Employees/SalaryIncrement", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(salaryIncrement),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
        } else {
          toast.error(response.statusText + "(" + response.status + ")", {
            position: "bottom-right",
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

  const savePromotion = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Employees/Promotion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(promotion),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
        } else {
          toast.error(response.statusText + "(" + response.status + ")", {
            position: "bottom-right",
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

  const headers = [
    { label: "Employee Name", key: "employeeName" },
    { label: "Department", key: "departmentId" },
    { label: "Designation", key: "designationId" },
    { label: "Section", key: "sectionId" },
    { label: "Branch", key: "branchId" },
    { label: "Production Floor", key: "productionFloorLineId" },
    { label: "Shift", key: "shiftId" },
    { label: "Mobile No", key: "mobileNo" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Employee">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setEmployee({});
            setFlag("Employee");
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="ItemList.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col>
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
        <Col>
          <Form.Group>
            <Department
              onChange={(value, action) =>
                setSearchCriteria({
                  ...searchCriteria,
                  [action.name]: value ? value.value : null,
                })
              }
              name="departmentId"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Designation
              onChange={(value, action) =>
                setSearchCriteria({
                  ...searchCriteria,
                  [action.name]: value ? value.value : null,
                })
              }
              name="designationId"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Section
              onChange={(value, action) =>
                setSearchCriteria({
                  ...searchCriteria,
                  [action.name]: value ? value.value : null,
                })
              }
              name="sectionId"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <ProductionUnit
              onChange={(value, action) =>
                setSearchCriteria({
                  ...searchCriteria,
                  [action.name]: value ? value.value : null,
                })
              }
              name="floorId"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table hover size="sm" striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Card No</th>
                    <th>Type</th>
                    <th>Department</th>
                    <th>Designation Name</th>
                    <th>Section</th>
                    <th>Branch</th>
                    <th>Gross Wage</th>
                    <th>OT Rate</th>
                    <th>Production Unit</th>
                    <th>Shift</th>
                    <th>Contact</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="19" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data?.length === 0 && (
                    <tr>
                      <td colSpan="19" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data?.map((item, index) => (
                    <tr
                      onClick={() => {
                        setEmployee(item);
                        setEmployeeSalary({
                          ...employeeSalary,
                          id: item.employeeSalaryId,
                        });
                      }}
                      key={item.EmployeeID}
                      className={
                        item.EmployeeID === employee.EmployeeID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>
                        {searchCriteria.pageIndex * searchCriteria.pageSize -
                          searchCriteria.pageSize +
                          index +
                          1}
                      </td>
                      <td>{item.EmployeeName}</td>
                      <td>{item.CardNo}</td>
                      <td>
                        {item.EmployeeType === 1
                          ? "Worker"
                          : item.EmployeeType === 2
                          ? "Staff"
                          : ""}
                      </td>
                      <td>{item.DepartmentName}</td>
                      <td>{item.DesignationName}</td>
                      <td>{item.SectionName}</td>
                      <td>{item.BranchName}</td>
                      <td></td>
                      <td></td>
                      <td>{item.ProductionFloorLineName}</td>
                      <td>{item.ShiftName}</td>
                      <td>{item.MobileNo}</td>
                      <td className="d-flex">
                        <Button
                          variant="btn btn-sm btn-outline-success ms-1"
                          onClick={() => setShowDialog(true)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
                        </Button>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="btn btn-sm btn-outline-success ms-1"
                            id="dropdown-basic"
                          >
                            <FontAwesomeIcon icon="fa-solid fa-ellipsis" />
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                setShowCanvas(true);
                                setFlag("Salary");
                                clickSalaryAdd();
                              }}
                              className="border-bottom"
                            >
                              <FontAwesomeIcon
                                icon="fa-solid fa-angle-right"
                                className="text-primary"
                              />{" "}
                              Salary Setup
                            </Dropdown.Item>

                            <Dropdown.Item
                              onClick={() => {
                                setShowCanvas(true);
                                setFlag("promotion");
                              }}
                              className="border-bottom"
                            >
                              <FontAwesomeIcon
                                icon="fa-solid fa-angle-right"
                                className="text-primary"
                              />{" "}
                              Promotion
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setShowCanvas(true);
                                setFlag("increment");
                              }}
                              className="border-bottom"
                            >
                              <FontAwesomeIcon
                                icon="fa-solid fa-angle-right"
                                className="text-primary"
                              />{" "}
                              Increment
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => {
                                setShowCanvas(true);
                                setFlag("Employee");
                              }}
                              className="border-bottom"
                            >
                              <FontAwesomeIcon
                                icon="fa-solid fa-angle-right"
                                className="text-primary"
                              />{" "}
                              Profile Setup
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
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
        className="w-75"
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {flag === "Employee" && "Employee Profile"}
            {flag === "Salary" && "Salary Setup"}
            {flag === "promotion" && "Promotion Setup"}
            {flag === "increment" && "Increment SAetup"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {flag === "Employee" && (
            <Form
              noValidate
              validated={validated}
              onSubmit={saveEmployee}
              method="POST"
            >
              <Row className="mb-2">
                <Form.Group as={Col} sm="6">
                  <Form.Label>Card No</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="CardNo"
                    value={employee.CardNo}
                    required
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="EmployeeName"
                    value={employee.EmployeeName}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Name Bengali</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="text"
                    name="EmployeeNameBN"
                    value={employee.EmployeeNameBN}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Department</Form.Label>
                  <Department
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="DepartmentID"
                    selected={employee.DepartmentID}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Designation</Form.Label>
                  <Designation
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="DesignationID"
                    selected={employee.DesignationID}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Section</Form.Label>
                  <Section
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="SectionID"
                    selected={employee.SectionID}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Salary Grade</Form.Label>
                  <SalaryGrade
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="SalaryGrade"
                    selected={employee.SalaryGrade}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Branch</Form.Label>
                  <Branch
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="BranchID"
                    selected={employee.BranchID}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Production Unit</Form.Label>
                  <ProductionUnit
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="ProductionFloorLineID"
                    selected={employee.ProductionFloorLineID}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Joining Date</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    type="Date"
                    name="JoinDate"
                    value={employee.JoinDate}
                    required
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Gender</Form.Label>
                  <Gender
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="GenderId"
                    selected={employee.GenderID}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Mobile No</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="MobileNo"
                    value={employee.MobileNo}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Mobile Financial Service</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="MFSType"
                    value={employee.MFSType}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>MFS No</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="MFSNo"
                    value={employee.MFSNo}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Marital Status</Form.Label>
                  <MaritalStatus
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="MaritalStatus"
                    selected={employee.MaritalStatus}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Emargency Contact No</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="EmergencyContactNo"
                    value={employee.emergencyContactNo}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Spouse Name</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="SpouseName"
                    value={employee.spouseName}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Spouse Name Bangla</Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e)}
                    name="SpouseNameBN"
                    value={employee.SpouseNameBN}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Shift</Form.Label>
                  <Shift
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="ShiftId"
                    selected={employee.ShiftId}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Employee Type</Form.Label>
                  <EmployeeType
                    onChange={(value, action) =>
                      setEmployee({
                        ...employee,
                        [action.name]: value ? value.value : null,
                      })
                    }
                    name="EmployeeType"
                    selected={employee.EmployeeType}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Check
                    inline
                    label="Is Active"
                    name="IsActive"
                    type="checkbox"
                    className="mt-4"
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Check
                    inline
                    label="OT Applicable"
                    name="OtApplicable"
                    type="checkbox"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Check
                    inline
                    label="Attendance Bonus"
                    name="AttendanceBonusApplicable"
                    type="checkbox"
                  />
                </Form.Group>
              </Row>

              <Button
                variant="light"
                onClick={handleReset}
                type="cancel"
                as={Col}
                className="mt-2"
              >
                Reset
              </Button>
              {loading ? (
                <Button variant="primary" disabled className="float-end mt-2">
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
                <Button
                  variant="primary"
                  type="submit"
                  className="float-end mt-2"
                >
                  {employee.id ? "Update" : "Save"}
                </Button>
              )}
            </Form>
          )}

          {flag === "Salary" && (
            <Card>
              <Card.Body>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveEmployeeSalary}
                  method="POST"
                >
                  <Row>
                    <h5>
                      {employee.EmployeeName} ({employee.CardNo})
                    </h5>
                  </Row>
                  <Row className="mt-2 mb-2">
                    {employeeSalaryList.map((item, index) => (
                      <Col sm="6" key={index}>
                        <FormGroup>
                          <Form.Label>{item.SalaryTypeName}</Form.Label>
                          <Form.Control
                            type="number"
                            onChange={(e) => handleSalaryChange(e, index)}
                            value={item.Amount}
                            required
                          />
                        </FormGroup>
                      </Col>
                    ))}
                    <Col sm="3">
                      <FormGroup>
                        <Form.Label>Gross Wage</Form.Label>
                        <Form.Control
                          type="number"
                          onChange={(e) => handleGrossWageChange(e)}
                          value={grossWage}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Form.Label>OT Rate</Form.Label>
                        <Form.Control type="number" value={otRate} readOnly />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Button
                    variant="light"
                    type="cancel"
                    onClick={handleReset}
                    as={Col}
                  >
                    Reset
                  </Button>
                  {loading ? (
                    <Button variant="primary" disabled className="float-end">
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
                    <Button
                      variant="primary"
                      type="submit"
                      className="float-end"
                    >
                      Save
                    </Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          )}

          {flag === "promotion" && (
            <Form
              noValidate
              validated={validated}
              onSubmit={savePromotion}
              method="POST"
            >
              <Row>
                <h5>
                  {employee.employeeName} {employee.cardNo}
                </h5>
              </Row>
              <Row className="mb-2 mt-2">
                <Form.Group as={Col}>
                  <Form.Label>Previous Designation</Form.Label>
                  <Designation
                    onChange={(value, action) =>
                      setPromotion({
                        ...promotion,
                        [action.name]: value.value,
                      })
                    }
                    name="PreviousDesignationID"
                    selected={promotion.PreviousDesignationID}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>New Designation</Form.Label>
                  <Designation
                    onChange={(value, action) =>
                      setPromotion({
                        ...promotion,
                        [action.name]: value.value,
                      })
                    }
                    name="NewDesignationID"
                    selected={promotion.NewDesignationID}
                  />
                </Form.Group>
              </Row>
              <Row className="mb-2">
                <Form.Group as={Col}>
                  <Form.Label>Promotion Date</Form.Label>

                  <Form.Control
                    type="Date"
                    onChange={(e) => handlePromotion(e)}
                    value={promotion.PromotionDate}
                    name="PromotionDate"
                    required
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>Remarks</Form.Label>

                  <Form.Control
                    onChange={(e) => handlePromotion(e)}
                    value={promotion.Remarks}
                    name="Remarks"
                  />
                </Form.Group>
              </Row>

              <Button
                variant="light"
                type="cancel"
                onClick={handleReset}
                as={Col}
              >
                Reset
              </Button>
              {loading ? (
                <Button variant="primary" disabled className="float-end">
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
          )}
          {flag === "increment" && (
            <Form
              noValidate
              validated={validated}
              onSubmit={saveSalaryIncrement}
              method="POST"
            >
              <Row>
                <h5>
                  {employee.employeeName} {employee.cardNo}
                </h5>
              </Row>
              <Row className="mb-2 mt-2">
                <Form.Group as={Col}>
                  <Form.Label>Increment Date</Form.Label>

                  <Form.Control
                    type="date"
                    onChange={(e) => handleSalaryIncrement(e)}
                    value={salaryIncrement.IncrementDate}
                    name="IncrementDate"
                    required
                  />
                </Form.Group>

                <Form.Group as={Col} sm="6">
                  <Form.Label>Increment Amount</Form.Label>

                  <Form.Control
                    type="number"
                    onChange={(e) => handleSalaryIncrement(e)}
                    value={salaryIncrement.IncrementAmount}
                    name="IncrementAmount"
                    required
                  />
                </Form.Group>
              </Row>

              <Button
                variant="light"
                type="cancel"
                onClick={handleReset}
                as={Col}
              >
                Reset
              </Button>
              {loading ? (
                <Button variant="primary" disabled className="float-end">
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
          )}
        </Offcanvas.Body>
      </Offcanvas>
      <Dialog showDialog={showDialog} handleDialogNo={handleDialogNo}>
        <Card>
          <Card.Body>
            Do you want to inactive this item?
            <Form
              noValidate
              validated={validated}
              onSubmit={inActiveEmployee}
              method="POST"
            >
              <Form.Group>
                <Form.Label>Reason</Form.Label>

                <Form.Control
                  onChange={(e) => setReason(e.target.value)}
                  name="Reason"
                  required
                />
              </Form.Group>
              <Button variant="light" onClick={handleDialogNo} className="mt-2">
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="float-end mt-2"
              >
                Save
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Dialog>

      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default EmployeeSetup;
