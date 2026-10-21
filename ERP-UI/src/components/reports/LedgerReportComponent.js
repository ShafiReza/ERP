import { useState, Fragment, useEffect } from "react";
import { Card, Table, Row, Col, Spinner } from "react-bootstrap";

const LedgerReportComponent = ({ searchCriteria, setLedgerReportList }) => {
  const [dataLoader, setDataLoader] = useState(false);
  const [masterList, setMasterList] = useState([]);

  useEffect(() => {
    setDataLoader(true);
    fetch(
      process.env.REACT_APP_API_URL +
        "AccountingReports/Ledger?" +
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
          setMasterList(result);
          if (setLedgerReportList !== null) {
            setLedgerReportList(result);
          }
        }
        setDataLoader(false);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        setDataLoader(false);
      });
  }, [searchCriteria, setLedgerReportList]);

  return (
    <Fragment>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive hover size="sm" striped>
                <thead>
                  <tr>
                    <th>Transaction No</th>
                    <th>Transaction Date</th>
                    <th>Account Name</th>
                    <th>Account No</th>
                    <th>Debit</th>
                    <th>Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {dataLoader && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!dataLoader && masterList.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {masterList.map((item, index) => (
                    <tr key={index}>
                      <td>{item.TransactionNo}</td>
                      <td>{item.TransactionDate}</td>
                      <td>{item.AccountName}</td>
                      <td>{item.AccountNo}</td>
                      <td>{item.Debit}</td>
                      <td>{item.Credit}</td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td colSpan={4} className="text-end">
                      Total:
                    </td>
                    <td>
                      {masterList
                        .reduce((total, item) => {
                          return (total += item.Debit);
                        }, 0)
                        .toLocaleString()}
                    </td>
                    <td>
                      {masterList
                        .reduce((total, item) => {
                          return (total += item.Credit);
                        }, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                  <tr className="fw-bold">
                    <td colSpan={4} className="text-end">
                      Closing Balance:
                    </td>
                    <td colSpan="2">
                      {(
                        masterList.reduce((total, item) => {
                          return (total += item.Debit);
                        }, 0) +
                        masterList.reduce((total, item) => {
                          return (total += item.Credit);
                        }, 0)
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

LedgerReportComponent.defaultProps = {
  setLedgerReportList: null,
};

export default LedgerReportComponent;
