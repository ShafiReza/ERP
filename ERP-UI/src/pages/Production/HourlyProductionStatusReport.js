import { useEffect, useState } from "react";
import { Card, Button, Table, Row, Col, Form, Spinner } from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { Floor } from "../../components/DropDown";
import { ToastContainer, toast } from "react-toastify";

const HourlyProductionStatusReport = () => {
  const [productionStatusList, setProductionStatusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [localSearchCriteria, setLocalSearchCriteria] = useState({});
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    if (searchCriteria.fromdate) {
      setProductionStatusList([]);
      setLoading(true);
      fetch(
        process.env.REACT_APP_API_URL +
          "Report/HourlyProduction?" +
          new URLSearchParams(searchCriteria),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((response) => {
          if (Array.isArray(response)) {
            setProductionStatusList(response);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, [searchCriteria, toggle]);

  const searchProductionStatus = () => {
    if (
      localSearchCriteria.fromdate &&
      localSearchCriteria.todate &&
      localSearchCriteria.floor
    ) {
      setSearchCriteria(localSearchCriteria);
      setToggle(!toggle);
    } else {
      toast.warn("Please input all field", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div>
      <Actionbar pageTitle="Hourly Production Report"></Actionbar>
      <Row className="">
        <Col>
          <Row className="mt-2">
            <Form.Group as={Col}>
              <Form.Control
                type="Date"
                onChange={(e) =>
                  setLocalSearchCriteria({
                    ...localSearchCriteria,
                    fromdate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Control
                type="Date"
                onChange={(e) =>
                  setLocalSearchCriteria({
                    ...localSearchCriteria,
                    todate: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Floor
                onChange={(value) => {
                  setLocalSearchCriteria({
                    ...localSearchCriteria,
                    floor: value ? value.value : "",
                  });
                }}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Button onClick={searchProductionStatus}>Preview</Button>
            </Form.Group>
          </Row>

          <Row className="mt-2">
            <Col>
              <Card>
                <Card.Body>
                  <Table hover size="sm" striped>
                    <thead>
                      <tr>
                        <th>#</th>

                        <th>Card No</th>
                        <th>Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td colSpan="15" className="text-center">
                            <Spinner animation="border" variant="primary" />
                          </td>
                        </tr>
                      )}
                      {!loading && productionStatusList.length === 0 && (
                        <tr>
                          <td colSpan="15" className="text-center">
                            <b>No data found!</b>
                          </td>
                        </tr>
                      )}
                      {productionStatusList.map((item, i) => {
                        return (
                          <tr key={i}>
                            <td>{i + 1}</td>

                            <td>{item?.CardNo}</td>
                            <td>{item?.Output}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default HourlyProductionStatusReport;
