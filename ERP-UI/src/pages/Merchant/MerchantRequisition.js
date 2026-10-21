/* eslint-disable no-native-reassign */
import { useState, createRef, Fragment, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Table,
  Offcanvas,
  Nav,
  Pagination,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import ConfirmDialog from "../../components/ConfirmDialog";
import { CSVLink } from "react-csv";
import { LC, PI } from "../../components/DropDown";
import MerchantRequisitionReport from "../../components/merchant/MerchantRequisitionReport";
const csvLink = createRef();

const MerchantRequisition = () => {
  const [selectedItemID, setSelectedItemID] = useState(undefined);
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasBody, setCanvasBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [totalPiValue, setTotalPiValue] = useState(null);
  const [requisition, setRequisition] = useState({
    PIList: [],
  });
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);

  const [response, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  useEffect(() => {
    const tot = requisition?.PIList?.reduce(
      (total, it) => (total += it.PIValue),
      0
    ).toFixed(4);
    setTotalPiValue(tot);
  }, [requisition]);

  const getAllB2BLC = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData(
      "MerchantRequisition?" + new URLSearchParams(searchCriteria),
      "GET"
    );
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllB2BLC();
  }, [getAllB2BLC]);

  const getExcelData = () => {
    fetch(
      process.env.REACT_APP_API_URL +
        "BackToBackLC?" +
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

  const handleClose = () => {
    setShowCanvas(false);
    setValidated(false);
  };

  const deleteRowClick = (index) => {
    const list = [...requisition.PIList];
    list.splice(index, 1);
    setRequisition((pre) => {
      return {
        ...pre,
        PIList: list,
      };
    });
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (
      name === "SightDays" ||
      name === "BackToBackLCValue" ||
      name === "LCTypeID"
    ) {
      value = parseFloat(value);
    }
    setRequisition({ ...requisition, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveRequisition = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    const methodType = requisition.RequisitionID ? "PUT" : "POST";
    saveData("MerchantRequisition", methodType, requisition, getAllB2BLC);
  };

  const deleteBackToBackLc = () => {
    deleteData(
      "BackToBackLC/" + requisition.BackToBackLCID,
      "DELETE",
      null,
      getAllB2BLC
    );
  };

  const getRequisitionById = (id) => {
    setCanvasBody("form");

    fetch(process.env.REACT_APP_API_URL + "MerchantRequisition/" + id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setRequisition(result);
        setSelectedItemID(result.RequisitionID);
        setShowCanvas(true);
      })
      .catch((err) => console.log(err));
  };

  const headers = [
    { label: "BackToBack LC No", key: "BackToBackLCNo" },
    { label: "Date", key: "BackToBackLCDate" },
    { label: "Job No", key: "JobNo" },
    { label: "BackToBackLC Value", key: "BackToBackLCValue" },
    { label: "Acceptance Value", key: "AcceptanceValue" },
    { label: "Total Payment Value", key: "TotalPaymentValue" },
    { label: "Last Payment Date", key: "LastPaymentDate" },
  ];

  const getPIDetails = (PiId, PiNo) => {
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Bookings/" + PiId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        const piValue = result.reduce((tot, it) => (tot += it.TotalPrice), 0);
        setRequisition((pre) => {
          // Check if the item with the same PIID already exists in the list
          const isItemInList = pre.PIList.some((item) => item.PIID === PiId);

          // If it's not in the list, add it
          if (!isItemInList) {
            return {
              ...pre,
              PIList: [
                ...pre.PIList,
                {
                  PIID: PiId,
                  PINo: PiNo,
                  PIValue: piValue,
                },
              ],
            };
          }

          // If it's already in the list, return the previous state without changes
          return pre;
        });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <Fragment>
      <Actionbar pageTitle="Merchant Requisition">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setCanvasBody("form");
            setRequisition({
              PIList: [],
            });
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
          filename="MerchantRequisition"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col sm="3">
          <LC
            onChange={(value) => {
              setSearchCriteria({
                ...searchCriteria,
                jobId: value ? value.value : null,
                pageIndex: 1,
              });
            }}
          />
        </Col>
      </Row>
      <Row className="mt-2 mb-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover size="sm" striped>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Req No</th>
                    <th>Job No</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {response.dataLoading && (
                    <tr>
                      <td colSpan="20" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!response.dataLoading && response.data?.length === 0 && (
                    <tr>
                      <td colSpan="20" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {response.data?.map((item, index) => (
                    <tr
                      onClick={() => setSelectedItemID(item.RequisitionID)}
                      key={item.BackToBackLCID}
                      className={
                        item.RequisitionID === selectedItemID
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
                      <td>{item.RequisitionNo}</td>
                      <td>{item.JobNo}</td>
                      <td className="d-flex">
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => getRequisitionById(item.RequisitionID)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-success ms-1"
                          onClick={() => {
                            setCanvasBody("report");
                            setShowCanvas(true);
                          }}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-file-lines" />
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
      <Offcanvas
        show={showCanvas}
        onHide={handleClose}
        placement="end"
        className="w-75"
        scroll={false}
        backdrop="static"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Merchant Requisition</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              {canvasBody === "form" ? (
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={saveRequisition}
                  method="POST"
                >
                  <div className="p-2">
                    <Row>
                      <Form.Group as={Col} sm="6">
                        <Form.Label>Job No</Form.Label>
                        <LC
                          onChange={(value) => {
                            setRequisition({
                              ...requisition,
                              JobID: value ? value.value : null,
                            });
                          }}
                          selected={requisition.JobID}
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label>RequisitionNo No</Form.Label>
                        <Form.Control
                          name="RequisitionNo"
                          value={requisition.RequisitionNo}
                          readOnly
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-3 mt-3">
                      <Form.Group as={Col}>
                        <Form.Label>Requisition Serial</Form.Label>
                        <Form.Control
                          onChange={(e) => handleChange(e)}
                          type="number"
                          name="RequisitionSerial"
                          value={requisition.RequisitionSerial}
                          required
                        />
                      </Form.Group>

                      <Form.Group as={Col}>
                        <Form.Label>Requisition Date</Form.Label>
                        <Form.Control
                          onChange={(e) => handleChange(e)}
                          type="date"
                          name="RequisitionDate"
                          value={requisition.RequisitionDate}
                          required
                        />
                      </Form.Group>
                    </Row>

                    <Row>
                      <Form.Group className="mb-2" as={Col}>
                        <Form.Label>PI No</Form.Label>
                        <PI
                          onChange={(value) => {
                            if (value) {
                              getPIDetails(value.value, value.label);
                            }
                          }}
                        />
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Table responsive hover size="sm" striped>
                          <thead>
                            <tr>
                              <th>PI No</th>
                              <th>PI Value</th>
                              <th></th>
                            </tr>
                          </thead>

                          <tbody>
                            {loading && (
                              <tr>
                                <td colSpan="20" className="text-center">
                                  <Spinner
                                    animation="border"
                                    variant="primary"
                                  />
                                </td>
                              </tr>
                            )}
                            {requisition?.PIList?.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td>{item.PINo}</td>
                                  <td>{item.PIValue}</td>
                                  <td>
                                    <Button
                                      variant="btn btn-sm btn-outline-danger"
                                      onClick={() => deleteRowClick(i)}
                                    >
                                      <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                            <tr className="fw-bold">
                              <td>Total</td>
                              <td>{totalPiValue}</td>
                              <td></td>
                            </tr>
                          </tbody>
                        </Table>
                      </Form.Group>
                    </Row>
                  </div>

                  {reqResponse.loading ? (
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
                      {requisition.RequisitionID ? "Update" : "Save"}
                    </Button>
                  )}
                </Form>
              ) : null}
              {canvasBody === "report" ? (
                <MerchantRequisitionReport RequisitionID={selectedItemID} />
              ) : null}
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteBackToBackLc}
      />
    </Fragment>
  );
};

export default MerchantRequisition;
