import { useState, useRef } from "react";
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

const BalanceSheet = () => {
  const [dataLoader, setDataLoader] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    branchId: 1,
  });
  const [balanceSheetList, setBalanceSheetList] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [liabilityList, setLiabilityList] = useState([]);
  let componentRef = useRef();



  const showReport = () => {
    setDataLoader(true);
    fetch(
      process.env.REACT_APP_API_URL +
        "AccountingReports/BalanceSheet?" +
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
          const tempAssetArr = result.filter((item) => item.Type === 2);
          const tempLiabilityArr = result.filter((item) => item.Type === 1);
          setAssetList(tempAssetArr);
          setLiabilityList(tempLiabilityArr);
          setBalanceSheetList(result);
        }
        setDataLoader(false);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        setDataLoader(false);
      });
  };

  const headers = [
    { label: "Parent account", key: "ParentAccount" },
    { label: "Subsidiary Account", key: "AccountName" },
    { label: "Amount", key: "Amount" },
  ];

  return (
    <div>
      <Actionbar pageTitle="Balance Sheet">
        <CSVLink
          headers={headers}
          data={balanceSheetList}
          filename="BalanceSheet"
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
            <InputGroup.Text>As on</InputGroup.Text>
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
                  <h4>Assests</h4>
                  <Table responsive striped hover size="sm">
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
                      {!dataLoader && assetList.length === 0 && (
                        <tr>
                          <td colSpan="2" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {assetList.map((item, index) => (
                        <>
                        {(index === 0 ||
                          assetList[index - 1].ParentAccount !==
                            item.ParentAccount) && (
                          <tr
                            className="fst-italic fw-bold"
                            key={item.ParentAccount}
                          >
                            <td>{item.ParentAccount}</td>
                            <td>
                              {assetList
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
                        <td  className="text-center fw-bold">
                          Total
                        </td>
                        <td className="fw-bold">
                          {assetList
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
                  <h4>Liabilities</h4>
                  <Table responsive striped size="sm" hover>
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
                      {!dataLoader && liabilityList.length === 0 && (
                        <tr>
                          <td colSpan="2" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {liabilityList.map((item, index) => (
                         <>
                         {(index === 0 ||
                           liabilityList[index - 1].ParentAccount !==
                             item.ParentAccount) && (
                           <tr
                             className="fst-italic fw-bold"
                             key={item.ParentAccount}
                           >
                             <td>{item.ParentAccount}</td>
                             <td>
                               {liabilityList
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
                          {liabilityList
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

export default BalanceSheet;
