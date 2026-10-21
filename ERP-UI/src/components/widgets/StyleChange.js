import { Fragment } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWidgetsValueFetch from "../hooks/useWidgetsValueFetch";

const StyleChange = ({ searchCriteria }) => {
  const [styleChangeOvertime] = useWidgetsValueFetch(
    "Dashboard/StyleChangeOverTime?",
    searchCriteria
  );

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <h6 className="text-black-50">Style Change Over Time</h6>
              <h5>{styleChangeOvertime}</h5>
              <h6 className="text-black-50">{searchCriteria.floor}</h6>
            </Col>
            <Col className="d-flex justify-content-center align-items-center ">
              <div className="bg-success bg-opacity-10 rounded-circle">
                <FontAwesomeIcon
                  icon="fa-solid fa-clock"
                  className="text-success fs-1 p-4"
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default StyleChange;
