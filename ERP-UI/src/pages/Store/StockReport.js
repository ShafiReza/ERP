import { Fragment, useState, createRef } from "react";
import Actionbar from "../../components/layout/Actionbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink } from "react-csv";
import {
  Col,
  Row,
  Table,
  Spinner,
  Card,
  Nav,
  Form,
  Pagination,
  Button,
} from "react-bootstrap";
import useFetch from "../../components/hooks/useFetch";
import { ItemCategory } from "../../components/DropDown";
const csvLink = createRef();

const StockReport = () => {
  const [itemExportList, setItemExportList] = useState([]);
  const [res, fetchData] = useFetch();
  const [searchCriteria, setSearchCriteria] = useState({});

  const getList = () => {
    if (searchCriteria.fromDate && searchCriteria.toDate) {
      fetchData(
        "Inventory/GetStockReport?" + new URLSearchParams(searchCriteria),
        "GET"
      );
    }
  };

  const headers = [
    { label: "Category", key: "Category" },
    { label: "JobNo", key: "JobNo" },
    { label: "PONo", key: "PONo" },
    { label: "StyleNo", key: "StyleNo" },
    { label: "BLNo", key: "BLNo" },
    { label: "ContractNo", key: "ContractNo" },
    { label: "InvoiceNo", key: "InvoiceNo" },
    { label: "UnitName", key: "UnitName" },
    { label: "IssueQuantity", key: "IssueQuantity" },
    { label: "ReceiveQuantity", key: "ReceiveQuantity" },
    { label: "CurrentStock", key: "CurrentStock" },
    { label: "StockValue", key: "StockValue" },
  ];

  const getExcelData = () => {
    setItemExportList(res.data);
    setTimeout(() => {
      csvLink.current.link.click();
    }, 1000);
  };

  return (
    <Fragment>
      <Actionbar pageTitle="Stock Report">
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="StockReport"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2 mb-2">
        <Form.Group as={Col} sm="3">
          <Form.Control
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                fromDate: e.target.value,
              })
            }
            type="date"
          />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Form.Control
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                toDate: e.target.value,
              })
            }
            type="date"
          />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <ItemCategory
            onChange={(value, action) =>
              setSearchCriteria({
                ...searchCriteria,
                [action.name]: value ? value.value : null,
              })
            }
            name="itemCategoryId"
          />
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Button onClick={getList}>Preview</Button>
        </Form.Group>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive bordered striped hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Category</th>
                    <th>Item</th>
                    <th>Job No</th>
                    <th>PO No</th>
                    <th>Style No</th>
                    <th>BL No</th>
                    <th>Contract No</th>
                    <th>Invoice No</th>
                    <th>Unit</th>
                    <th>Issued Qty</th>
                    <th>Received Qty</th>
                    <th>Current Stock</th>
                    <th>Stock Value</th>
                    {/* <th>Reorder Point</th> */}
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="20" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res?.length === 0 && (
                    <tr>
                      <td colSpan="20" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res?.data?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.Category}</td>
                      <td>{item.ItemDescription}</td>
                      <td>{item.JobNo}</td>
                      <td>{item.PONo}</td>
                      <td>{item.StyleNo}</td>
                      <td>{item.BLNo}</td>
                      <td>{item.ContractNo}</td>
                      <td>{item.InvoiceNo}</td>
                      <td>{item.UnitName}</td>
                      <td>{item.IssueQuantity}</td>
                      <td>{item.ReceiveQuantity}</td>
                      <td>{item.CurrentStock}</td>
                      <td>${item.StockValue}</td>
                      {/* <td>{item.ReorderPoint}</td> */}
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
                  disabled={searchCriteria.pageIndex === 0}
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
    </Fragment>
  );
};

export default StockReport;
