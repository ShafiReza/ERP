import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Table,
  Pagination,
  Offcanvas,
  Nav,
} from "react-bootstrap";

import { useState, createRef, Fragment, useEffect, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item, ItemCategory, Unit } from "../../components/DropDown";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const ItemSetup = () => {
  const [item, setItem] = useState({});
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const getAllItem = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("Item?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllItem();
  }, [getAllItem]);

  const getExcelData = () => {
    setSearchCriteria({ ...searchCriteria, excelExport: true });
    setItemExportList(res.data);
    setSearchCriteria({ ...searchCriteria, excelExport: false });
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  const handleClose = () => {
    setShowCanvas(false);
  };

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = "")
    );
    setItem({});
  };

  const handleChange = (event) => {
    let { name, value } = event.target;

    // if (name === "UnitPrice") {
    //   value = parseInt(value);
    // }
    setItem({ ...item, [name]: value });
  };
  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveItem = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (item.ItemCategoryID === undefined) {
      toast.error("Item Category Is Not Defined !", {
        position: "bottom-right",
      });
      return;
    }
    const methodType = item.ItemID ? "PUT" : "POST";
    saveData("Item", methodType, item, getAllItem);
  };

  const deleteItem = () => {
    deleteData("Item/" + item.ItemID, "DELETE", null, getAllItem);
  };

  const headers = [
    { label: "ItemCategoryName", key: "ItemCategoryName" },
    { label: "Item Code", key: "ItemCode" },
    { label: "Item Description", key: "ItemDescription" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Item Setup">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setItem({});
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
          <Row>
            <Form.Group as={Col} sm="3">
              <ItemCategory
                onChange={(value, action) => {
                  setSearchCriteria({
                    ...searchCriteria,
                    [action.name]: value ? value.value : null,
                  });
                }}
                name="categoryId"
              />
            </Form.Group>

            <Form.Group as={Col} sm="3">
              <Item
                onChange={(value, action) => {
                  setSearchCriteria({
                    ...searchCriteria,
                    [action.name]: value ? value.value : null,
                  });
                }}
                name="itemId"
              />
            </Form.Group>
          </Row>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item Category</th>
                    <th>Item Code</th>
                    <th>Item Description</th>
                    <th>Unit</th>
                    <th>Unit Price</th>
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
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((element, index) => (
                    <tr
                      onClick={() => {
                        setItem(element);
                      }}
                      key={element.ItemID}
                      className={
                        element.ItemID === item.ItemID ? "table-active" : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td className="col-md-2">{element.ItemCategoryName}</td>
                      <td>{element.ItemCode}</td>
                      <td>{element.ItemDescription}</td>
                      <td>{element?.UnitName}</td>
                      <td>{element?.UnitPrice}</td>
                      <td className="col-md-1">
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => setShowCanvas(true)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-danger ms-1"
                          onClick={() => setShowDialog(true)}
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
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Item Setup</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveItem}
                method="POST"
              >
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Item Description</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      name="ItemDescription"
                      value={item.ItemDescription}
                      required
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Item Code</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="ItemCode"
                      value={item.ItemCode}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Item Category</Form.Label>
                    <ItemCategory
                      onChange={(value, action) => {
                        setItem({
                          ...item,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="ItemCategoryID"
                      placeholder="Select ItemCategory"
                      selected={item.ItemCategoryID}
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Unit</Form.Label>
                    <Unit
                      onChange={(value, action) => {
                        setItem({
                          ...item,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="UnitId"
                      selected={item.UnitId}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Unit Price</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="number"
                      name="UnitPrice"
                      value={item.UnitPrice}
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
                {reqResponse.loading ? (
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
                    {item.ItemID ? "Update" : "Save"}
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>

      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteItem}
      />
    </Fragment>
  );
};

export default ItemSetup;
