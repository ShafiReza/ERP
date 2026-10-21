import { useState, useRef, Fragment } from "react";
import { Card, Row, Col, Form, Nav } from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import {
  SalesOrder,
  CuttingNo,
  OperationCatogory,
  StyleOperation,
} from "../../components/DropDown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactToPrint from "react-to-print";

const Coupon = () => {
  const [generateCouponList, setCouponList] = useState([]);
  let componentRef = useRef();

  const saveCoupon = async (event) => {
    console.log(event);
    event.preventDefault();

    //alert("Data saved!");

    // const res = await fetch(``, {
    //   body: JSON.stringify(coupon),
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   method: "POST",
    // });

    // const result = await res.json();

    // if (result.status == "OK") {
    //   event.target.reset();
    // } else {
    // }
  };
  var couponlist = [
    {
      BundleNo: "222",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "222",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "222",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "222",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "222",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "222",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "222",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
    {
      BundleNo: "223",
      SpecNo: "32343",
      SpecName: "Assembly Part Input Pkt",
      CaptionName: "Coupon",
      PONo: "MNDH123",
      CutNo: "2",
      Size: "32",
      Quantity: "33",
      Job: "E",
      Time: "1.9",
      Value: "33",
      Date: "12-12-2022",
    },
  ];
  return (
    <Fragment>
      <Actionbar pageTitle="Coupon">
        <Nav.Link
          onClick={() => {
            setCouponList(couponlist);
          }}
          className="nav-link text-info"
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Generate
        </Nav.Link>
        <Nav.Link
          onClick={() => {
            alert("Delete");
          }}
          className="nav-link text-danger"
        >
          <FontAwesomeIcon icon="fa-solid fa-trash-can" /> Delete
        </Nav.Link>
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => componentRef}
        />
      </Actionbar>
      <Form onSubmit={saveCoupon} method="POST">
        <Row className="mb-3">
          <Col>
            <Row className="mt-3">
              <Col>
                <Card>
                  <Card.Body>
                    <Row className="mb-3">
                      {/* <Form.Group as={Col} name="Buyer">
                        <Buyer />
                      </Form.Group>

                      <Form.Group as={Col} name="Style">
                        <Style />
                      </Form.Group> */}

                      <Form.Group as={Col} name="Po">
                        <SalesOrder />
                      </Form.Group>
                      <Form.Group as={Col} name="CuttingPlan">
                        <CuttingNo />
                      </Form.Group>

                      <Form.Group as={Col} name="OperationCategory">
                        <OperationCatogory />
                      </Form.Group>

                      <Form.Group as={Col} name="StyleOperation">
                        <StyleOperation />
                      </Form.Group>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Card>
                  <Card.Body>
                    <Row
                      className="mb-3 grid-container"
                      ref={(el) => (componentRef = el)}
                    >
                      {generateCouponList?.map((item, i) => {
                        return (
                          <Col
                            className={item.BundleNo !== "222" ? "break" : ""}
                            key={i}
                          >
                            <div className="border m-1 text-center fw-bold">
                              <div>BDL:{item.BundleNo}</div>

                              <div>
                                PO:{item.PONo}&emsp; Cut:{item.CutNo}{" "}
                              </div>
                              <div>
                                Bdl:{item.BundleNo}&emsp; Size:
                                {item.Size} &emsp; Qty:{item.Quantity}{" "}
                              </div>
                              <div>
                                Job:{item.Job} &emsp;Time :{item.Time} &emsp;
                                BDT:{item.Value} &emsp; Date:
                                {item.Date}
                              </div>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default Coupon;
