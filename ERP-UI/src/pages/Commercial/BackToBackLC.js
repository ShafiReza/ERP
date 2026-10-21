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
  Tabs,
  Tab,
  InputGroup,
  Pagination,
} from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import ConfirmDialog from "../../components/ConfirmDialog";
import { CSVLink } from "react-csv";
import {
  LC,
  PI,
  ShipMode,
  PaymentType,
  BackToBackLC,
} from "../../components/DropDown";
import ModalDialog from "../../components/Dialog";
const csvLink = createRef();

const BackToBackLCSetup = () => {
  const [selectedItemID, setSelectedItemID] = useState(undefined);
  const [validated, setValidated] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAmendmentPopup, setAmendmentPopup] = useState(false);
  const [amendmentList, setAmendmentList] = useState([]);
  const [totalPiValue, setTotalPiValue] = useState(null);
  const [b2bLcPreviousValue, setB2bLcPreviousValue] = useState(null);
  const [backtobacklc, setBackToBackLc] = useState({
    PIList: [],
  });
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
    excelExport: false,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [key, setKey] = useState("home");

  const [response, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();
  const [, deleteData] = useFetch();

  const handleAmentmendPopup = () => {
    setAmendmentPopup(false);
  };

  useEffect(() => {
    const tot = backtobacklc?.PIList?.reduce(
      (total, it) => (total += it.PIValue),
      0
    ).toFixed(4);
    setTotalPiValue(tot);
  }, [backtobacklc]);

  const getAllB2BLC = useCallback(() => {
    setShowDialog(false);
    setValidated(false);
    getData("BackToBackLC?" + new URLSearchParams(searchCriteria), "GET");
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
    const list = [...backtobacklc.PIList];
    list.splice(index, 1);
    setBackToBackLc((pre) => {
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
    setBackToBackLc({ ...backtobacklc, [name]: value });
  };

  const handleDialogNo = () => {
    setShowDialog(false);
  };

  const saveBackToBackLC = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    if (backtobacklc.AmendmentNo && backtobacklc.AmendmentDate) {
      backtobacklc.B2BLCPreviousValue = b2bLcPreviousValue;
    }
    backtobacklc.BackToBackLCValue = totalPiValue;
    const methodType = backtobacklc.BackToBackLCID ? "PUT" : "POST";
    saveData("BackToBackLC", methodType, backtobacklc, getAllB2BLC);
  };

  const deleteBackToBackLc = () => {
    deleteData(
      "BackToBackLC/" + backtobacklc.BackToBackLCID,
      "DELETE",
      null,
      getAllB2BLC
    );
  };

  const getBacktobacklcById = (id) => {
    setShowCanvas(true);
    fetch(process.env.REACT_APP_API_URL + "BackToBackLC/" + id, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setBackToBackLc(result);
        setSelectedItemID(result.BackToBackLCID);
        setB2bLcPreviousValue(result.BackToBackLCValue?.toFixed(4));
      })
      .catch((err) => console.log(err));
  };

  const getAmendmentListByLCId = (id) => {
    fetch(
      process.env.REACT_APP_API_URL +
        "BackToBackLC/GetBackToBackLCHistory?" +
        new URLSearchParams({ blcId: id }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((result) => {
        setAmendmentList(result);
        setAmendmentPopup(true);
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
        setBackToBackLc((pre) => {
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
      <Actionbar pageTitle="BackToBack LC">
        <Nav.Link
          className="nav-link text-primary"
          onClick={() => {
            setShowCanvas(true);
            setBackToBackLc({
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
          filename="BackToBackLc"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="mt-2">
        <Col>
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
        <Col>
          <BackToBackLC
            onChange={(value) => {
              setSearchCriteria({
                ...searchCriteria,
                b2bLCId: value ? value.value : null,
                pageIndex: 1,
              });
            }}
          />
        </Col>
        <Col>
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
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text>To</InputGroup.Text>
            <Form.Control
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  toDate: e.target.value,
                  pageIndex: 1,
                })
              }
              type="date"
            />
          </InputGroup>
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
                    <th>B2B LC No</th>
                    <th>B2B LC Date</th>
                    <th>B2B LC Value</th>
                    <th>Acceptance Value</th>
                    <th>Payment Value</th>
                    <th>Due</th>
                    <th>Last Pay Date</th>
                    <th>Maturity</th>
                    <th>Job</th>
                    <th>Delivery Mode</th>
                    <th>Amendment No</th>
                    <th>Amendment Date</th>
                    <th>Change</th>
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
                      onClick={() => setSelectedItemID(item.BackToBackLCID)}
                      key={item.BackToBackLCID}
                      className={
                        item.BackToBackLCID === selectedItemID
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
                      <td>{item.BackToBackLCNo}</td>
                      <td>{item?.BackToBackLCDate}</td>
                      <td>${item?.BackToBackLCValue?.toLocaleString()}</td>
                      <td>${item?.AcceptanceValue?.toLocaleString()}</td>
                      <td>${item?.TotalPaymentValue?.toLocaleString()}</td>
                      <td>
                        ${item?.AcceptanceValue - item?.TotalPaymentValue}
                      </td>
                      <td>{item?.LastPaymentDate}</td>
                      <td>{item?.MaturityDate}</td>
                      <td>{item.JobNo}</td>
                      <td>
                        {item.ShipMode === 1 ? (
                          <span>
                            <FontAwesomeIcon
                              icon="fa-solid fa-ship"
                              className="text-primary"
                            />{" "}
                            Sea
                          </span>
                        ) : item.ShipMode === 2 ? (
                          <span>
                            <FontAwesomeIcon
                              icon="fa-solid fa-plane"
                              className="text-secondary"
                            />{" "}
                            Air
                          </span>
                        ) : (
                          <span>
                            <FontAwesomeIcon
                              icon="fa-solid fa-truck"
                              className="text-success"
                            />{" "}
                            Road
                          </span>
                        )}
                      </td>
                      <td>
                        {item?.AmendmentNo === 0 ? "" : item?.AmendmentNo}
                      </td>
                      <td>{item?.AmendmentDate}</td>
                      <td>
                        {item?.AmendmentNo > 0 && (
                          <span>
                            {item?.BackToBackLCValue - item.B2BLCPreviousValue >
                            0 ? (
                              <FontAwesomeIcon
                                icon="fa-solid fa-arrow-up"
                                className="text-primary"
                              />
                            ) : (
                              <FontAwesomeIcon
                                icon="fa-solid fa-arrow-down"
                                className="text-danger"
                              />
                            )}
                            {" $"}
                            {(
                              item?.BackToBackLCValue - item?.B2BLCPreviousValue
                            ).toLocaleString()}
                          </span>
                        )}
                      </td>
                      <td className="d-flex">
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            getBacktobacklcById(item.BackToBackLCID)
                          }
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button
                          variant="btn btn-sm btn-outline-success ms-1"
                          onClick={() =>
                            getAmendmentListByLCId(item.BackToBackLCID)
                          }
                        >
                          <FontAwesomeIcon icon="fa-solid fa-list-ul" />
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
          <Offcanvas.Title>Back To Back LC</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={saveBackToBackLC}
            method="POST"
          >
            <Tabs
              fill
              justify
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => {
                setKey(k);
              }}
              className="mb-2"
            >
              <Tab eventKey="home" title="Basic Information">
                <div className="p-2">
                  <Row>
                    <Form.Group as={Col}>
                      <Form.Label>Job No</Form.Label>
                      <LC
                        onChange={(value) => {
                          setBackToBackLc({
                            ...backtobacklc,
                            JobID: value ? value.value : null,
                          });
                        }}
                        selected={backtobacklc.JobID}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>HS Code</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        name="HSCode"
                        value={backtobacklc.HSCode}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3 mt-3">
                    <Form.Group as={Col}>
                      <Form.Label>BackToBackLc No</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="BackToBackLCNo"
                        value={backtobacklc.BackToBackLCNo}
                        required
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>BackToBackLc Date</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="date"
                        name="BackToBackLCDate"
                        value={backtobacklc.BackToBackLCDate}
                        required
                      />
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Ship Mode</Form.Label>
                      <ShipMode
                        onChange={(value) => {
                          setBackToBackLc({
                            ...backtobacklc,
                            ShipMode: value ? value.value : null,
                          });
                        }}
                        selected={backtobacklc.ShipMode}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Maturity</Form.Label>
                      <InputGroup>
                        <Form.Control
                          onChange={(e) => handleChange(e)}
                          type="number"
                          name="SightDays"
                          value={backtobacklc.SightDays}
                          required
                        />
                        <InputGroup.Text>days from</InputGroup.Text>
                        <Form.Select
                          name="MaturityType"
                          onChange={(e) => handleChange(e)}
                          value={backtobacklc.MaturityType}
                        >
                          <option>Select Maturity Type</option>
                          <option value={1}>EDF</option>
                          <option value={2}>Chalan</option>
                          <option value={3}>Acceptance</option>
                          <option value={4}>BL</option>
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                  </Row>

                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Back to Back LC Value</Form.Label>
                      <Form.Control
                        type="number"
                        name="BackToBackLCValue"
                        value={totalPiValue}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Back To Back LC Type</Form.Label>
                      <PaymentType
                        onChange={(value) => {
                          setBackToBackLc({
                            ...backtobacklc,
                            LCTypeID: value ? value.value : null,
                          });
                        }}
                        selected={backtobacklc.LCTypeID}
                      />
                    </Form.Group>
                  </Row>
                  {backtobacklc.BackToBackLCID &&
                  b2bLcPreviousValue !== totalPiValue ? (
                    <Fragment>
                      <Row className="mb-3">
                        <Form.Group as={Col}>
                          <Form.Label>BackToBackLC Previous Value</Form.Label>
                          <Form.Control
                            type="number"
                            value={b2bLcPreviousValue}
                            readOnly
                          />
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Amendment Value</Form.Label>
                          <Form.Control
                            type="number"
                            value={totalPiValue - b2bLcPreviousValue}
                            readOnly
                          />
                        </Form.Group>
                      </Row>
                      <Row className="mb-3">
                        <Form.Group as={Col}>
                          <Form.Label>Amendment No</Form.Label>
                          <Form.Control
                            onChange={(e) => handleChange(e)}
                            type="number"
                            name="AmendmentNo"
                            required
                          />
                        </Form.Group>
                        <Form.Group as={Col} sm="6">
                          <Form.Label>Amendment Date</Form.Label>
                          <Form.Control
                            onChange={(e) => handleChange(e)}
                            type="date"
                            name="AmendmentDate"
                            required
                          />
                        </Form.Group>
                      </Row>
                    </Fragment>
                  ) : null}

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
                                <Spinner animation="border" variant="primary" />
                              </td>
                            </tr>
                          )}
                          {backtobacklc?.PIList?.map((item, i) => {
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
              </Tab>
              <Tab eventKey="PIList" title="Others Information">
                <div className="p-2">
                  <Row className="mb-3 mt-3">
                    <Form.Group as={Col}>
                      <Form.Label>BackToBackLc Shipped Date</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="date"
                        name="BackToBackShippedDate"
                        value={backtobacklc.BackToBackShippedDate}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>BackToBackLc Expiry Date</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="date"
                        name="ExpiryDate"
                        value={backtobacklc.ExpiryDate}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Shipment To</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="ShipmentTo"
                        value={backtobacklc.ShipmentTo}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Shipment From</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        name="ShipmentFrom"
                        value={backtobacklc.ShipmentFrom}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Insurance Cover Note No</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="InsuranceCoverNoteNo"
                        value={backtobacklc.InsuranceCoverNoteNo}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Insurance Cover Note Date</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="date"
                        name="InsuranceCoverNoteDate"
                        value={backtobacklc.InsuranceCoverNoteDate}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col}>
                      <Form.Label>Country Of Origin</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        type="text"
                        name="CountryOfOrigin"
                        value={backtobacklc.CountryOfOrigin}
                      />
                    </Form.Group>
                    <Form.Group as={Col}>
                      <Form.Label>Clause</Form.Label>
                      <Form.Control
                        onChange={(e) => handleChange(e)}
                        name="Clause"
                        value={backtobacklc.Clause}
                      />
                    </Form.Group>
                  </Row>
                </div>
              </Tab>
            </Tabs>
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
                {backtobacklc.BackToBackLCID ? "Update" : "Save"}
              </Button>
            )}
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
      <ModalDialog
        showDialog={showAmendmentPopup}
        handleDialogNo={handleAmentmendPopup}
        title="Amentmend History"
      >
        <Card>
          <Card.Body>
            <Table>
              <thead>
                <th>Amendment No</th>
                <th>Amendment Date</th>
                <th>PI Value</th>
              </thead>
              <tbody>
                {amendmentList?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.AmendmentNo}</td>
                    <td>{item.AmendmentDate}</td>
                    <td>{item.PIValue}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </ModalDialog>
      <ToastContainer autoClose={2000} />
      <ConfirmDialog
        showDialog={showDialog}
        handleDialogNo={handleDialogNo}
        handleDialogYes={deleteBackToBackLc}
      />
    </Fragment>
  );
};

export default BackToBackLCSetup;
