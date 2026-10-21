import { useState, Fragment, useEffect } from "react";
import { Table, Row, Col, Spinner } from "react-bootstrap";

const InventorySummary = ({ searchCriteria, setItemExportList }) => {
  const [dataLoader, setDataLoader] = useState(false);
  const [masterList, setMasterList] = useState([]);

  useEffect(() => {
    setDataLoader(true);
    fetch(
      process.env.REACT_APP_API_URL +
        "Inventory?" +
        new URLSearchParams(searchCriteria),
      {
        method: "GET",
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
          if (setItemExportList !== null) {
            setItemExportList(result);
          }
        }
        setDataLoader(false);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        setDataLoader(false);
      });
  }, [searchCriteria, setItemExportList]);

  return (
    <Fragment>
      <Row>
        <Col>
          <Table responsive striped hover size="sm" bordered>
            <thead>
              <tr>
                <th>Style No</th>
                <th>PO No</th>
                <th>PI No</th>
                <th>BL NO</th>
                <th>Item Category</th>
                <th>Item Description</th>
                <th>Item Size</th>
                <th>Item Color</th>
                <th>Unit</th>
                <th>Booking Quantity</th>
                <th>Received Quantity</th>
                <th>Due Quantity</th>
                <th>Issued Quantity</th>
                <th>Balance Quantity</th>
              </tr>
            </thead>
            <tbody>
              {dataLoader && (
                <tr>
                  <td colSpan="14" className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </td>
                </tr>
              )}
              {!dataLoader && masterList.length === 0 && (
                <tr>
                  <td colSpan="14" className="text-center">
                    <b>No data found!</b>
                  </td>
                </tr>
              )}
              {masterList.map((item, index) => (
                <tr key={index}>
                  <td>{item.StyleNo}</td>
                  <td>{item.PONo}</td>
                  <td>{item.PINo}</td>
                  <td>{item.BLNo}</td>
                  <td>{item.ItemCategory}</td>
                  <td>{item.ItemDescription}</td>
                  <td>{item.ItemSize}</td>
                  <td>{item.ItemColor}</td>
                  <td>{item.Unit}</td>
                  <td>{item.BookingQuantity}</td>
                  <td>{item.ReceivedQuantity}</td>
                  <td>{item.DueQuantity}</td>
                  <td>{item.IssuedQuantity}</td>
                  <td>{item.BalanceQuantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Fragment>
  );
};

InventorySummary.defaultProps = {
  setItemExportList: null,
};

export default InventorySummary;
