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
  InputGroup,
  Offcanvas,
} from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import { SalesOrder, ItemByPo } from "../../components/DropDown";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const InventoryIssue = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [master, setMaster] = useState({});
  const [validated, setValidated] = useState(false);
  const [inventoryIssueDetails, setInputList] = useState([
    {
      itemId: "",
      issueQuantity: "",
      unitId: "",
      unitPrice: "",
    },
  ]);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllInventoryIssue = useCallback(() => {
    setValidated(false);
    getData("InventoryIssue?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllInventoryIssue();
  }, [getAllInventoryIssue]);

  const getExcelData = () => {
    fetch(
      process.env.REACT_APP_API_URL +
        "InventoryIssue?" +
        new URLSearchParams({ ...searchCriteria, excelExport: true }),
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
        if (Array.isArray(response)) {
          setItemExportList(response);
          setTimeout(() => {
            csvLink.current.link.click();
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    let list = [...inventoryIssueDetails];
    list[index][name] = value;

    setInputList(list);
  };

  const handleMasterChange = (event) => {
    const { name, value } = event.target;
    setMaster({ ...master, [name]: value });
  };

  const saveInventoryIssue = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const arr = [];
    inventoryIssueDetails.forEach((i) => {
      arr.push({
        PoStyleId: i.PoStyleId,
        IssuedQuantity: i.IssuedQuantity,
        ItemColor: i.ItemColor,
        ItemID: i.ItemID,
        ItemSize: i.ItemSize,
        ItemName: i.ItemDescription,
        PoNo: i.PoNo,
        RequestedQuantity: i.RequestedQuantity,
        ReceivedQuantity: i.ReceivedQuantity,
      });
    });
    master.FloorLineID = 0;
    master.Details = arr;
    const methodType = master.InventoryIssueID ? "PUT" : "POST";
    saveData("InventoryIssue", methodType, master, getAllInventoryIssue);
  };

  const deleteInventoryIssue = () => {
    deleteData("InventoryIssue/" + master.id, "DELETE", getAllInventoryIssue);
  };

  const headers = [
    { label: "Issue Date", key: "IssuedDate" },
    { label: "SR No", key: "SRNo" },
  ];

  const getIssueDetails = (obj) => {
    if (obj.poId && obj.itemId) {
      setLoading(true);
      setInputList([]);
      fetch(
        process.env.REACT_APP_API_URL +
          "InventoryIssue/GetByPo?" +
          new URLSearchParams({ poId: obj.poId, itemId: obj.itemId }),

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
          if (Array.isArray(response)) {
            setInputList(response);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setInputList([]);
    }
  };

  const getIssueById = (id) => {
    setLoading(true);
    setInputList([]);
    fetch(
      process.env.REACT_APP_API_URL + "InventoryIssue/" + id,

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
        setInputList(response.Details);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleKeyPress = (event) => {
    // Allow only numeric values (digits 0-9) and the backspace key
    const regex = /^[0-9\b]+$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  };

  return (
    <Fragment>
      <Actionbar pageTitle="Inventory Issue">
        <Nav.Link
          onClick={() => {
            setMaster({ IssuedDate: new Date().toISOString() });
            setInputList([]);
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
                <Form.Group as={Col} sm="3">
                  <InputGroup>
                    <InputGroup.Text>From</InputGroup.Text>
                    <Form.Control
                      onChange={(e) =>
                        setSearchCriteria({
                          ...searchCriteria,
                          fromDate: e.target.value,
                          pageIndex: 1,
                        })
                      }
                      type="date"
                      name="fromDate"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} sm="3">
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
          <Row className="mb-2">
            <Col>
              <Card>
                <Card.Body>
                  <Table responsive hover size="sm" striped>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Issue Date</th>
                        <th>SRNo</th>
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
                      {!res.dataLoading && res.data.length === 0 && (
                        <tr>
                          <td colSpan="13" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {res.data.map((item, index) => (
                        <tr
                          key={item.InventoryIssueID}
                          onClick={() => {
                            setMaster(item);
                            // setInputList(item.inventoryIssueDetails);
                          }}
                          className={
                            item.InventoryIssueID === master.InventoryIssueID
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
                          <td>{item.IssuedDate}</td>
                          <td>{item?.SRNo}</td>
                          <td>
                            {" "}
                            <Button
                              variant="btn btn-sm btn-outline-primary"
                              onClick={() => {
                                setShowCanvas(true);
                                getIssueById(item.InventoryIssueID);
                              }}
                            >
                              <FontAwesomeIcon icon="fa-solid fa-edit" />
                            </Button>{" "}
                            <Button
                              variant="btn btn-sm btn-outline-danger"
                              onClick={(e) =>
                                deleteInventoryIssue(e, index, item)
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
        onHide={() => {
          setShowCanvas(false);
          setValidated(false);
        }}
        placement="end"
        className="w-100"
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Inventory Issue</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {" "}
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveInventoryIssue}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} sm="3">
                    <Form.Label>Issue Date</Form.Label>
                    <Form.Control
                      onChange={(e) => handleMasterChange(e)}
                      type="date"
                      name="IssuedDate"
                      value={master.IssuedDate}
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="3">
                    <Form.Label>SRNo</Form.Label>
                    <Form.Control
                      onChange={(e) => handleMasterChange(e)}
                      type="text"
                      name="SRNo"
                      value={master.SRNo}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-2">
                  <Form.Group as={Col} sm="3">
                    <Form.Label>PO</Form.Label>
                    <SalesOrder
                      onChange={(value, action) =>
                        setMaster({
                          ...master,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="poId"
                      selected={master?.PoStyleId}
                    />
                  </Form.Group>
                  <Form.Group as={Col} sm="3">
                    <Form.Label>Item</Form.Label>
                    <ItemByPo
                      onChange={(value, action) =>
                        setMaster({
                          ...master,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="itemId"
                      poId={master.poId}
                    />
                  </Form.Group>
                  <Form.Group
                    as={Col}
                    sm="3"
                    className="d-flex align-items-end"
                  >
                    <Button onClick={() => getIssueDetails(master)}>
                      Preview
                    </Button>
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Table striped responsive size="sm" hover>
                    <thead>
                      <tr>
                      <th>#</th>
                        <th>PO No</th>
                        <th>Category</th>
                        <th>Item Description</th>

                        <th>Item Color</th>
                        <th>Item Size</th>
                        <th>Unit</th>
                        <th>Total Received</th>
                        <th>Total Issued</th>
                        <th>Current Stock</th>
                        <th>Issued Qty</th>

                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td colSpan="13" className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      )}
                      {!loading && inventoryIssueDetails?.length === 0 && (
                        <tr>
                          <td colSpan="14" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {inventoryIssueDetails?.map((x, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{x.PoNo}</td>
                            <td>{x.ItemCategoryName}</td>
                            <td>{x.ItemName}</td>
                            <td>{x.ItemColor}</td>
                            <td>{x.ItemSize}</td>
                            <td>{x.UnitName}</td>
                            <td>{x.TotalReceived}</td>
                            <td>{x.TotalIssued}</td>
                            <td>{x.StockQuantity}</td>
                            <td>
                              {" "}
                              <Form.Control
                                className={
                                  x.StockQuantity != null &&
                                  Number(x.IssuedQuantity) > x.StockQuantity
                                    ? "border border-2 border-danger"
                                    : ""
                                }
                                onChange={(e) => handleChange(e, i)}
                                name="IssuedQuantity"
                                value={x.IssuedQuantity}
                                onKeyPress={handleKeyPress}
                                required
                              />
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="fw-bold">
                        <td colSpan={10}>Total</td>

                        <td className="text-end">
                          {inventoryIssueDetails?.reduce((tot, itm) => {
                            if (
                              itm.IssuedQuantity !== null ||
                              itm.IssuedQuantity !== undefined
                            ) {
                              return (tot += Number(itm.IssuedQuantity));
                            }
                            return tot;
                          }, 0)}
                        </td>
                      </tr>
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

export default InventoryIssue;
