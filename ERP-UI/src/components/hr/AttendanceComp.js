import {
  Card,
  Table,
  Row,
  Col,
  Form,
  InputGroup,
  Spinner,
  Button,
} from "react-bootstrap";
import { Fragment, useState, useCallback } from "react";
import useFetch from "../hooks/useFetch";

const AttendanceSheet = () => {
  const user = JSON.parse(localStorage.getItem("user")) ?? {};

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);

  const [searchCriteria, setSearchCriteria] = useState({
    fromDate: firstDayOfMonth.toISOString().substring(0, 10),
    toDate: new Date().toISOString().substring(0, 10),
    cardNo: user?.cardNo,
  });
  const [res, getData] = useFetch();

  const getAttendance = useCallback(() => {
    getData("Attendance?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  return (
    <Fragment>
      <Row className="mt-2">
        <Col>
          <InputGroup>
            <InputGroup.Text>Card No</InputGroup.Text>
            <Form.Control
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  cardNo: e.target.value,
                })
              }
              value={searchCriteria.cardNo}
              readOnly={
                user.role !== "HR_ATTENDANCE" &&
                user.role !== "HR_PAYROLL" &&
                user.role !== "COMPLIANCE" &&
                user.role !== "ADMINISTRATOR"
              }
            />
          </InputGroup>
        </Col>

        <Col>
          <InputGroup>
            <InputGroup.Text>From</InputGroup.Text>
            <Form.Control
              type="date"
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  fromDate: e.target.value,
                })
              }
              value={searchCriteria.fromDate}
            />
          </InputGroup>
        </Col>

        <Col>
          <InputGroup>
            <InputGroup.Text>To</InputGroup.Text>
            <Form.Control
              type="date"
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  toDate: e.target.value,
                })
              }
              value={searchCriteria.toDate}
            />
          </InputGroup>
        </Col>

        <Col sm="2">
          <Button onClick={() => getAttendance()}>Preview</Button>
        </Col>
      </Row>

      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">মাসিক হাজিরা</Card.Title>

              <p className="text-center">
                {searchCriteria.fromDate} থেকে {searchCriteria.toDate}
              </p>

              <Row className="mt-1 bangla-font fw-bold">
                <Col>
                  কার্ড নাম্বার: {res.data?.length > 0 && res.data[0]?.CardNo}
                </Col>
                <Col className="text-center">
                  নাম: {res.data?.length > 0 && res.data[0]?.EmployeeName}
                </Col>
                <Col className="text-end">
                  পদবি: {res.data?.length > 0 && res.data[0]?.DesignationName}
                </Col>
              </Row>

              <Table
                responsive
                striped
                hover
                bordered
                size="sm"
                className="mt-2 bangla-font"
              >
                <thead className="text-center">
                  <tr>
                    <th>দিন </th>
                    <th>বার </th>
                    <th>তারিখ </th>
                    <th>ইন টাইম </th>
                    <th>আউট টাইম </th>
                    <th>মধ্যাহ্ন বিরতি </th>
                    <th>মোট সময় </th>
                    <th>সাধারণ সময় </th>
                    <th>ওভার টাইম</th>
                    <th>স্ট্যাটাস </th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="10" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data?.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.Day}</td>
                      <td>{item.Date}</td>
                      <td>{item.InTime}</td>
                      <td>{item.OutTime}</td>
                      <td>{item.LunchTime}</td>
                      <td>
                        {((item.WorkingHours - item.OTMinutes) / 60).toFixed(2)}
                      </td>
                      <td>{(item.WorkingHours / 60).toFixed(2)}</td>
                      <td>{(item.OTMinutes / 60).toFixed(2)}</td>
                      <td>{item.Status}</td>
                    </tr>
                  ))}
                  <tr className="fw-bold">
                    <td colSpan={7}>Total</td>
                    <td>
                      {res.data
                        .reduce((total, item) => {
                          return (total += item.WorkingHours / 60);
                        }, 0)
                        .toFixed(2)}
                    </td>
                    <td>
                      {res.data
                        .reduce((total, item) => {
                          return (total += item.OTMinutes / 60);
                        }, 0)
                        .toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan="5">
                      <p className="small">
                        Note: P: Present, D: Delay, A: Absent
                        <br /> HD: Holiday, WH: Weekly Holiday
                        <br /> CL: Casual Leave, EL: Earned Leave
                        <br /> ML: Medical Leave, WP: Without Pay
                        <br /> MT: Maternity Leave, CP: Compensatory Leave
                        <br /> SL: Short Leave, SH: Substitute Holiday NJ: Not
                        Join
                      </p>
                    </td>
                    <td colSpan="5" className="text-end fw-bold bangla-font">
                      উপস্থিত সংখ্যা:
                      {
                        res.data.filter(
                          (x) => x.Status === "P" || x.Status === "D"
                        ).length
                      }
                      <br />
                      ছুটির সংখ্যা:
                      {
                        res.data.filter(
                          (x) =>
                            x.Status === "CL" ||
                            x.Status === "ML" ||
                            x.Status === "EL" ||
                            x.Status === "MT"
                        ).length
                      }
                      <br />
                      বন্ধের সংখ্যা:
                      {
                        res.data.filter(
                          (x) => x.Status === "WH" || x.Status === "HD"
                        ).length
                      }
                      <br />
                      মোট হাজিরা সংখ্যা:{res.data.length}
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

export default AttendanceSheet;
