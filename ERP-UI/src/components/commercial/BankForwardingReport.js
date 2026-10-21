import { Table, Row, Col, Spinner, Nav } from "react-bootstrap";
import { useEffect, useCallback, useRef } from "react";
import useFetch from "../hooks/useFetch";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../Print.style.css";

const BankForwardingReport = ({ bankForwarding }) => {
  let componentRef = useRef();
  const [res, getData] = useFetch();
  const [bank, getBankData] = useFetch();
  const getBankForwardingByID = useCallback(() => {
    getData("BankForwarding/" + bankForwarding.bankForwardingID, "GET");
    getBankData("Bank/" + bankForwarding.bankID, "GET");
  }, [getData, bankForwarding, getBankData]);

  useEffect(() => {
    getBankForwardingByID();
  }, [getBankForwardingByID]);

  let bgstyle;

  if (res?.data?.CompanyID === 1) {
    bgstyle = `@media print {
       html,
       body {
       background-image: url("aswl.jpg");
    }
   }`;
  } else {
    bgstyle = `@media print {
     html,
     body {
     background-image: url("dmc.jpg");
     }
    }`;
  }

  return (
    <Row>
      <style>
        {bgstyle}
        {`@media print {
            body {
              font-size: 12px;
              width: 210mm;
            }
          }`}
      </style>

      <div className="text-end mb-2">
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => componentRef}
        />
      </div>
      <Col ref={(el) => (componentRef = el)}>
        <div className="printable">
          <div className="d-flex justify-content-between">
            <p className="fw-bold">Date: {res?.data?.BankForwardingDate}</p>
            <p className="fw-bold">Ref: {res?.data?.BankForwardingNo}</p>
          </div>

          <p className="fw-bold">
            To <br /> The Manager <br /> {bank?.data?.BankName} <br />{" "}
            {bank?.data?.BankAddress}
          </p>

          <p className="fw-bold">Dear Sir,</p>
          <p className="fw-bold">
            Subject: Submission of original export documents for total US $
            {res?.data?.InvoiceList?.reduce(
              (total, item) => (total += item.InvoiceValue),
              0
            ).toLocaleString()}{" "}
            and{" "}
            {res?.data?.InvoiceList?.reduce(
              (total, item) => (total += item.InvoiceQuantity),
              0
            ).toLocaleString()}
            PCS and request for endorsement Bills of Lading.
          </p>

          <p>
            We enclose herewith the under noted export documents payment against
            which have already remitted to you by the concerned buyer:
          </p>

          <div>
            <Table striped bordered size="sm">
              <thead className="text-center">
                <tr className="fw-bold">
                  <th>SL</th>
                  <th>Sells Contract No. </th>
                  <th>Comm. Inv. No. </th>
                  <th>Value in US $ </th>
                  <th>EXP No.</th>
                  <th>BL to be endorsed to</th>
                </tr>
              </thead>
              <tbody>
                {res.dataLoading && (
                  <tr>
                    <td colSpan="20" className="text-center">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                )}
                {!res.dataLoading && res.data?.InvoiceList?.length === 0 && (
                  <tr>
                    <td colSpan="20" className="text-center">
                      <b>No data found!</b>
                    </td>
                  </tr>
                )}
                {res?.data?.InvoiceList?.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{res?.data?.ContractNo}</td>
                      <td>{item.InvoiceNo}</td>
                      <td className="text-end pe-2">
                        ${item?.InvoiceValue.toLocaleString()}
                      </td>
                      <td>{item.EXPNo}</td>
                      <td>{item.BLToBeEndorsedTo}</td>
                    </tr>
                  );
                })}

                <tr className="fw-bold">
                  <td colSpan={3}>Total</td>
                  <td className="text-end pe-2">
                    $
                    {res?.data?.InvoiceList?.reduce(
                      (total, item) => (total += item.InvoiceValue),
                      0
                    ).toLocaleString()}
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div style={{ pageBreakInside: "avoid" }}>
            <p>
              Please return the Bills of Lading to us after your endorsement as
              per the above table and credit the proceeds to our account with
              your bank after appropriation of the related BB LC
              liabilities.Thank you,
            </p>
            <p className="mb-3">Sincerely yours,</p>
            <p className="mt-5 pt-5">Managing Director</p>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default BankForwardingReport;
