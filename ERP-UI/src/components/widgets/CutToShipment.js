import { Fragment } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWidgetsValueFetch from "../hooks/useWidgetsValueFetch";

const CutToShipment = ({ searchCriteria }) => {
  const [cts] = useWidgetsValueFetch("Dashboard/CutToShip?", searchCriteria);

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <h6 className="text-black-50">Cut To Ship</h6>
              <h5>{cts}%</h5>
              <h6 className="text-black-50">{searchCriteria.floor}</h6>
            </Col>
            <Col className="d-flex justify-content-center align-items-center ">
              <div className="bg-info bg-opacity-10 rounded-circle">
                <FontAwesomeIcon
                  icon="fa-solid fa-ship"
                  className="text-info fs-1  p-4 "
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default CutToShipment;
