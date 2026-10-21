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
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ItemCategory } from "../../components/DropDown";
import Actionbar from "../../components/layout/Actionbar";
import ConfirmDialog from "../../components/ConfirmDialog";
import useFetch from "../../components/hooks/useFetch";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const ItemCategorySetup = () => {
  const [itemCategory, setItemCategory] = useState({});
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

  const getAllItemCategory = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("ItemCategory?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllItemCategory();
  }, [getAllItemCategory]);

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
    setItemCategory({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setItemCategory({ ...itemCategory, [name]: value });
  };
  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveItemCategory = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    const methodType = itemCategory.ItemCategoryID ? "PUT" : "POST";
    saveData("ItemCategory", methodType, itemCategory, getAllItemCategory);
  };

  const deleteItemCategory = () => {
    deleteData(
      "ItemCategory/" + itemCategory.ItemCategoryID,
      "DELETE",
      null,
      getAllItemCategory
    );
  };

  const headers = [
    { label: "Parent Category", key: "ParentCategoryID" },
    { label: "Category", key: "Name" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Item Category">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setItemCategory({});
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
          filename="ItemCategory"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2">
        <Col sm="3">
          <Form.Group>
            <ItemCategory
              onChange={(value) =>
                setSearchCriteria({
                  ...searchCriteria,
                  itemCategoryId: value ? value.value : "",
                })
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="mt-2 mb-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Parent Category</th>
                    <th>Item Category</th>
                    <th></th>
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
                      onClick={() => {
                        setItemCategory(item);
                      }}
                      key={item.ItemCategoryID}
                      className={
                        item.ItemCategoryID === itemCategory.ItemCategoryID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.ParentCategoryName}</td>
                      <td>{item.Name}</td>
                      <td>
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => setShowCanvas(true)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-danger ms-1"
                          type=""
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
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Item Category</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveItemCategory}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Parent Category</Form.Label>
                    <ItemCategory
                      onChange={(value, action) => {
                        setItemCategory({
                          ...itemCategory,
                          [action.name]: value ? value.value : null,
                        });
                      }}
                      name="ParentCategoryID"
                      selected={itemCategory.ParentCategoryID}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Item Category</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="Name"
                      value={itemCategory.Name}
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
                    {itemCategory.id ? "Update" : "Save"}
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
        handleDialogYes={deleteItemCategory}
      />
    </Fragment>
  );
};

export default ItemCategorySetup;
