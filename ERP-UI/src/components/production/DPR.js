import { useState, Fragment, useEffect } from "react";
import { Table, Row, Col, Spinner } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DPR = ({ PurchaseOrderId }) => {
  const [chartData, setChartData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    fetch(
      process.env.REACT_APP_API_URL +
        "ProductionStatus/GetSummary?" +
        new URLSearchParams({ purchaseOrderId: PurchaseOrderId }),
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
          const arr = result.filter((item) => {
            const date = new Date(item?.ProductionDate?.split("T")[0]);
            item.ProductionDate =
              date.getDate() + "/" + Number(date.getMonth() + 1);
            return item.Sewing !== null;
          });
          setChartData(arr);
        }
        setLoader(false);
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
        setLoader(false);
      });
  }, [PurchaseOrderId]);

  return (
    <Fragment>
      {loader ? (
        <div>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <h5>PO No: {chartData[0]?.PurchaseOrderNo}</h5>

          <Row className="mt-3">
            <Col>
              <ResponsiveContainer width="100%" aspect={5}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ProductionDate" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Sewing"
                    stroke="#6610f2"
                    strokeWidth={2}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Col>
          </Row>

          <Row className="mt-2">
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Floor</th>
                  <th>Line</th>
                  <th>Today Sewing</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.ProductionDate}</td>
                    <td>{item.Floor}</td>
                    <td>{item.Line}</td>
                    <td>{item.Sewing}</td>
                  </tr>
                ))}
                <tr className="fw-bold">
                  <td colSpan="4">Total</td>
                  <td>{chartData[0]?.TotalSewing}</td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </>
      )}
    </Fragment>
  );
};

export default DPR;
