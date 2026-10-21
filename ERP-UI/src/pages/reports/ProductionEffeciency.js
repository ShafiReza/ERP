import { useState, useRef, useEffect, useCallback, Fragment } from "react";
import { Row, Col, Card, Spinner, Nav, Table, Form } from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactToPrint from "react-to-print";
import useFetch from "../../components/hooks/useFetch";
import { Floor } from "../../components/DropDown";

const ProductionEffeciency = () => {
  const [searchCriteria, setSearchCriteria] = useState({});

  let componentRef = useRef();
  const [res, fetchSewingSummary] = useFetch();

  const getProductionByEmployee = useCallback(() => {
    fetchSewingSummary(
      "Report/EmployeeProductionStatus?" + new URLSearchParams(searchCriteria),
      "GET"
    );
  }, [fetchSewingSummary, searchCriteria]);

  useEffect(() => {
    if (
      searchCriteria.fromdate &&
      searchCriteria.todate &&
      searchCriteria.floor
    ) {
      getProductionByEmployee();
    }
  }, [getProductionByEmployee, searchCriteria]);

  return (
    <div>
      <Actionbar pageTitle="Production Effeciency">
        <ReactToPrint
          trigger={() => (
            <Nav.Link className="nav-link text-primary">
              <FontAwesomeIcon icon="fa-solid fa-print" /> Print
            </Nav.Link>
          )}
          content={() => componentRef}
        />
      </Actionbar>

      <Row className="mt-2">
        <Col sm="3">
          <Form.Control
            type="date"
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                fromdate: e.target.value,
              })
            }
          />
        </Col>
        <Col sm="3">
          <Form.Control
            type="date"
            onChange={(e) =>
              setSearchCriteria({
                ...searchCriteria,
                todate: e.target.value,
              })
            }
          />
        </Col>
        <Col sm="3">
          <Floor
            onChange={(value, action) =>
              setSearchCriteria({
                ...searchCriteria,

                [action.name]: value ? value.value : null,
              })
            }
            name="floor"
            selected={searchCriteria.floor}
          />
        </Col>
      </Row>

      <Row className="mt-2 mb-2">
        <Col>
          <Card ref={(el) => (componentRef = el)}>
            <Card.Body>
              <Table responsive bordered striped>
                <thead>
                  <tr>
                    <th>Card No</th>
                    <th>Name</th>
                    <th>Designation</th>
                    {res?.data[0]?.Performances.map((ele, i) => (
                      <th key={i}>{ele.Date}</th>
                    ))}
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="16" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data.length === 0 && (
                    <tr>
                      <td colSpan="16" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <Fragment key={index}>
                      <tr>
                        <td>{item.CardNo}</td>
                        <td>{item.EmployeeName}</td>
                        <td></td>
                        {item.Performances.map((ele, i) => (
                          <td key={i}>{ele.Output}</td>
                        ))}
                        <td>{item.TotalProduction}</td>
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductionEffeciency;
