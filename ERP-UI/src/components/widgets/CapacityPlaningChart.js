import { Card } from "react-bootstrap";
import {
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const LoadCapacityChart = (props) => {
  const loadCapacity = [
    {
      Year: 2022,
      Month: "Jan",
      Factory: "ASWL WOVEN",
      PONo: "00001",
      OrderQuantity: 738872,
      RequiredMinutes: 4961076.6,
      Worker: 617,
      Absenteeism: 0.06,
      WorkDays: 24,
      WorkHours: 10,
      Efficiency: 0.75,
      AvailableMinutes: 5011027.2,
      Load: 99,
    },
    {
      Year: 2022,
      Month: "Feb",
      Factory: "ASWL WOVEN",
      PONo: "00002",
      OrderQuantity: 407024,
      RequiredMinutes: 15506419,
      Worker: 1583,
      Absenteeism: 0.06,
      WorkDays: 24,
      WorkHours: 10,
      Efficiency: 0.75,
      AvailableMinutes: 16070616,
      Load: 96,
    },
    {
      Year: 2022,
      Month: "March",
      Factory: "ASWL WOVEN",
      PONo: "00002",
      OrderQuantity: 407024,
      RequiredMinutes: 15506419,
      Worker: 1583,
      Absenteeism: 0.06,
      WorkDays: 24,
      WorkHours: 10,
      Efficiency: 0.75,
      AvailableMinutes: 16070616,
      Load: 96,
    },
    {
      Year: 2022,
      Month: "April",
      Factory: "ASWL WOVEN",
      PONo: "00002",
      OrderQuantity: 407024,
      RequiredMinutes: 15506419,
      Worker: 1583,
      Absenteeism: 0.06,
      WorkDays: 24,
      WorkHours: 10,
      Efficiency: 0.75,
      AvailableMinutes: 16070616,
      Load: 96,
    },
  ];
  return (
    <Card>
      <Card.Body>
        <Card.Title>Load Vs Capacity</Card.Title>
        <ResponsiveContainer width={700} height={250}>
          <BarChart data={props.data ? props.data : loadCapacity}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar name="Load" dataKey="RequiredMinutes" fill="#ffc658" />
            <Bar name="Capacity" dataKey="AvailableMinutes" fill="#86adf0" />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default LoadCapacityChart;
