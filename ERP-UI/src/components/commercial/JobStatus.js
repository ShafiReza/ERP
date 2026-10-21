import { Table, Row, Col, Nav, Spinner } from "react-bootstrap";
import { Fragment, useRef, useEffect, useCallback } from "react";
import useFetch from "../hooks/useFetch";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const JobStatus = ({ job }) => {
  const [response, getData] = useFetch();
  let componentRef = useRef();
  const getAllJobStatus = useCallback(() => {
    getData(
      "Job/GetJobBudget?" + new URLSearchParams({ jobId: job?.JobId }),
      "GET"
    );
  }, [getData, job]);

  useEffect(() => {
    getAllJobStatus();
  }, [getAllJobStatus]);
  return (
    <Fragment>
      <Row className="mt-2">
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
            <div className="text-center fw-bold">Arunima Group</div>
            <div className="text-center fw-bold">Job Budget Report</div>
            <div className="d-flex justify-content-between fw-bold">
              <span>Job No: {job?.JobNo}</span>
              <span>Contract No: {job?.ContractNo}</span>
            </div>
            <div className="p-2">
              <Table
                responsive
                striped
                bordered
                size="sm"
                hover
                className="mt-1"
              >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Style No</th>
                    <th>PONo</th>
                    <th>Order Quantity</th>
                    <th>FOB</th>
                    <th>CM</th>
                    <th>RM Budget</th>
                    <th>Total Budget</th>
                    <th>Fabrics</th>
                    <th>Trims</th>
                    <th>Wash</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {response.dataLoading && (
                    <tr>
                      <td colSpan="15" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!response.dataLoading && response.data?.length === 0 && (
                    <tr>
                      <td colSpan="15" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {response?.data?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.StyleNo}</td>
                        <td>{item?.PONo}</td>
                        <td>{item?.OrderQuantity}</td>
                        <td>{item?.FOB}</td>
                        <td>{item?.AgreedCM}</td>
                        <td>{item?.RMBudget}</td>
                        <td>{item?.TotalRMBudget}</td>
                        <td>{item?.FabricsCost}</td>
                        <td>{item?.TrimsCost}</td>
                        <td>{item?.WashCost}</td>
                        <td>{item?.TotalCost}</td>
                      </tr>
                    );
                  })}
                  <tr className="fw-bold">
                    <td colSpan={3}>Total</td>
                    <td>
                      {response.data
                        ?.reduce(
                          (total, item) => (total += item?.OrderQuantity),
                          0
                        )
                        .toLocaleString("en-US", { maximumFractionDigits: 3 })}
                    </td>
                    <td colSpan={3}></td>
                    <td>
                      {response.data
                        ?.reduce(
                          (total, item) => (total += item?.TotalRMBudget),
                          0
                        )
                        .toLocaleString("en-US", { maximumFractionDigits: 3 })}
                    </td>
                    <td colSpan={3}></td>
                    <td>
                      {response.data
                        ?.reduce((total, item) => (total += item?.TotalCost), 0)
                        .toLocaleString("en-US", { maximumFractionDigits: 3 })}
                    </td>
                  </tr>
                  <tr
                    className="text-center align-bottom fw-bold"
                    style={{ height: 100 }}
                  >
                    <td colSpan={4}>Prepared By</td>
                    <td colSpan={4}>Checked By</td>
                    <td colSpan={4}>Approved By</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default JobStatus;
