import { useState, useRef, Fragment } from "react";
import {
  Card,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  InputGroup,
  Nav,
  Offcanvas,
  Button,
} from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import LedgerReportComponent from "../../components/reports/LedgerReportComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Factory } from "../../components/DropDown";
import ReactToPrint from "react-to-print";

import { CSVLink } from "react-csv";

const TrialBalance = () => {
  const [dataLoader, setDataLoader] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    excelExport: false,
    branchId: 1,
  });
  const [trialBalanceList, setTrialBalanceList] = useState([]);
  const [showCanvas, setShowCanvas] = useState(false);
  let componentRef = useRef();

  const showReport = () => {
    setDataLoader(true);
    fetch(
      process.env.REACT_APP_API_URL +
        "AccountingReports/TrailBalance?" +
        new URLSearchParams(searchCriteria),
      {
        method: "POST",
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
        // if (result.length > 0) {
        //   const tempArr = [];
        //   const obj = {};
        //   result.forEach((item) => {
        //     if (!obj[item.ParentAccount]) {
        //       obj[item.ParentAccount] = 1;
        //     } else {
        //       item.ParentAccount = "";
        //     }
        //     tempArr.push(item);
        //   });
        //   setTrialBalanceList(tempArr);
        // }

        setTrialBalanceList(result);

        setDataLoader(false);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        setDataLoader(false);
      });
  };

  const handleLedgerReport = (item) => {
    setSearchCriteria({
      ...searchCriteria,
      accountId: item?.AccountID,
    });
    setShowCanvas(true);
  };

  const headers = [
    { label: "Group", key: "ParentAccount" },
    { label: "Account Head", key: "AccountName" },
    { label: "Debit", key: "Debit" },
    { label: "Credit", key: "Credit" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Trial Balance">
        <CSVLink
          headers={headers}
          data={trialBalanceList}
          filename="TrialBalance"
          className="text-success align-self-center text-decoration-none"
        >
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </CSVLink>
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => componentRef}
        />
      </Actionbar>
      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
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
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="3">
          <Factory
            onChange={(value) =>
              setSearchCriteria({
                ...searchCriteria,
                branchId: value ? value.value : null,
              })
            }
            placeholder="Select Costcenter"
          />
        </Form.Group>
        <Form.Group as={Col} sm="2">
          <Button
            variant="outline-primary"
            className="btn pull-right"
            onClick={showReport}
          >
            <FontAwesomeIcon icon="fa-solid fa-search" /> Search
          </Button>
        </Form.Group>
      </Row>

      <Row className="mt-2 mb-2">
        <Col>
          <Card ref={(el) => (componentRef = el)}>
            <Card.Body>
              <Card.Title className="text-center">
                {searchCriteria.branchId === 1039 &&
                  "ASWL WOVEN (DMC Apparels)"}
                {searchCriteria.branchId === 1048 && "DMC WASH"}
                {searchCriteria.branchId === 1051 && "DMC WOVEN"}
                {searchCriteria.branchId === 1052 && "ASWL KNIT"}
              </Card.Title>
              <Card.Subtitle className="text-center">
                From: {searchCriteria.fromDate} to {searchCriteria.toDate}
              </Card.Subtitle>

              <Table responsive size="sm" striped hover>
                <thead>
                  <tr>
                    <th>Account Head</th>
                    <th>Debit</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoader && (
                    <tr>
                      <td colSpan="3" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!dataLoader && trialBalanceList.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {trialBalanceList.map((item, index) => (
                    <>
                      {(index === 0 ||
                        trialBalanceList[index - 1].ParentAccount !==
                          item.ParentAccount) && (
                        <tr
                          className="fst-italic fw-bold"
                          key={item.ParentAccount}
                        >
                          <td>{item.ParentAccount}</td>
                          <td>
                            {trialBalanceList
                              .filter(
                                (x) => x.ParentAccount === item.ParentAccount
                              )
                              .reduce((total, el) => {
                                return (total += el.Debit);
                              }, 0)}
                          </td>
                          <td>
                            {trialBalanceList
                              .filter(
                                (x) => x.ParentAccount === item.ParentAccount
                              )
                              .reduce((total, el) => {
                                return (total += el.Credit * -1);
                              }, 0)}
                          </td>
                        </tr>
                      )}

                      <tr
                        key={item.AccountNo}
                        onDoubleClick={() => handleLedgerReport(item)}
                      >
                        <td className="ps-5">
                          {item.AccountNo} - {item.AccountName}
                        </td>
                        <td>{item.Debit}</td>
                        <td>{-1 * item.Credit}</td>
                      </tr>
                    </>
                  ))}
                  <tr className="fst-italic fw-bold">
                    <td colSpan={1}>Total</td>
                    <td>
                      {trialBalanceList
                        .reduce((total, item) => {
                          return (total += item.Debit);
                        }, 0)
                        .toLocaleString()}
                    </td>
                    <td>
                      {trialBalanceList
                        .reduce((total, item) => {
                          return (total += item.Credit * -1);
                        }, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Offcanvas
        show={showCanvas}
        onHide={() => setShowCanvas(false)}
        placement="end"
        className="w-75"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>LedgerReport</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <LedgerReportComponent searchCriteria={searchCriteria} />
        </Offcanvas.Body>
      </Offcanvas>
    </Fragment>
  );
};

export default TrialBalance;
