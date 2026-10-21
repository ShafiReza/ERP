import { useState, useRef } from "react";
import { Row, Col, Form, InputGroup, Nav, Button } from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import { AccountNo, Factory } from "../../components/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactToPrint from "react-to-print";

import { CSVLink } from "react-csv";
import LedgerReportComponent from "../../components/reports/LedgerReportComponent";

const LedgerReport = () => {
  const [searchCriteria, setSearchCriteria] = useState({
    branchId: 1,
  });
  const [localSearchCriteria, setLocalSearchCriteria] = useState({
    branchId: 1,
  });
  const [ledgerReportList, setLedgerReportList] = useState([]);
  let componentRef = useRef();

  const showReport = () => {
    setSearchCriteria(localSearchCriteria);
  };

  const headers = [
    { label: "Transaction No", key: "TransactionNo" },
    { label: "Transaction Date", key: "TransactionDate" },
    { label: "Account Name", key: "AccountName" },
    { label: "Account No", key: "AccountNo" },
    { label: "Debit", key: "Debit" },
    { label: "Credit", key: "Credit" },
  ];
  return (
    <div>
      <Actionbar pageTitle="Ledger Report">
        <CSVLink
          headers={headers}
          data={ledgerReportList}
          filename="LedgerReport"
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
        <Form.Group as={Col} sm="2">
          <AccountNo
            onChange={(value) =>
              setLocalSearchCriteria({
                ...localSearchCriteria,
                accountId: value ? value.value : null,
              })
            }
            placeholder="Select AccountNo"
          />
        </Form.Group>
        <Form.Group as={Col} sm="2">
          <InputGroup>
            <InputGroup.Text>From</InputGroup.Text>
            <Form.Control
              onChange={(e) =>
                setLocalSearchCriteria({
                  ...localSearchCriteria,
                  fromDate: e.target.value,
                })
              }
              type="date"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="2">
          <InputGroup>
            <InputGroup.Text>To</InputGroup.Text>
            <Form.Control
              onChange={(e) =>
                setLocalSearchCriteria({
                  ...localSearchCriteria,
                  toDate: e.target.value,
                })
              }
              type="date"
            />
          </InputGroup>
        </Form.Group>
        <Form.Group as={Col} sm="2">
          <Factory
            onChange={(value) =>
              setLocalSearchCriteria({
                ...localSearchCriteria,
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
      <div ref={(el) => (componentRef = el)}>
        <LedgerReportComponent
          setLedgerReportList={setLedgerReportList}
          searchCriteria={searchCriteria}
        />
      </div>
    </div>
  );
};

export default LedgerReport;
