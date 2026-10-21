import { Fragment } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWidgetsValueFetch from "../hooks/useWidgetsValueFetch";

const DowntimePercent = ({ searchCriteria }) => {
  const [dtp] = useWidgetsValueFetch("Dashboard/Downtime?", searchCriteria);

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <h6 className="text-black-50">Downtime Percentage</h6>
              <h5>{dtp}%</h5>
              <h6 className="text-black-50">{searchCriteria.floor}</h6>
            </Col>
            <Col className="d-flex justify-content-center align-items-center ">
              <div className="bg-danger bg-opacity-10 rounded-circle">
                <FontAwesomeIcon
                  icon="fa-solid fa-arrow-trend-down"
                  className="text-danger fs-1 p-4"
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default DowntimePercent;
