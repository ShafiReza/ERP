import { Card } from "react-bootstrap";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const OrderShippedChart = (props) => {
  const data2 = [
    {
      month: "Jan",
      Order: 4000,
      Shipped: 2400,
    },
    {
      month: "Feb",
      Order: 4000,
      Shipped: 2400,
    },
    {
      month: "Mar",
      Order: 4000,
      Shipped: 3000,
    },
    {
      month: "Apr",
      Order: 4000,
      Shipped: 3000,
    },
    {
      month: "May",
      Order: 4000,
      Shipped: 3000,
    },
    {
      month: "June",
      Order: 4000,
      Shipped: 3000,
    },
  ];
  return (
    <Card>
      <Card.Body>
        <Card.Title>Order vs Shipped</Card.Title>
        <BarChart
          width={700}
          height={250}
          data={props.data ? props.data : data2}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Order" fill="#8884d8" />
          <Bar dataKey="Shipped" fill="#82ca9d" />
        </BarChart>
      </Card.Body>
    </Card>
  );
};

export default OrderShippedChart;
