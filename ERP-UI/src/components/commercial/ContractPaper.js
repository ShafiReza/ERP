import { Table, Row, Col, Nav, Spinner } from "react-bootstrap";
import { useRef, useCallback, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ContractPaper = ({ job }) => {
  const [contractPaperlist, getData] = useFetch();
  const [buyer, getBuyerData] = useFetch();
  let componentRef = useRef();
  const getAllJobStatus = useCallback(() => {
    getData(
      "PurchaseOrders?" + new URLSearchParams({ jobId: job?.JobId }),
      "GET"
    );
    getBuyerData("Buyer/" + job?.BuyerID, "GET");
  }, [getData, job, getBuyerData]);

  useEffect(() => {
    getAllJobStatus();
  }, [getAllJobStatus]);

  console.log("buyer", buyer);

  return (
    <Row>
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
      <Col>
        <div ref={(el) => (componentRef = el)}>
          <div className="d-flex justify-content-center">
            <div>
              <img alt=""></img>
            </div>
            <div>
              <h2>
                <b>KONTOOR ASIA TRADING LTD.</b>
              </h2>
            </div>
          </div>
          <div className="text-center">
            <p>
              26/F C-BONS INT'L CTR NO. 108,Wai Yip Street,KWUN TONG HK,999077
              HK
            </p>
          </div>
          <div className="text-center">
            <h2>
              <b>Sales & Purchase Contract</b>
            </h2>
          </div>
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <p className="ms-2 me-5">
                <b>Contract No: </b>
              </p>
              <p className="ms-2">
                <b>{job?.ContractNo}</b>
              </p>
            </div>
            <div className="d-flex me-2">
              <p className="me-2">
                <b>Date: </b>
              </p>
              <p className="ms-4">
                <b>{job?.ContractDate}</b>
              </p>
            </div>
          </div>
          <div className="ms-2 d-flex">
            <p className="pt-0 me-5">
              <b>Buyer:</b>
            </p>
            <p className="ms-5">
              {buyer?.data?.BuyerName} <br></br> {buyer?.data?.BuyerAddress}
            </p>
          </div>
          <div className="ms-2 d-flex">
            <p className="pt-0 me-5">
              <b>Seller:</b>
            </p>
            <p className="ms-5">
              DMC APPARELS LTD <br></br> Holding No-157/8 Road-01 <br></br>{" "}
              Ward-08 Block-D Zirabo Ashulia Savar <br></br> Dhaka-1341
              Bangladesh
            </p>
          </div>
          <div className="mt-2 ms-2 d-flex justify-content-between">
            <div>
              <p>
                <b>Amendment No:</b>
              </p>
            </div>
            <div className="d-flex me-2">
              <p className="me-2">
                <b>Date:</b>
              </p>
              <p className="ms-4">
                <b>27-Sep-22</b>
              </p>
            </div>
          </div>
          <div className="mt-3 ms-2">
            <p>
              <u>Details of finished Goods</u>
            </p>
          </div>

          <div className="p-2">
            <Table hover striped bordered size="sm" responsive>
              <thead className="text-center">
                <tr>
                  <th>Po</th>
                  <th>Style No </th>
                  <th>Description </th>
                  <th>Qty In Pcs </th>
                  <th>Unit PX In (FOB)</th>
                  <th>FOB Unit Price (US$)</th>
                  <th>Total Amount In US$</th>
                  <th>P.O.Exit Date (Ex Country)</th>
                </tr>
              </thead>
              <tbody>
                {contractPaperlist.dataLoading && (
                  <tr>
                    <td colSpan="12" className="text-center">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                )}
                {!contractPaperlist.dataLoading &&
                  contractPaperlist.data?.length === 0 && (
                    <tr>
                      <td colSpan="12" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                {contractPaperlist?.data?.map((item, i) => (
                  <tr key={i}>
                    <td style={{ width: "150px" }}>{item.PurchaseOrderNo}</td>
                    <td>{item.StyleNo}</td>
                    <td>{item?.Description}</td>
                    <td>{item?.OrderQuantity}</td>
                    <td>{item?.FOB}</td>
                    <td>{item?.UnitPrice}</td>
                    <td>
                      {(item.OrderQuantity * item.FOB).toLocaleString("en-US", {
                        minimumFractionDigits: 4,
                      })}
                    </td>
                    <td>{item?.ExitDate}</td>
                  </tr>
                ))}
                <tr className="fw-bold">
                  <td colSpan={3} className="text-center ">
                    Total
                  </td>
                  <td>
                    {contractPaperlist?.data?.reduce(
                      (tot, itm) => (tot += itm.OrderQuantity),
                      0
                    )}
                  </td>
                  <td colSpan={2}></td>
                  <td>
                    {contractPaperlist?.data
                      ?.reduce(
                        (tot, itm) => (tot += itm.OrderQuantity * itm.FOB),
                        0
                      )
                      .toLocaleString("en-US", {
                        minimumFractionDigits: 4,
                      })}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="ms-2">
            <h6>
              <b>
                Six Hundred Five Thousand Thirty Eight Dollars and Sixteen Cents
              </b>
            </h6>
          </div>
          <div className="ms-2 mt-2">
            <h6>
              <b>
                Terms & Conditions of this Contract are specified here under:
              </b>
            </h6>
          </div>
          <div className="ms-2 mb-5">
            <p>
              1. The Seller shall manufacture the Garments on Buyer’s
              instructions/design/specification. <br></br> 2. The terms of
              delivery of finished goods shall be on FOB basis. <br></br>3. Mode
              of delivery shall be by Sea or By Air.<br></br> 4. Documents
              require: <br></br>(a) Commercial Invoice 1 3 Copies. <br></br>(b)
              Packing List 1 3 Copies. <br></br>(c) Inspection Certificate
              issued by Buyer’s designated representative 1 Original + <br></br>
              (d) Full set of original Ocean Bill of Lading/Forwarders cargo
              receipts issued to the order of negotiating Bank for further
              endorse marked “frieght-collect”. <br></br>(e) Airway Bill/House
              Airway Bill consigned to the Buyer (KONTOOR ASIA TRADING LTD)
              <br></br> 5. Expiry Date will be effected after 25 days from
              individual P.O. exit date.<br></br> 6. Payment terms: 75 days
              after goods ex country<br></br> 7. On any point both seller &
              Buyer shall make alterations or additions at their mutual
              arrangements/ understandings. <br></br>8. Buyer handles all
              shipping Arrangements from ex origin country to FOB port.{" "}
              <br></br>9. Seller agrees to abide the KONTOOR Umbrella Purchase
              Orders Terms and conditions together with buyer’s standard
              Operating procedures and other terms and conditions communicated
              in writing by buyer or buyer’s agent to seller in 'connection with
              the purchase order. Terms & Conditions of this Contract are
              specified here under:<br></br> 10. The quantity, Unit Price &
              Delivery date will comply with KONTOOR NGC P.O.<br></br> 11.
              Notify party same as buyer. <br></br>12. Shipment allow :- 5% more
              or less<br></br> 13. Port of Delivery:- Chittagong, Bangladesh
              <br></br> 14. Destination:- Any Port Of UK, USA , CANADA, CHILE,
              THAILAND & PERAGUA For and on behalf of
            </p>
          </div>
          <div className="ms-2 mt-5">
            <p>
              <b>DMC APPARELS LTD</b>
            </p>
            <p className="mt-5">
              ...........................................<br></br>Authorized
              Signature
            </p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="ms-2">
              <b>
                ONE Bank Ltd <br></br> Uttara Brance ,Dhaka, bangladesh.
                <br></br> House no 14/B, Road no #14 , Section #4,<br></br>{" "}
                Uttara, Dhaka , Bangladesh<br></br> A/C no #0061020000183
              </b>
            </p>
            <p className="me-2">
              The HongKong and Shanghai Banking <br></br> Corporation Ltd. Level
              14,Hsbc Building <br></br>Mongkok,673, Nathan Road, <br></br>
              Mongkok,kowloon,HongKong.
            </p>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default ContractPaper;
