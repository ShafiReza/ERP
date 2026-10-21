import {
  Card,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  FormControl,
  FormLabel,
  Spinner,
  Table,
  Nav,
  Offcanvas,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, createRef, Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Factory, Role } from "../../components/DropDown";
import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const UserConfig = () => {
  const [user, setUser] = useState({});
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasBody, setCanvasBody] = useState("");
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [password, setPassword] = useState({});
  const [role, setRole] = useState({});
  const [itemExportList, setItemExportList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [res] = useGetAll("Account/GetAllUsers?", searchCriteria, toggle);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleRowClick = (item) => {
    setUser(item);
  };

  const handleClose = () => {
    setShowCanvas(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setUser({ ...user, [name]: value });
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPassword({ ...password, [name]: value });
  };

  const saveUser = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const methodType = user.id ? "PUT" : "POST";
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Account/Register", {
      method: methodType,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        console.log(response);
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

  const resetPassword = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    password.UserId = user.UserId;
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Account/ResetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(password),
    })
      .then((response) => {
        console.log(response);
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
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const changeRole=(e)=>{
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    role.UserId = user.UserId;
    role.PreviousRole = user.Roles
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Account/ResetRole", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(role),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Update Successfuly", {
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

  const headers = [
    { label: "FullName", key: "FullName" },
    { label: "User Name", key: "UserName" },
    { label: "Email", key: "Email" },
    { label: "PhoneNumber", key: "PhoneNumber" },
    { label: "Roles", key: "Roles" },
  ];

  const filteredData = res.data.filter((el) => {
    if (searchText === "") {
      return el;
    } else {
      return (
        el?.FullName?.toLowerCase()?.includes(searchText) ||
        el?.UserName?.toLowerCase()?.includes(searchText) ||
        el?.Email?.toLowerCase()?.includes(searchText) ||
        el?.PhoneNumber?.toString()?.toLowerCase()?.includes(searchText) ||
        el?.Roles?.toLowerCase().includes(searchText) ||
        el?.AccessFailedCount?.toString()?.toLowerCase()?.includes(searchText)
      );
    }
  });

  return (
    <Fragment>
      <Actionbar pageTitle="User Setup">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setCanvasBody("add");
            setShowCanvas(true);
            setUser({});
          }}
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
          Add
        </Nav.Link>
        {user.id && (
          <Nav.Link
            className="nav-link text-primary"
            onClick={() => {
              setShowCanvas(true);
            }}
          >
            <FontAwesomeIcon icon="fa-solid fa-pen" />
            Edit
          </Nav.Link>
        )}
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="User List.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col sm="3">
          <Form.Group>
            <Form.Control
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
              placeholder="Search"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive striped hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>User Name</th>
                    <th>Card No</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Access Failed Count</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="17" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="17" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {filteredData.map((item, index) => (
                    <tr
                      onClick={() => {
                        handleRowClick(item);
                      }}
                      key={item.UserName}
                      className={
                        item.UserName === user.UserName ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.FullName}</td>
                      <td>{item.UserName}</td>
                      <td>{item.CardNo}</td>
                      <td>{item.Email}</td>
                      <td>{item.PhoneNumber}</td>
                      <td>{item.Roles}</td>
                      <td>{item.AccessFailedCount}</td>
                      <td>
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                        
                          onClick={() => {
                            setCanvasBody("resetPassword");
                            setShowCanvas(true);
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-key" title="Change Password"/>
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-primary ms-1"
                        
                          onClick={() => {
                            setCanvasBody("changeRole");
                            setShowCanvas(true);
                          }}
                        >
                           <FontAwesomeIcon icon="fa-solid fa-edit" title="Change Role"/>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-50"
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>User Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              {canvasBody === "add" ? (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveUser}
                  method="POST"
                >
                  <Row className="mb-2">
                    <FormGroup as={Col}>
                      <FormLabel>Name</FormLabel>
                      <FormControl
                        name="FullName"
                        onChange={(e) => handleChange(e)}
                        value={user.FullName}
                        required
                      />
                    </FormGroup>
                    </Row>
                    <Row>

                    <FormGroup as={Col}>
                      <FormLabel>User Name</FormLabel>
                      <FormControl
                        name="UserName"
                        onChange={(e) => handleChange(e)}
                        value={user.UserName}
                        required
                      />
                    </FormGroup>
                    <FormGroup as={Col}>
                      <FormLabel>Card No</FormLabel>
                      <FormControl
                        name="CardNo"
                        onChange={(e) => handleChange(e)}
                        value={user.CardNo}
                        required
                      />
                    </FormGroup>
                  </Row>

                  <Row>
                    <Form.Group as={Col}>
                      <FormLabel>Role</FormLabel>
                      <Role
                        onChange={(value, action) =>
                          setUser({
                            ...user,
                            [action.name]: value ? value.value : null,
                          })
                        }
                        name="Role"
                        required
                      />
                    </Form.Group>

                    <Form.Group as={Col}>
                      <FormLabel>Factory</FormLabel>
                      <Factory
                        onChange={(value, action) => {
                          setUser({
                            ...user,
                            [action.name]: value
                              ? value.value
                              : null
                                  .map((item) => {
                                    return item.value;
                                  })
                                  .join(","),
                          });

                          console.log(user);
                        }}
                        name="Factories"
                        required
                        isMulti={true}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mt-2">
                    <FormGroup as={Col}>
                      <FormLabel>Password</FormLabel>
                      <FormControl
                        name="Password"
                        onChange={(e) => handleChange(e)}
                        type="password"
                        maxLength="30"
                        required
                      />
                    </FormGroup>

                    <FormGroup as={Col}>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl
                        name="ConfirmPassword"
                        onChange={(e) => handleChange(e)}
                        type="password"
                        maxLength="30"
                        required
                      />
                    </FormGroup>
                  </Row>

                  <Row className="mt-2">
                    <FormGroup as={Col}>
                      <FormLabel>Email</FormLabel>
                      <FormControl
                        name="Email"
                        onChange={(e) => handleChange(e)}
                        type="Email"
                        value={user.Email}
                        required
                      />
                    </FormGroup>

                    <FormGroup as={Col}>
                      <FormLabel>Phone</FormLabel>
                      <FormControl
                        name="PhoneNumber"
                        onChange={(e) => handleChange(e)}
                        value={user.PhoneNumber}
                      />
                    </FormGroup>
                  </Row>

                  {loading ? (
                    <Button
                      variant="primary"
                      disabled
                      className="float-end mt-2"
                    >
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
                      {user.id ? "Update" : "Register"}
                    </Button>
                  )}
                </Form>
              ) : null}
              {canvasBody === "resetPassword" ? (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={resetPassword}
                  method="POST"
                >
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        onChange={(e) => handlePasswordChange(e)}
                        type="password"
                        name="NewPassword"
                        required
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control
                        onChange={(e) => handlePasswordChange(e)}
                        type="password"
                        name="ConfirmPassword"
                        required
                      />
                    </Form.Group>
                  </Row>

                  <Button
                    variant="light"
                    type="cancel"
                    as={Col}
                    className="mt-2"
                  >
                    Reset
                  </Button>
                  {loading ? (
                    <Button
                      variant="primary"
                      disabled
                      className="float-end mt-2"
                    >
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
                      Save
                    </Button>
                  )}
                </Form>
              ) : null}
                 {canvasBody === "changeRole" ? (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={changeRole}
                  method="POST"
                >
                  <Row className="mb-3">
                  <Form.Group as={Col}>
                      <FormLabel>Role</FormLabel>
                      <Role
                        onChange={(value, action) =>
                          setRole({
                            ...role,
                            [action.name]: value ? value.value : null,
                          })
                        }
                        name="NewRole"
                        required
                      />
                    </Form.Group>
                  </Row>

                  <Button
                    variant="light"
                    type="cancel"
                    as={Col}
                    className="mt-2"
                  >
                    Reset
                  </Button>
                  {loading ? (
                    <Button
                      variant="primary"
                      disabled
                      className="float-end mt-2"
                    >
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
                      Save
                    </Button>
                  )}
                </Form>
              ) : null}
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default UserConfig;
