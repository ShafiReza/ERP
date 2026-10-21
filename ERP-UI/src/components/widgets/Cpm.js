import { Fragment } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWidgetsValueFetch from "../hooks/useWidgetsValueFetch";

const Cpm = ({ searchCriteria }) => {
  const [cpm] = useWidgetsValueFetch(
    "Dashboard/CostPerMinute?",
    searchCriteria
  );

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <h6 className="text-black-50">CPM</h6>
              <h5>{cpm}</h5>
              <h6 className="text-black-50">{searchCriteria.floor}</h6>
            </Col>
            <Col className="d-flex justify-content-center align-items-center ">
              <div className="bg-success bg-opacity-10 rounded-circle">
                <FontAwesomeIcon
                  icon="fa-solid fa-circle-dollar-to-slot"
                  className="text-success fs-1 p-4"
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {/* <Modal
        show={show}
        size="lg"
        onHide={handleClose}
        animation={false}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Efficiency
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {cpmList.map((item, i) => {
              return (
                <Col key={i}>
                  <Card className="shadow">
                    <Card.Body>
                      <Row>
                        <Col>
                          <h6 className="text-black-50">CPM</h6>
                          <h5>{item.efficiency}%</h5>
                          <h6 className="text-black-50">ASWL-{item.floor}</h6>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center ">
                          <div className="bg-success bg-opacity-10 rounded-circle">
                            <FontAwesomeIcon
                              icon="fa-solid fa-percent"
                              className="text-success fs-1 p-4"
                            />
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal> */}
    </Fragment>
  );
};

export default Cpm;
