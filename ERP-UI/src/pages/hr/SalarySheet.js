import { Card, Table, Row, Col, Button, Spinner, Nav } from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { Fragment,useEffect, createRef } from "react";
import { Floor, Month, Year } from "../../components/DropDown";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const csvLink = createRef();

const SalarySheet = () => {
  const [salarySheetList, setSalarySheetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [localSearchCriteria, setLocalSearcheCriteria] = useState({});
  const [itemExportList, setItemExportList] = useState([]);

  useEffect(() => {
    if (searchCriteria.year && searchCriteria.month && searchCriteria.floor) {
      setLoading(true);
      fetch(
        process.env.REACT_APP_API_URL +
        "Report/GetSalarySheet?" +
        new URLSearchParams(searchCriteria),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          setSalarySheetList(result);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [searchCriteria]);

  const getExcelData=()=>{
    if (searchCriteria.year && searchCriteria.month && searchCriteria.floor) {
      fetch(
        process.env.REACT_APP_API_URL +
        "Report/GetSalarySheet?" +
        new URLSearchParams(searchCriteria),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => {
          if (Array.isArray(result)) {
            setItemExportList(result);
            setTimeout(() => {
              csvLink.current.link.click();
            }, 1000);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const getSalarySheet = () => {
    setSearchCriteria(localSearchCriteria);
  };

  const headers = [
    { label: "Floor", key: "Floor" },
    { label: "Section", key: "Section" },
    { label: "Name", key: "Name" },
    { label: "Designation Name", key: "DesignationName" },
    { label: "Joining Date", key: "JoiningDate" },
    { label: "NID", key: "NID" },
    { label: "Card No", key: "CardNo" },
    { label: "Grade", key: "Grade" },
    { label: "Mobile No", key: "MobileNo" },
    { label: "Basic", key: "Basic" },
    { label: "House Rent", key: "HouseRent" },
    { label: "Medical Allowance", key: "MedicalAllowance" },
    { label: "Conveyance", key: "Conveyance" },
    { label: "Food Allowance", key: "FoodAllowance" },
    { label: "Gross Wage", key: "GrossWage" },
    { label: "PD", key: "PD" },
    { label: "HD", key: "HD" },
    { label: "Casual Leave", key: "CasualLeave" },
    { label: "Earned Leave", key: "EarnedLeave" },
    { label: "Medical Leave", key: "MedicalLeave" },
    { label: "Maternity Leave", key: "MaternityLeave" },
    { label: "SH", key: "SH" },
    { label: "SL", key: "SL" },
    { label: "TWD", key: "TWD" },
    { label: "Attendance Bonus", key: "AttendanceBonus" },
    { label: "Absent Days", key: "AbsentDays" },
    { label: "Absent Amount", key: "AbsentAmount" },
    { label: "Advance", key: "Advance" },
    { label: "Food", key: "Food" },
    { label: "Tax", key: "Tax" },
    { label: "Fine", key: "Fine" },
    { label: "Loan", key: "Loan" },
    { label: "Payable Wages", key: "PayableWages" },
    { label: "OTH", key: "OTH" },
    { label: "OT Rate", key: "OTRate" },
    { label: "OT Taka", key: "OTTaka" },
    { label: "Total Pay", key: "TotalPay" },
    { label: "MFSNo", key: "MFSNo" },
    { label: "Account No", key: "AccountNo" },
    { label: "Bank Name", key: "BankName" },
  ];

  return (
    <Fragment>
      <Actionbar pageTitle="Salary Sheet">
      <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="SalarySheet.csv"
          className="hidden"
          ref={csvLink}
        />
      </Actionbar>

      <Row className="mt-2">
        <Col>
          <Year
            onChange={(value) => {
              setLocalSearcheCriteria({
                ...localSearchCriteria,
                year: value ? value.value : null,
              });
            }}
          />
        </Col>
        <Col>
          <Month
            onChange={(value) => {
              setLocalSearcheCriteria({
                ...localSearchCriteria,
                month: value ? value.value : null,
              });
            }}
          />
        </Col>
        <Col>
          <Floor
            onChange={(value) => {
              setLocalSearcheCriteria({
                ...localSearchCriteria,
                floor: value ? value.value : null,
              });
            }}
          />
        </Col>
        <Col>
          <Button onClick={getSalarySheet}>Preview</Button>
        </Col>
      </Row>

      <Row className="mt-2 mb-2">
        <Col>
          <Card>
            <Card.Body>
              <Table responsive striped hover bordered>
                <thead>
                  <tr className="text-center">
                    <th style={{minWidth: 100}}>Floor</th>
                    <th style={{minWidth: 100}}>Section</th>
                    <th style={{minWidth: 200}}>Employee Name</th>
                    <th style={{minWidth: 200}}>Designation Name</th>
                    <th style={{minWidth: 100}}>Joining Date</th>
                    <th>NID</th>
                    <th>Card No</th>
                    <th>Grade</th>
                    <th>Mobile No</th>
                    <th>Basic</th>
                    <th>House Rent</th>
                    <th>Medical Allowance</th>
                    <th>Conveyance</th>
                    <th>Food Allowance</th>
                    <th>Gross Wages</th>
                    <th>PD</th>
                    <th>HD</th>
                    <th>CL</th>
                    <th>EL</th>
                    <th>ML</th>
                    <th>MT</th>
                    <th>SH</th>
                    <th>SL</th>
                    <th>TWD</th>
                    <th>Attendance Bonus</th>
                    <th>Absent Days</th>
                    <th>Absent Amount</th>
                    <th>Advance</th>
                    <th>Time Deduct</th>
                    <th>Tax</th>
                    <th>Fine</th>
                    <th>Loan</th>
                    <th>Payable Salary</th>
                    <th>OT Hour</th>
                    <th>OT Rate</th>
                    <th>OT Taka</th>
                    <th>Total Pay</th>
                    <th>Cash Out Charge</th>
                    <th>OK Wallet No</th>
                    <th>Account No</th>
                    <th>Bank Name</th>
                  </tr>
                </thead>
                <tbody >
                  {loading && (
                    <tr>
                      <td colSpan="30" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!loading && salarySheetList?.length === 0 && (
                    <tr>
                      <td colSpan="30" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {salarySheetList.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Floor}</td>
                      <td>{item.Section}</td>
                      <td>{item.Name}</td>
                      <td>{item.DesignationName}</td>
                      <td>{item.JoiningDate}</td>
                      <td>{item.NID}</td>
                      <td>{item.CardNo}</td>
                      <td>{item.Grade}</td>
                      <td>{item.MobileNo}</td>
                      <td>{item.Basic}</td>
                      <td>{item.HouseRent}</td>
                      <td>{item.MedicalAllowance}</td>
                      <td>{item.Conveyance}</td>
                      <td>{item.FoodAllowance}</td>
                      <td>{item.GrossWage}</td>
                      <td>{item.PD}</td>
                      <td>{item.HD}</td>
                      <td>{item.CasualLeave}</td>
                      <td>{item.EarnedLeave}</td>
                      <td>{item.MedicalLeave}</td>
                      <td>{item.MaternityLeave}</td>
                      <td>{item.SH}</td>
                      <td>{item.SL}</td>
                      <td>{item.TWD}</td>
                      <td>{item.AttendanceBonus}</td>
                      <td>{item.AbsentDays}</td>
                      <td>{item.AbsentAmount}</td>
                      <td>{item.Advance}</td>
                      <td>{item.Food}</td>
                      <td>{item.Tax}</td>
                      <td>{item.Fine}</td>
                      <td>{item.Loan}</td>
                      <td>{item.PayableWages}</td>
                      <td>{item.OTH}</td>
                      <td>{item.OTRate}</td>
                      <td>{item.OTTaka}</td>
                      <td>{item.TotalPay}</td>
                      <td></td>
                      <td>{item.MFSNo}</td>
                      <td>{item.AccountNo}</td>
                      <td>{item.BankName}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default SalarySheet;
