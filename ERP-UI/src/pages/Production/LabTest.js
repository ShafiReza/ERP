import { useState, createRef, Fragment } from "react";
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
  Badge,
  Offcanvas,
} from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import { Item } from "../../components/DropDown";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink } from "react-csv";
const csvLink = createRef();
const LabTest = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [validated, setValidated] = useState(false);
  const [master, setMaster] = useState({
    testDate: new Date().toISOString(),
  });
  const [labTestDetails, setInputList] = useState([
    {
      criteriaId: "",
      standard: "",
      curentValue: "",
      tolerance: "",
      status: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [res] = useGetAll("LabTest?", searchCriteria, toggle);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleRowClick = (item) => {
    setMaster(item);
    setInputList(item.labTestDetails);
  };

  const handleItemChange = (value) => {
    setMaster({ ...master, itemId: value });
    fetch(
      process.env.REACT_APP_API_URL +
        "ItemCriteria?" +
        new URLSearchParams({
          pageIndex: 1,
          pageSize: 10,
          itemId: value,
        }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((result) => {
        let arr = [];
        result.forEach((element) => {
          arr.push({
            criteriaId: element.criteriaId,
            standard: element.value,
            currentValue: element.CurrentValue,
            status: element.status,
            tolerance: element.tolerance,
          });
        });
        setInputList(arr);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...labTestDetails];
    list[index][name] = value;

    var percent = list[index].currentValue
      ? (list[index].standard * list[index].tolerance) / 100
      : 0;
    if (
      list[index].standard + percent >= list[index].currentValue &&
      list[index].standard - percent <= list[index].currentValue
    ) {
      list[index].status = 1;
    } else {
      list[index].status = 0;
    }
    setInputList(list);
  };

  const handleMaster = (event) => {
    const { name, value } = event.target;
    setMaster({ ...master, [name]: value });
  };

  const removeRowClick = (index) => {
    const list = [...labTestDetails];
    list.splice(index, 1);
    setInputList(list);
  };

  const removeMasterRowClick = (e, index, item) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(item);
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "LabTest", {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(item),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Delete Successfuly", {
            position: "bottom-right",
          });
        } else {
          toast.error(response.statusText + "(" + response.status + ")", {
            position: "bottom-right",
          });
        }
        setLoading(false);
        setToggle(!toggle);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  const addRowClick = () => {
    setInputList([
      ...labTestDetails,
      {
        criteriaId: "",
        standard: "",
        tolerance: "",
        curentValue: "",
        status: "",
      },
    ]);
  };

  const saveLabTest = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setLoading(true);
      e.preventDefault();
      master.labTestDetails = labTestDetails;
      var methodType = master.id ? "PUT" : "POST";
      fetch(process.env.REACT_APP_API_URL + "LabTest", {
        method: methodType,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(master),
      })
        .then((res) => res.json())
        .then((result) => {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
          console.log(result);
          setMaster({ ...master, labTestNo: result });
          setToggle(!toggle);
          setValidated(false);
          setLoading(false);
        });
    }
    setValidated(true);
  };
  const headers = [
    { label: "Year", key: "labTestNo" },
    { label: "Month", key: "labeName" },
    { label: "Employee", key: "testDate" },
    { label: "Basic Salary", key: "itemName" },
  ];
  return (
    <Fragment>
      <Actionbar pageTitle="Lab Test">
        <Nav.Link
          onClick={() => {
            setMaster({
              testDate: new Date().toISOString(),
            });
            setInputList([
              {
                criteriaId: "",
                standard: "",
                tolerance: "",
                curentValue: "",
                status: "",
              },
            ]);
            setShowCanvas(true);
          }}
          className="nav-link text-primary"
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
          <Row className="mb-2">
            <Col>
              <Row>
                <Form.Group as={Col}>
                  <Form.Control
                    onChange={(e) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        labTestNo: e.target.value,
                      })
                    }
                    type="text"
                    name="labTestNo"
                    placeholder="Lab Test No"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Item
                    onChange={(value, action) => {
                      setSearchCriteria({
                        ...searchCriteria,
                        [action.name]:value ? value.value : null,
                      });
                    }}
                    name="itemId"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>From</InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        setSearchCriteria({
                          ...searchCriteria,
                          fromDate: e.target.value,
                        })
                      }
                      type="date"
                      name="fromDate"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col}>
                  <InputGroup className="mb-3">
                    <InputGroup.Text>To</InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        setSearchCriteria({
                          ...searchCriteria,
                          toDate: e.target.value,
                        })
                      }
                      type="date"
                      name="toDate"
                    />
                  </InputGroup>
                </Form.Group>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Table responsive hover size="sm" striped>
                    <thead>
                      <tr>
                        <th>Lab Test No</th>
                        <th>Lab name</th>
                        <th>Test Date</th>
                        <th>Item</th>
                      </tr>
                    </thead>
                    <tbody>
                      {res.dataLoading && (
                        <tr>
                          <td colSpan="4" className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      )}
                      {!res.dataLoading && res.data?.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {res.data?.map((item, index) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            handleRowClick(item);
                          }}
                          className={
                            item.id === master.id ? "table-active" : ""
                          }
                        >
                          <td>{item.labTestNo}</td>
                          <td>{item.labeName}</td>
                          <td>{item.testDate.split("T")[0]}</td>
                          <td>{item.itemName}</td>
                          <td>
                            {" "}
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              onClick={() => setShowCanvas(true)}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-edit" />
                            </Button>
                          </td>
                          <td>
                            {" "}
                            <Button
                              variant="btn btn-sm btn-outline-danger"
                              type=""
                              onClick={(e) =>
                                removeMasterRowClick(e, index, item)
                              }
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
        </Col>
      </Row>

      <Offcanvas
        show={showCanvas}
        onHide={() => setShowCanvas(false)}
        placement="end"
        className="w-75"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {" "}
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveLabTest}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} sm={2}>
                    <Form.Control
                      type="text"
                      name="labTestNo"
                      value={master.labTestNo}
                      placeholder="Lab Test No"
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={2}>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      type="text"
                      name="labeName"
                      value={master.labeName}
                      placeholder="Lab Test Name"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={2}>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      type="date"
                      name="testDate"
                      value={master.testDate.split("T")[0]}
                      placeholder="Test Date"
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm={2}>
                    <Item onChange={(value) => handleItemChange(value ? value.value : null,)} />
                  </Form.Group>
                  <Form.Group as={Col} sm={2}></Form.Group>
                </Row>

                <Row className="mb-3">
                  <Table striped hover size="sm" responsive>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Criteria</th>
                        <th>Standard</th>
                        <th>Tolerance</th>
                        <th>Current Value</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {labTestDetails.map((x, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>
                              <Form.Select
                                onChange={(e) => {
                                  x.criteriaId = e.target.value;
                                  setInputList([...labTestDetails]);
                                }}
                                aria-label="Default select example"
                                value={x.criteriaId}
                                name="criteriaId"
                              >
                                <option value="0">Select Criteria</option>
                                <option value="1">Protin</option>
                                <option value="2">Calorin</option>
                                <option value="3">Vitamin</option>
                                <option value="4">Zink</option>
                                <option value="5">Iron</option>
                                <option value="6">Carbon</option>
                              </Form.Select>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Control
                                  onChange={(e) => handleChange(e, i)}
                                  type="number"
                                  name="standard"
                                  value={x.standard}
                                  readOnly
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Control
                                  onChange={(e) => handleChange(e, i)}
                                  type="number"
                                  name="tolerance"
                                  value={x.tolerance}
                                  readOnly
                                />
                              </Form.Group>
                            </td>
                            <td>
                              <Form.Group>
                                <Form.Control
                                  onChange={(e) => handleChange(e, i)}
                                  type="number"
                                  name="currentValue"
                                  value={x.currentValue}
                                  required
                                />
                              </Form.Group>
                            </td>

                            <td>
                              {" "}
                              <Badge bg={x.status ? "success" : "danger"}>
                                {x.status ? "OK" : "Wrong"}
                              </Badge>
                            </td>

                            <td>
                              <Button
                                variant="primary"
                                type=""
                                onClick={addRowClick}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                              </Button>{" "}
                              <Button
                                variant="danger"
                                type=""
                                onClick={(e) => removeRowClick(i)}
                              >
                                <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Row>

                <Button variant="light" type="submit" as={Col} sm={1}>
                  Cancel
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
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default LabTest;
