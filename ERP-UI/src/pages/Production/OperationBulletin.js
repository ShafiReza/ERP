import { useState, useEffect, useRef, Fragment, createRef } from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Nav,
  Spinner,
} from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import ReactToPrint from "react-to-print";
import {
  Style,
  ItemCategory,
  StyleOperation,
  Floor,
  FloorLine,
} from "../../components/DropDown";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../Print.style.css";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const OperationBreakdown = () => {
  const [validated, setValidated] = useState(false);
  const [operationList, setOperationList] = useState([{}]);
  const [operationListForPrint, setOperationListForPrint] = useState([{}]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ toggle: false });
  const [calculation, setCalculation] = useState({});
  const [itemExportList, setItemExportList] = useState([]);
  let componentRef = useRef();
  let qualityPrintRef = useRef();

  useEffect(() => {
    if (searchCriteria.styleId && searchCriteria.floor && searchCriteria.line) {
      setDataLoading(true);
      fetch(
        process.env.REACT_APP_API_URL +
          "StyleOperation?" +
          new URLSearchParams(searchCriteria),
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
            setOperationList(response);
          }
          setDataLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setDataLoading(false);
        });
    }
  }, [searchCriteria]);

  useEffect(() => {
    let max = 0;
    operationList.forEach((it) => {
      if (it.Sam && it.NoOfWS) {
        let load = Number(it.Sam / it.NoOfWS);
        if (load > max) {
          max = load;
        }
      }
    });
    let pitchTime =
      operationList.reduce((tot, itm) => (tot += itm.Sam), 0) /
      operationList.reduce((tot, itm) => {
        if (itm.NoOfWS !== null) {
          tot += Number(itm.NoOfWS);
        }
        return tot;
      }, 0);
    let efficency = Number(pitchTime / max) * 100;
    setCalculation({
      maxLoad: max,
      pitchTime: pitchTime,
      efficency: efficency,
    });

    let list = [...operationList];
    let i = 0;
    while (i < list.length) {
      for (let j = 1; j < list[i].NoOfWS; j++) {
        // data.Insert(i + 1, data[i]);
        // Inserting the value 4 at index 3
        list.splice(i + 1, 0, list[i]);
        i++;
      }
      i++;
    }
    setOperationListForPrint(list);
  }, [operationList]);

  const addRow = () => {
    setOperationList([...operationList, {}]);
  };

  const addRowBillow = (index) => {
    const modifiedArray = [
      ...operationList.slice(0, index + 1),
      {
        Sam: operationList[index].Sam,
        SectionNo: operationList[index].SectionNo,
        OperationID: operationList[index].OperationID,
        MachineID: operationList[index].MachineID,
      },
      ...operationList.slice(index + 1),
    ];
    setOperationList(modifiedArray);
  };

  const deleteRow = (index) => {
    const list = [...operationList];
    list.splice(index, 1);
    setOperationList(list);
  };

  const handleColumnChange = (e, index) => {
    let { name, value } = e.target;

    if (name === "Sam" || name === "NoOfWS") {
      value = parseFloat(value);
    }
    let list = [...operationList];
    list[index][name] = value;

    setOperationList(list);
  };

  const getExcelData = () => {
    if (searchCriteria.styleId && searchCriteria.floor && searchCriteria.line) {
      setDataLoading(true);
      fetch(
        process.env.REACT_APP_API_URL +
          "StyleOperation?" +
          new URLSearchParams(searchCriteria),
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
          setDataLoading(false);
        });
    }
  };

  const headers = [
    { label: "Floor", key: "Floor" },
    { label: "Style No", key: "StyleNo" },
    { label: "Operation Name", key: "OperationName" },
    { label: "Machine Name", key: "MachineName" },
    { label: "Sam", key: "Sam" },
    { label: "No Of WS", key: "NoOfWS" },
    { label: "Section No", key: "SectionNo" },
  ];

  const saveStyleConfigure = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      setLoading(true);

      const formBody = [];
      if (
        !searchCriteria.styleId &&
        !searchCriteria.floor &&
        !searchCriteria.line
      ) {
        toast.warn("Please select style and Floor Line", {
          position: "bottom-right",
        });
        return;
      } else {
        operationList.forEach((ele, index) => {
          formBody.push({
            ...ele,
            StyleID: searchCriteria.styleId,
            Floor: searchCriteria.floor,
            Line: searchCriteria.line,
            Sequence: index + 1,
          });
        });
      }

      fetch(process.env.REACT_APP_API_URL + "StyleOperation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formBody),
      }).then((response) => {
        if (response.status === 200) {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
          setSearchCriteria({
            ...searchCriteria,
            toggle: !searchCriteria.toggle,
          });
        } else {
          response.json().then((data) => {
            toast.error(response.statusText + " - " + data.Message, {
              position: "bottom-right",
            });
          });
        }
        setLoading(false);
        setValidated(false);
      });
    }
    setValidated(true);
  };

  const copyOperationBulletinList = () => {
    const jsonString = JSON.stringify(operationList);
    localStorage.setItem("operationBulletin", jsonString);
  };

  const pasteOperationBulletinList = () => {
    let tempArray = JSON.parse(localStorage.getItem("operationBulletin")) ?? [];
    if (tempArray.length === 0) {
      return;
    } else {
      setOperationList(tempArray);
    }
  };

  const operationRows = operationListForPrint.map((item, i) => {
    const isSameAsPrevious =
      i > 0 &&
      item.OperationName === operationListForPrint[i - 1].OperationName;

    return (
      <Fragment>
        <tr
          key={i}
          className={
            i > 0 &&
            operationListForPrint[i].SectionNo !==
              operationListForPrint[i - 1].SectionNo
              ? "page-break"
              : ""
          }
        >
          {i === 0 || !isSameAsPrevious ? (
            <td rowSpan={Math.ceil(item.NoOfWS)}>{item.OperationName}</td>
          ) : null}
          {i === 0 || !isSameAsPrevious ? (
            <td rowSpan={Math.ceil(item.NoOfWS)}>{item.MachineName}</td>
          ) : null}
          {i === 0 || !isSameAsPrevious ? (
            <td rowSpan={Math.ceil(item.NoOfWS)}>{item.Sam}</td>
          ) : null}
          {i === 0 || !isSameAsPrevious ? (
            <td rowSpan={Math.ceil(item.NoOfWS)}>
              {(60 / item.Sam).toFixed(0)}
            </td>
          ) : null}
          {i === 0 || !isSameAsPrevious ? (
            <td rowSpan={Math.ceil(item.NoOfWS)}>{item.SectionNo}</td>
          ) : null}

          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
          <td style={{ height: 25 }}></td>
        </tr>
        {i > 0 &&
        operationListForPrint[i].OperationName !==
          operationListForPrint[i + 1]?.OperationName ? (
          <tr className="fw-bold text-end bg-light">
            <td colSpan={6}>Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        ) : null}
      </Fragment>
    );
  });

  const operationRowsForQualityStatus = operationListForPrint.map((item, i) => {
    const isSameAsPrevious =
      i > 0 &&
      item.OperationName === operationListForPrint[i - 1].OperationName;

    return (
      <Fragment>
        <tr
          key={i}
          className={
            i > 0 &&
            operationListForPrint[i].SectionNo !==
              operationListForPrint[i - 1].SectionNo
              ? "page-break"
              : ""
          }
        >
          {i === 0 || !isSameAsPrevious ? (
            <td rowSpan={Math.ceil(item.NoOfWS)}>{item.OperationName}</td>
          ) : null}
          {i === 0 || !isSameAsPrevious ? (
            <td rowSpan={Math.ceil(item.NoOfWS)}>{item.MachineName}</td>
          ) : null}

          {i === 0 || !isSameAsPrevious ? (
            <td rowSpan={Math.ceil(item.NoOfWS)}>{item.SectionNo}</td>
          ) : null}

          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
          <td style={{ height: 25, width: 40 }}></td>
        </tr>
        {i > 0 &&
        operationListForPrint[i].OperationName !==
          operationListForPrint[i + 1]?.OperationName ? (
          <tr className="fw-bold text-end bg-light">
            <td colSpan={5}>Total</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        ) : null}
      </Fragment>
    );
  });

  return (
    <div>
      <style>{`@media print {
  @page {
    size: landscape !important;
    margin: 5mm !important;
  }
  }`}</style>

      <Actionbar pageTitle="Operation Bulletin">
        <Nav.Link
          className="nav-link text-dark"
          onClick={copyOperationBulletinList}
        >
          <FontAwesomeIcon icon="fa-solid fa-copy" /> Copy
        </Nav.Link>
        <Nav.Link
          className="nav-link text-dark"
          onClick={pasteOperationBulletinList}
        >
          <FontAwesomeIcon icon="fa-solid fa-paste" /> Paste
        </Nav.Link>
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => componentRef}
        />
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Quality
            </Nav.Link>
          )}
          content={() => qualityPrintRef}
        />
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="Line_Balance"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>
      <Row className="">
        <Col>
          <Form
            noValidate
            validated={validated}
            onSubmit={saveStyleConfigure}
            method="POST"
          >
            <Row className="mt-2">
              <Form.Group as={Col} sm="3">
                <Style
                  onChange={(value) => {
                    setSearchCriteria({
                      ...searchCriteria,
                      styleId: value ? value.value : "",
                    });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} sm="3">
                <Floor
                  onChange={(value) => {
                    setSearchCriteria({
                      ...searchCriteria,
                      floor: value ? value.value : "",
                    });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} sm="3">
                <FloorLine
                  onChange={(value) => {
                    setSearchCriteria({
                      ...searchCriteria,
                      line: value ? value.value : "",
                    });
                  }}
                  selected={searchCriteria.line}
                  floor={searchCriteria.floor}
                />
              </Form.Group>
            </Row>

            <Row className="mt-2">
              <Col>
                <Card>
                  <Card.Body>
                    <Table striped hover size="sm">
                      <thead
                        style={{
                          position: "sticky",
                          top: "0",
                        }}
                        className="bg-light"
                      >
                        <tr>
                          <th>#</th>
                          <th>Operation/Spec</th>
                          <th>Machine</th>
                          <th>SAM</th>
                          <th>NoOfWS</th>
                          <th>Load</th>
                          <th>Target</th>
                          <th>Section</th>
                          <th>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => addRow()}
                            >
                              +
                            </Button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataLoading && (
                          <tr>
                            <td colSpan="15" className="text-center">
                              <Spinner animation="border" variant="primary" />
                            </td>
                          </tr>
                        )}
                        {operationList.length === 0 && (
                          <tr>
                            <td colSpan="15" className="text-center">
                              <b>No data found!</b>
                            </td>
                          </tr>
                        )}
                        {operationList.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>
                                <StyleOperation
                                  onChange={(value) => {
                                    item.OperationID = value
                                      ? value.value
                                      : null;
                                    setOperationList([...operationList]);
                                  }}
                                  selected={item.OperationID}
                                />
                              </td>
                              <td>
                                <ItemCategory
                                  onChange={(value) => {
                                    item.MachineID = value ? value.value : null;
                                    setOperationList([...operationList]);
                                  }}
                                  name="MachineID"
                                  selected={item.MachineID}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  onChange={(e) => handleColumnChange(e, i)}
                                  name="Sam"
                                  value={item.Sam}
                                  size="sm"
                                />
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  onChange={(e) => handleColumnChange(e, i)}
                                  name="NoOfWS"
                                  value={item.NoOfWS}
                                  size="sm"
                                />
                              </td>
                              <td
                                className={
                                  calculation?.maxLoad?.toFixed(2) ===
                                  (item.Sam / item.NoOfWS)?.toFixed(2)
                                    ? "fw-bold text-danger"
                                    : ""
                                }
                              >
                                {(item.Sam / item.NoOfWS).toLocaleString(
                                  "en-US",
                                  {
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </td>
                              <td>
                                {((60 / item.Sam) * item.NoOfWS).toLocaleString(
                                  "en-US",
                                  {
                                    maximumFractionDigits: 0,
                                  }
                                )}
                              </td>
                              <td>
                                <Form.Control
                                  type="number"
                                  onChange={(e) => handleColumnChange(e, i)}
                                  name="SectionNo"
                                  value={item.SectionNo}
                                  size="sm"
                                />
                              </td>

                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => addRowBillow(i)}
                                >
                                  +
                                </Button>
                                <Button
                                  variant="outline-danger ms-1"
                                  size="sm"
                                  onClick={() => deleteRow(i)}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                        <tr className="fw-bold">
                          <td colSpan={3} className="text-center">
                            Total
                          </td>
                          <td>
                            {" "}
                            {operationList
                              .reduce((tot, itm) => (tot += itm.Sam), 0)
                              .toLocaleString("en-US", {
                                maximumFractionDigits: 3,
                              })}
                          </td>
                          <td>
                            {operationList.reduce((tot, itm) => {
                              if (itm.NoOfWS !== null) {
                                tot += Number(itm.NoOfWS);
                              }
                              return tot;
                            }, 0)}
                          </td>

                          <td>
                            Max Load:
                            {calculation?.maxLoad?.toLocaleString("en-US", {
                              maximumFractionDigits: 3,
                            })}
                          </td>
                          <td>
                            Pitch Time:{" "}
                            {calculation?.pitchTime?.toLocaleString("en-US", {
                              maximumFractionDigits: 3,
                            })}
                          </td>
                          <td colSpan={2}>
                            Efficency:
                            {calculation?.efficency?.toLocaleString("en-US", {
                              maximumFractionDigits: 2,
                            })}
                            %
                          </td>
                        </tr>
                      </tbody>
                    </Table>

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
                      <Button
                        variant="primary"
                        type="submit"
                        className="float-end"
                      >
                        Save
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row className="mt-2" ref={(el) => (componentRef = el)}>
        <Col className="hidden-on-screen">
          <Card>
            <Card.Body>
              <h5>Style No: {operationList[0]?.StyleNo}</h5>
              <Table
                style={{ border: "1px solid black" }}
                hover
                size="sm"
                bordered
                className="caption-top"
              >
                <thead>
                  <tr>
                    <th rowSpan={2}>Operation/Spec</th>
                    <th rowSpan={2}>Machine</th>
                    <th rowSpan={2}>SAM</th>
                    <th rowSpan={2}>Target</th>
                    <th rowSpan={2}>Section</th>
                    <th rowSpan={2} style={{ width: 100 }}>
                      Card No
                    </th>
                    <th colSpan={12} className="text-center">
                      Hourly Output
                    </th>
                    <th rowSpan={2}>Remarks</th>
                  </tr>
                  <tr className="text-center">
                    <th style={{ width: 40 }}>1</th>
                    <th style={{ width: 40 }}>2</th>
                    <th style={{ width: 40 }}>3</th>
                    <th style={{ width: 40 }}>4</th>
                    <th style={{ width: 40 }}>5</th>
                    <th style={{ width: 40 }}>6</th>
                    <th style={{ width: 40 }}>7</th>
                    <th style={{ width: 40 }}>8</th>
                    <th style={{ width: 40 }}>9</th>
                    <th style={{ width: 40 }}>10</th>
                    <th style={{ width: 40 }}>11</th>
                    <th style={{ width: 40 }}>12</th>
                  </tr>
                </thead>
                <tbody>{operationRows}</tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-2" ref={(el) => (qualityPrintRef = el)}>
        <Col className="hidden-on-screen">
          <Card>
            <Card.Body>
              <h5>Style No: {operationList[0]?.StyleNo}</h5>
              <Table
                style={{ border: "1px solid black" }}
                hover
                size="sm"
                bordered
                className="caption-top"
              >
                <thead>
                  <tr>
                    <th>Operation/Spec</th>
                    <th>Machine</th>
                    <th>Section</th>
                    <th style={{ width: 100 }}>Card No</th>
                    <th>Check Quantity</th>
                    <th colSpan={12} className="text-center">
                      Defect Code No
                    </th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>{operationRowsForQualityStatus}</tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default OperationBreakdown;
