import { Fragment, useState } from "react";
import { Table, Form, Row, Col } from "react-bootstrap";
import useGetAll from "../hooks/useGetAll";

const OrderSummary = ({ searchCriteria }) => {
  const [searchText, setSearchText] = useState("");
  const [res] = useGetAll("PurchaseOrders?", searchCriteria, 1);

  const filteredData = res.data.filter((el) => {
    if (searchText === "") {
      return el;
    } else {
      return (
        el.StyleNo.toLowerCase().includes(searchText) ||
        el.Sam.toString().toLowerCase().includes(searchText) ||
        el.PurchaseOrderNo.toLowerCase().includes(searchText) ||
        el.ExitDate.toLowerCase().includes(searchText) ||
        el.OrderQuantity.toString().toLowerCase().includes(searchText)
      );
    }
  });

  return (
    <Fragment>
      <Row className="mb-2 justify-content-end">
        <Col sm="4">
          <Form.Group>
            <Form.Control
              placeholder="Search"
              onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table responsive striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Style No</th>
                <th>SAM</th>
                <th>PONo</th>
                <th>Order Qty</th>
                <th>Exit Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.StyleNo}</td>
                  <td>{item.Sam}</td>
                  <td>{item.PurchaseOrderNo}</td>
                  <td>{item.OrderQuantity}</td>
                  <td>{item.ExitDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Fragment>
  );
};

export default OrderSummary;
