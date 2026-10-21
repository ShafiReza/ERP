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
  Offcanvas,
} from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import { Item, Unit, Store } from "../../components/DropDown";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const StoreTransfer = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [validated, setValidated] = useState(false);
  const [master, setMaster] = useState({
    storeTransferNo: "",
    transferDate: new Date().toISOString(),
    status: "",
    storeTransferDetails: [{}],
  });

  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [res] = useGetAll("StoreTransfer?", searchCriteria, toggle);

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
  };

  const handleItemChange = (index, value) => {
    fetch(process.env.REACT_APP_API_URL + "Item/" + value, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        let list = [...master.storeTransferDetails];
        list[index]["unitId"] = result.unitId;

        list[index]["unitPrice"] = result.unitPrice;

        setMaster({ ...master, storeTransferDetails: list });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...master.storeTransferDetails];
    list[index][name] = value;

    setMaster({ ...master, storeTransferDetails: list });
  };

  const handleMaster = (event) => {
    const { name, value } = event.target;

    setMaster({ ...master, [name]: value });
  };

  const removeRowClick = (index) => {
    const list = [...master.storeTransferDetails];
    list.splice(index, 1);
    setMaster({ ...master, storeTransferDetails: list });
  };

  const removeMasterRowClick = (e, index, item) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(item);
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "StoreTransfer", {
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
    setMaster({
      ...master,
      storeTransferDetails: [
        ...master.storeTransferDetails,
        {
          itemId: "",
          quantity: "",
          unitId: "",
        },
      ],
    });
  };

  const saveStoreTransfer = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setLoading(true);
      e.preventDefault();
      const methodType = master.id ? "PUT" : "POST";
      fetch(process.env.REACT_APP_API_URL + "StoreTransfer", {
        method: methodType,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(master),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response !== null) {
            toast.success("Data Added Successfuly", {
              position: "bottom-right",
            });
          } else {
            toast.error("Data Not Saved", {
              position: "bottom-right",
            });
          }
          setMaster({ ...master, storeTransferNo: response });
          setToggle(!toggle);
          setValidated(false);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
    setValidated(true);
  };

  const headers = [
    { label: "Transfer No", key: "storeTransferNo" },
    { label: "Transfer Date", key: "transferDate" },
    { label: "From Store", key: "fromStoreName" },
    { label: "To Store", key: "toStoreName" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Store Transfer">
        <Nav.Link
          onClick={() => {
            setMaster({
              transferDate: new Date().toISOString(),
              storeTransferNo: "",
              storeTransferDetails: [{}],
            });
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
                    onBlur={(e) =>
                      setSearchCriteria({
                        ...searchCriteria,
                        StoreTransferNo: e.target.value,
                      })
                    }
                    type="text"
                    name="StoreTransferNo"
                    placeholder="Store Transfer No"
                  />
                </Form.Group>
                <Form.Group as={Col} sm="3">
                  <Store
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,

                        [action.name]: value.value,
                      })
                    }
                    name="fromStoreId"
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Store
                    onChange={(value, action) =>
                      setSearchCriteria({
                        ...searchCriteria,

                        [action.name]: value.value,
                      })
                    }
                    name="toStoreId"
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
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Transfer No</th>
                        <th>Date</th>
                        <th>From Store</th>
                        <th>To Store</th>
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
                      {!res.dataLoading && res.data.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center">
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
                            item.id === master.id ? "table-active" : ""
                          }
                        >
                          <td>{item.storeTransferNo}</td>
                          <td>{item.transferDate.split("T")[0]}</td>
                          <td>{item.fromStoreName}</td>
                          <td>{item.toStoreName}</td>
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
          <Offcanvas.Title>Store Transfer</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {" "}
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveStoreTransfer}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} sm={3}>
                    <Form.Control
                      type="text"
                      name="storeTransferNo"
                      value={master.storeTransferNo}
                      placeholder="Store Transfer No"
                      readOnly
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={2}>
                    <Form.Control
                      onChange={(e) => handleMaster(e)}
                      type="date"
                      name="transferDate"
                      value={master.transferDate.split("T")[0]}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={2}>
                    <Store
                      onChange={(value, action) =>
                        setMaster({
                          ...master,

                          [action.name]: value.value,
                        })
                      }
                      name="fromStoreId"
                      placeholder="From Store"
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm={2}>
                    <Store
                      onChange={(value, action) =>
                        setMaster({
                          ...master,

                          [action.name]: value.value,
                        })
                      }
                      name="toStoreId"
                      placeholder="To Store"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Unit</th>

                        <th>UnitPrice</th>

                        <th></th>
                      </tr>
                    </thead>
                    {master.storeTransferDetails && (
                      <tbody>
                        {master.storeTransferDetails.map((x, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>
                                <Form.Group>
                                  <Item
                                    onChange={(value) => {
                                      x.itemId = value.value;
                                      setMaster([
                                        ...master.storeTransferDetails,
                                      ]);
                                      handleItemChange(i, value.value);
                                    }}
                                    name="itemId"
                                    selected={x.itemId}
                                  />
                                </Form.Group>
                              </td>
                              <td>
                                <Form.Group>
                                  <Form.Control
                                    onChange={(e) => handleChange(e, i)}
                                    type="number"
                                    name="quantity"
                                    value={x.quantity}
                                    required
                                  />
                                </Form.Group>
                              </td>
                              <td>
                                <Form.Group>
                                  <Unit
                                    onChange={(value) => {
                                      x.UnitId = value.value;
                                      setMaster([
                                        ...master.storeTransferDetails,
                                      ]);
                                    }}
                                    name="unitId"
                                    selected={x.unitId}
                                  />
                                </Form.Group>
                              </td>

                              <td>
                                <Form.Group>
                                  <Form.Control
                                    type="number"
                                    name="unitPrice"
                                    value={x.unitPrice}
                                  />
                                </Form.Group>
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
                    )}
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

export default StoreTransfer;
