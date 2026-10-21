import { useState, useRef, createRef } from "react";
import {
  Card,
  Table,
  Row,
  Col,
  Form,
  Spinner,
  InputGroup,
  Nav,
  Button,
} from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Factory } from "../../components/DropDown";
import ReactToPrint from "react-to-print";

import { CSVLink } from "react-csv";
const csvLink = createRef();

const ProfitLossStatement = () => {
  const [dataLoader, setDataLoader] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    branchId: 1,
  });
  const [itemExportList, setItemExportList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  let componentRef = useRef();

  const showReport = () => {
    setDataLoader(true);
    fetch(
      process.env.REACT_APP_API_URL +
        "AccountingReports/ProfitLosstStatement?" +
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
        if (result.length > 0) {
          const tempIncomeArr = result.filter((item) => item.Type === 4);
          const tempExpenseArr = result.filter((item) => item.Type === 3);
          setIncomeList(tempIncomeArr);
          setExpenseList(tempExpenseArr);
        }

        setDataLoader(false);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        setDataLoader(false);
      });
  };

  const getExcelData = () => {
    if (searchCriteria.fromDate && searchCriteria.toDate && searchCriteria.branchId) {
      fetch(
        process.env.REACT_APP_API_URL +
        "AccountingReports/ProfitLosstStatement?" +
        new URLSearchParams(searchCriteria),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((response) => {
          if (Array.isArray(response)) {
        
              const tempArr = [];
              const obj = {};
              response.forEach((item) => {
                if (!obj[item.ParentAccount]) {
                  obj[item.ParentAccount] = 1;
                } else {
                  item.ParentAccount = "_";
                }
                tempArr.push(item);
              });
              setItemExportList(tempArr);
            
            setTimeout(() => {
              csvLink.current.link.click();
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const headers = [
    { label: "Parent account", key: "ParentAccount" },
    { label: "Subsidiary Account", key: "AccountName" },
    { label: "Amount", key: "Amount" },
  ];

  return (
    <div>
      <Actionbar pageTitle="Profit Loss Statement">
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="ProfitLossStatement"
          className="hidden"
          ref={csvLink}
        />
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
              <Row>
              <Col>
                <h4>Income</h4>
                <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                  <th>Account Head</th>
                  <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoader && (
                    <tr>
                      <td colSpan="2" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!dataLoader && incomeList.length === 0 && (
                    <tr>
                      <td colSpan="2" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {incomeList.map((item, index) => (
                      <>
                      {(index === 0 ||
                        incomeList[index - 1].ParentAccount !==
                          item.ParentAccount) && (
                        <tr
                          className="fst-italic fw-bold"
                          key={item.ParentAccount}
                        >
                          <td>{item.ParentAccount}</td>
                          <td>
                            {incomeList
                              .filter(
                                (x) => x.ParentAccount === item.ParentAccount
                              )
                              .reduce((total, el) => {
                                return (total += el.Amount);
                              }, 0)}
                          </td>
                         
                        </tr>
                      )}

                      <tr
                        key={item.AccountNo}
                
                      >
                        <td className="ps-5">
                        {item.AccountNo}-{item.AccountName}
                        </td>
                        <td>{item.Amount}</td>
                      </tr>
                    </>
                  ))}
                  <tr>
                    <td className="text-center fw-bold">
                      Total
                    </td>
                    <td className="fw-bold">
                      {incomeList
                        .reduce((total, item) => {
                          return (total += item.Amount);
                        }, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
              </Col>
                <Col>
                <h4>Expenses</h4>
                <Table responsive hover striped size="sm">
                <thead>
                  <tr>
                  <th>Account Head</th>
                  <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoader && (
                    <tr>
                      <td colSpan="2" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!dataLoader && expenseList.length === 0 && (
                    <tr>
                      <td colSpan="2" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {expenseList.map((item, index) => (
                      <>
                      {(index === 0 ||
                        expenseList[index - 1].ParentAccount !==
                          item.ParentAccount) && (
                        <tr
                          className="fst-italic fw-bold"
                          key={item.ParentAccount}
                        >
                          <td>{item.ParentAccount}</td>
                          <td>
                            {expenseList
                              .filter(
                                (x) => x.ParentAccount === item.ParentAccount
                              )
                              .reduce((total, el) => {
                                return (total += el.Amount);
                              }, 0)}
                          </td>
                         
                        </tr>
                      )}

                      <tr
                        key={item.AccountNo}
                
                      >
                        <td className="ps-5">
                        {item.AccountNo}-{item.AccountName}
                        </td>
                        <td>{item.Amount}</td>
                      </tr>
                    </>
                  ))}
                  <tr>
                    <td className="text-center fw-bold">
                      Total
                    </td>
                    <td className="fw-bold">
                      {expenseList
                        .reduce((total, item) => {
                          return (total += item.Amount);
                        }, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
              </Col>
              
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfitLossStatement;
