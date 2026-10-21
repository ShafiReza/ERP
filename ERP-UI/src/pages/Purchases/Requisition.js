import { useState, createRef, Fragment, useEffect, useCallback } from "react";
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
  Badge,
  InputGroup,
  Offcanvas,
} from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import {
  Item,
  Unit,
  PrimeDepartments,
  Company,
  Requisition as PurChaseRequsition,
} from "../../components/DropDown";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink } from "react-csv";
import RequisitionReport from "../../components/purchase/RequisitionReport";
const csvLink = createRef();

const Requisition = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasBody, setCanvasBody] = useState("");
  const [validated, setValidated] = useState(false);
  const [master, setMaster] = useState({
    requisitionNo: "",
    requisitionDate: new Date().toISOString(),
    status: "",
  });

  const [requisitionDetails, setInputList] = useState([{}]);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllRequisition = useCallback(() => {
    setValidated(false);
    getData(
      "PurchaseRequisition?" + new URLSearchParams(searchCriteria),
      "GET"
    );
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllRequisition();
  }, [getAllRequisition]);

  const handleRowClick = (item) => {
    setMaster(item);
    setInputList(item.requisitionDetails);
  };

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...requisitionDetails];
    list[index][name] = value;

    setInputList(list);
  };

  const handleMaster = (event) => {
    const { name, value } = event.target;

    setMaster({ ...master, [name]: value });
  };

  const removeRowClick = (index) => {
    const list = [...requisitionDetails];
    list.splice(index, 1);
    setInputList(list);
  };

  const addRowClick = () => {
    setInputList([...requisitionDetails, {}]);
  };

  const saveRequisition = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    master.PurchaseRequisitionDetails = requisitionDetails;
    const methodType = master.PurchaseRequisitionID ? "PUT" : "POST";
    saveData("PurchaseRequisition", methodType, master, getAllRequisition);
  };

  const deleteRequisition = () => {
    deleteData("Requisition/" + master.id, "DELETE", null, getAllRequisition);
  };

  const getRequisitionById = (id) => {
    fetch(
      process.env.REACT_APP_API_URL + "PurchaseRequisition/" + id,

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
        setMaster(response);
        setInputList(response.PurchaseRequisitionDetails);
        setShowCanvas(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const headers = [
    { label: "Requisition No", key: "requisitionNo" },
    { label: "Date", key: "requisitionDate" },
    { label: "Status", key: "status" },
  ];
  return (
    <Fragment>
      <Actionbar pageTitle="Requisition">
        <Nav.Link
          onClick={() => {
            setMaster({
              requisitionDate: new Date().toISOString(),
              requisitionNo: "",
            });
            setInputList([{}]);
            setCanvasBody("add");
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
                  <PurChaseRequsition
                    onChange={(value) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        requisitionId: value ? value.value : null,
                        pageIndex: 1,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Select
                    onChange={(e) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        status: e.target.value,
                      })
                    }
                    name="status"
                  >
                    <option value="0">Inapprove</option>
                    <option value="1">Approve</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                  <InputGroup>
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
                  <InputGroup>
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
                        <th>#</th>
                        <th>Requisition No</th>
                        <th>Date</th>
                        <th>Status</th>
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
                      {res.data.map((item, index) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            handleRowClick(item);
                          }}
                          className={
                            item.PurchaseRequisitionID ===
                            master.PurchaseRequisitionID
                              ? "table-active"
                              : ""
                          }
                        >
                          <td>
                            {searchCriteria.pageIndex *
                              searchCriteria.pageSize -
                              searchCriteria.pageSize +
                              index +
                              1}
                          </td>
                          <td>{item.RequisitionNo}</td>
                          <td>{item?.RequisitionDate}</td>
                          <td>
                            <Badge
                              bg={item.status === 1 ? "success" : "danger"}
                            >
                              {item.status ? "Approved" : "Notapproved"}
                            </Badge>
                          </td>
                          <td>
                            {" "}
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setCanvasBody("add");
                                getRequisitionById(item.PurchaseRequisitionID);
                              }}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-edit" />
                            </Button>{" "}
                            <Button
                              variant="btn btn-sm btn-outline-success ms-1"
                              onClick={() => {
                                setCanvasBody("report");
                                getRequisitionById(item.PurchaseRequisitionID);
                              }}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-file-lines" />
                            </Button>
                            <Button
                              variant="btn btn-sm btn-outline-danger ms-1"
                              onClick={deleteRequisition}
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
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {" "}
          <Card>
            <Card.Body>
              {canvasBody === "add" ? (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveRequisition}
                  method="POST"
                >
                  <Row className="mb-3">
                    <Form.Group as={Col} sm={3}>
                      <Form.Label>Requisition No</Form.Label>
                      <Form.Control
                        type="text"
                        name="RequisitionNo"
                        value={master.RequisitionNo}
                        placeholder="Requisition No"
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={3}>
                      <Form.Label>Requisition Date</Form.Label>
                      <Form.Control
                        onChange={(e) => handleMaster(e)}
                        type="date"
                        name="RequisitionDate"
                        value={master?.RequisitionDate?.split("T")[0]}
                        placeholder="Date"
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={3}>
                      <Form.Label>Department</Form.Label>
                      <PrimeDepartments
                        onChange={(value, action) =>
                          setMaster({
                            ...master,

                            [action.name]: value ? value.value : null,
                          })
                        }
                        name="DepartmentID"
                        selected={master.DepartmentID}
                      />
                    </Form.Group>
                    <Form.Group as={Col} sm={3}>
                      <Form.Label>Company</Form.Label>
                      <Company
                        onChange={(value, action) =>
                          setMaster({
                            ...master,

                            [action.name]: value ? value.value : null,
                          })
                        }
                        name="CompanyId"
                        selected={master.CompanyId}
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Table striped size="sm" hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Item</th>
                          <th>Description</th>
                          <th>Quantity</th>
                          <th>Unit</th>
                          <th>Unit Price</th>
                          <th>Total Price</th>
                          <th>
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              onClick={addRowClick}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                            </Button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {requisitionDetails?.map((x, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td className="col-sm-3">
                                <Form.Group>
                                  <Item
                                    onChange={(value) => {
                                      x.ItemID = value ? value.value : null;
                                      setInputList([...requisitionDetails]);
                                      // handleItemChange(
                                      //   i,
                                      //   value ? value.value : null
                                      // );
                                    }}
                                    name="ItemID"
                                    selected={x.ItemID}
                                  />
                                </Form.Group>
                              </td>
                              <td>
                                <Form.Group>
                                  <Form.Control
                                    onChange={(e) => handleChange(e, i)}
                                    name="ProductDescription"
                                    value={x.ProductDescription}
                                    required
                                  />
                                </Form.Group>
                              </td>
                              <td>
                                <Form.Group>
                                  <Form.Control
                                    onChange={(e) => handleChange(e, i)}
                                    type="number"
                                    name="Quantity"
                                    value={x.Quantity}
                                    required
                                  />
                                </Form.Group>
                              </td>
                              <td>
                                <Form.Group>
                                  <Unit
                                    onChange={(value) => {
                                      x.UnitID = value ? value.value : null;
                                      setInputList([...requisitionDetails]);
                                    }}
                                    name="UnitID"
                                    selected={x.UnitID}
                                  />
                                </Form.Group>
                              </td>

                              <td>
                                <Form.Group>
                                  <Form.Control
                                    onChange={(e) => handleChange(e, i)}
                                    type="number"
                                    name="UnitPrice"
                                    value={x.UnitPrice}
                                  />
                                </Form.Group>
                              </td>

                              <td>{x.UnitPrice * x.Quantity}</td>

                              <td>
                                <Button
                                  variant="btn btn-sm btn-outline-danger"
                                  onClick={() => removeRowClick(i)}
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
                  {reqResponse.loading ? (
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
              ) : null}
              {canvasBody === "report" ? (
                <RequisitionReport
                  master={master}
                  requisitionDetails={requisitionDetails}
                />
              ) : null}
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default Requisition;
