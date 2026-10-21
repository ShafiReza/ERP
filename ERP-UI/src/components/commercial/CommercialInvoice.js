import { Fragment, useRef } from "react";
import { Card, Table, Row, Col, Nav } from "react-bootstrap";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumberToDollar from "../../utils/DollarToTextUtils";

const CommercialInvoice = ({ exportInvoice }) => {
  let componentRef = useRef();
  const totalAmount = exportInvoice?.ShipmentList?.reduce(
    (tot, ele) => (tot += ele.TotalFOB),
    0
  );
  return (
    <Fragment>
      <Row>
        <Col>
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
          <Card ref={(el) => (componentRef = el)}>
            <Card.Title className="text-center">Commercial Invoice</Card.Title>
            <Card.Body>
              <Row>
                <Col>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold">1.Shipper/Exporter:</span>
                      <br />
                      {exportInvoice?.CompanyName} <br />
                      {exportInvoice?.CompanyAddress}
                    </Col>
                  </Row>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold">
                        2.For Account & Risk of Messers:
                      </span>
                      <br />
                      {exportInvoice?.ForAccountandMessers}
                    </Col>
                  </Row>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold">3. Notify Party:</span>
                      <br />
                      {exportInvoice?.NotifyParty} <br />
                      <span className="fw-bold">Also Notify:</span>
                      {exportInvoice?.ThirdNotifyParty}
                    </Col>
                  </Row>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold">4.Carrier:</span> BY SEA
                    </Col>
                  </Row>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold">5.Sailling on or about:</span>{" "}
                    </Col>
                  </Row>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold">6. Invoice No:</span>
                      <br />
                      {exportInvoice?.InvoiceNo} <br />
                      <span className="fw-bold">Invoice Date:</span>
                      {exportInvoice?.InvoiceDate}
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold"> 7. Contract No:</span>
                      <br />
                      {exportInvoice?.ContractNo} <br />
                      <span className="fw-bold">Contract Date:</span>
                      {exportInvoice?.ContractDate}
                    </Col>
                  </Row>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold"> 8. Payment Terms:</span>{" "}
                      {exportInvoice?.SightDays} DAYS <br />
                      <span className="fw-bold text-decoration-underline">
                        BANK DETAILS FOR TT PAYMENT:
                      </span>{" "}
                      <br />
                      {exportInvoice?.BankName}
                      <br />
                      {exportInvoice?.BankAddress}
                      <br />
                      <span className="fw-bold">ACCOUNT NO:</span>{" "}
                      {exportInvoice?.AccountNo}
                      <br />
                      <span className="fw-bold">SWIFT NO:</span>{" "}
                      {exportInvoice?.SwiftNo}
                    </Col>
                  </Row>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold">9. EXP NO:</span>
                      <br />
                      {exportInvoice?.EXP} <br />
                      <span className="fw-bold">EXP Date:</span>
                      {exportInvoice?.EXPDate}
                    </Col>
                  </Row>
                  <Row className="border border-dark-subtle">
                    <Col className="border-end border-dark-subtle">
                      <span className="fw-bold"> 10. Port of Loading:</span>
                      <br />
                      {exportInvoice?.PortOfLoading}
                    </Col>
                    <Col>
                      <span className="fw-bold">11. Final Destination:</span>
                      <br />
                      {exportInvoice?.FinalDestination}
                    </Col>
                  </Row>
                  <Row className="border border-dark-subtle">
                    <Col>
                      <span className="fw-bold"> 12. Remarks:</span>
                      <br />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Table size="sm" bordered>
                    <thead>
                      <th rowSpan={3}>13. Marks and Numbers of PKGS</th>
                      <th colSpan={3} className="text-center">
                        14. Description of Goods
                      </th>
                      <th rowSpan={3}>15. Quantity PCS</th>
                      <th rowSpan={3}>16. Unit Price</th>
                      <th rowSpan={3}>17. Amount(IN US $ DAT)</th>
                    </thead>
                    <thead>
                      <th></th>
                      <th colSpan={3} className="text-center">
                        WEARING APPAREL.
                      </th>
                      <th colSpan={3}></th>
                    </thead>
                    <thead>
                      <th></th>
                      <th>PO NO</th>
                      <th>Style No</th>
                      <th>CTN</th>
                      <th colSpan={3}></th>
                    </thead>
                    <tbody>
                      <tr>
                        <td rowSpan={exportInvoice?.ShipmentList.length + 1}>
                          FRONT MARK: <br />
                          Kontoor US, LLC (Mocksville) <br />
                          1401 US Highway 601 S <br />
                          Kontoor Distribution Ctr-Mocksville <br />
                          Mocksville NC 27028 US
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      {exportInvoice?.ShipmentList.map((item, index) => (
                        <tr key={index}>
                          <td>{item.PONo}</td>
                          <td>{item.StyleNo}</td>
                          <td>{item.CartoonQuantity}</td>
                          <td>{item.ChalanQuantity}</td>
                          <td>{item.FOB}</td>
                          <td>{item.TotalFOB}</td>
                        </tr>
                      ))}
                      <tr>
                        <td></td>
                        <td colSpan={3}>
                          <span className="fw-bold text-decoration-underline">
                            MANUFACTURER'S NAME & ADDRESS:
                          </span>
                          <br />
                          <span className="fw-bold">
                            ARUNIMA SPORTS WEAR LTD.
                          </span>
                          <br />
                          ZIRABO BAZAR
                          <br />
                          ASHULIA, SAVAR
                          <br />
                          DHAKA 1000, BD.
                          <hr />
                          <div className="fw-bold">
                            TOTAL CTN:{" "}
                            {exportInvoice?.ShipmentList.reduce(
                              (tot, itm) => (tot += itm.CartoonQuantity),
                              0
                            )}{" "}
                            CTN
                            <br />
                            TOTAL G.W:{" "}
                            {exportInvoice?.ShipmentList.reduce(
                              (tot, itm) => (tot += itm.GrossWeight),
                              0
                            )}{" "}
                            KGS
                            <br />
                            TOTAL N.W:{" "}
                            {exportInvoice?.ShipmentList.reduce(
                              (tot, itm) => (tot += itm.NetWeight),
                              0
                            )}{" "}
                            KGS
                          </div>
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr className="fw-bold">
                        <td></td>
                        <td colSpan={3}>
                          TOTAL{" "}
                          {exportInvoice?.ShipmentList?.reduce(
                            (tot, ele) => (tot += ele.ChalanQuantity),
                            0
                          )}{" "}
                          PCS{" "}
                          {exportInvoice?.ShipmentList.reduce(
                            (tot, itm) => (tot += itm.CartoonQuantity),
                            0
                          )}{" "}
                          CTN
                        </td>

                        <td>
                          {exportInvoice?.ShipmentList?.reduce(
                            (tot, ele) => (tot += ele.ChalanQuantity),
                            0
                          )}
                        </td>
                        <td></td>
                        <td>
                          $
                          {exportInvoice?.ShipmentList?.reduce(
                            (tot, ele) => (tot += ele.TotalFOB),
                            0
                          )}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr className="text-center fw-bold">
                        <td colSpan={7}> ({NumberToDollar(totalAmount)})</td>
                      </tr>
                      <tr className="text-center">
                        <td colSpan={7}> GOODS FOR EXPORT TO US ONLY</td>
                      </tr>
                    </tfoot>
                  </Table>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default CommercialInvoice;
