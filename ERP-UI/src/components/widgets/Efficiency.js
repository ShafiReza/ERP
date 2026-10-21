import { Fragment } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWidgetsValueFetch from "../hooks/useWidgetsValueFetch";

const Efficiency = ({ searchCriteria }) => {
  const [efficiency] = useWidgetsValueFetch(
    "Dashboard/Efficiency?",
    searchCriteria
  );

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <h6 className="text-black-50">Efficiency</h6>
              <h5>{efficiency}%</h5>
              <h6 className="text-black-50">{searchCriteria.floor}</h6>
            </Col>
            <Col className="d-flex justify-content-center align-items-center ">
              <div className="bg-warning bg-opacity-10 rounded-circle">
                <FontAwesomeIcon
                  icon="fa-solid fa-bullseye"
                  className="text-warning fs-1 p-4"
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default Efficiency;
