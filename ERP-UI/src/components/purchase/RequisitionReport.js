import { Table, Row, Col, Nav } from "react-bootstrap";
import { useRef } from "react";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../Print.style.css";

const RequisitionReport = ({ master, requisitionDetails }) => {
  let componentRef = useRef();

  return (
    <Row>
      <style>
        {`@media print {
            body {
              font-size: 12px;
              width: 210mm;
            }
          }`}
      </style>

      <div>
        <div className="text-end">
          <ReactToPrint
            trigger={() => (
              <Nav.Link className="nav-link text-primary">
                <FontAwesomeIcon icon="fa-solid fa-print" /> Print
              </Nav.Link>
            )}
            content={() => componentRef}
          />
        </div>
        <div
          className={master.CompanyId === 1 ? "aswl-pad" : "dmc-pad"}
          ref={(el) => (componentRef = el)}
        >
          {" "}
          <div className="text-center mb-4">
            <h5 className="fw-bold">Purchase Requisition</h5>
          </div>
          <Row className="fw-bold">
            <Col>Requisition No : {master.RequisitionNo}</Col>
            <Col>Department : {master.DepartmentName}</Col>
          </Row>
          <Row className="fw-bold">
            <Col>Requisition Date : {master.RequisitionDate}</Col>
            <Col>Company : {master.Company}</Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <Table bordered striped size="sm">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Description</th>
                    <th className="text-end">Quantity</th>
                    <th>Unit</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {requisitionDetails?.map((x, i) => {
                    return (
                      <tr key={i}>
                        <td>{x.ItemName}</td>
                        <td>{x.ProductDescription}</td>
                        <td className="text-end">{x.Quantity}</td>
                        <td>{x.UnitName}</td>

                        <td className="text-end">{x.UnitPrice}</td>

                        <td className="text-end">{x.UnitPrice * x.Quantity}</td>
                      </tr>
                    );
                  })}
                  <tr className="fw-bold ">
                    <td colSpan={5}> Total</td>
                    <td className="text-end">
                      {requisitionDetails?.reduce(
                        (tot, ele) => (tot += ele.UnitPrice * ele.Quantity),
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row style={{ marginTop: 100 }}>
            <Col></Col>
            <Col className="text-center border-top border-1 border-dark">
              Prepared By
            </Col>
            <Col></Col>
            <Col className="text-center border-top border-1 border-dark">
              Recommended By
            </Col>
            <Col></Col>
            <Col className="text-center border-top border-1 border-dark">
              Approved By
            </Col>
            <Col></Col>
          </Row>
        </div>
      </div>
    </Row>
  );
};

export default RequisitionReport;
