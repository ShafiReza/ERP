import Actionbar from "../../components/layout/Actionbar";
import { Fragment } from "react";
import AttendanceComp from "../../components/hr/AttendanceComp";

const AttendanceSheet = () => {
  return (
    <Fragment>
      <Actionbar pageTitle="Attendance Sheet"></Actionbar>

      <AttendanceComp />
    </Fragment>
  );
};

export default AttendanceSheet;
