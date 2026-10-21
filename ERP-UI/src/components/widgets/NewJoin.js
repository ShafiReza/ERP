import { Fragment } from "react";
import { Col, Row, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useWidgetsValueFetch from "../hooks/useWidgetsValueFetch";

const NewJoin = ({ searchCriteria }) => {
  const [newJoin] = useWidgetsValueFetch("Dashboard/NewJoin?", searchCriteria);

  return (
    <Fragment>
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <h6 className="text-black-50">New Join</h6>
              <h5>{newJoin}</h5>
              <h6 className="text-black-50">{searchCriteria.floor}</h6>
            </Col>
            <Col className="d-flex justify-content-center align-items-center ">
              <div className="bg-primary bg-opacity-10 rounded-circle">
                <FontAwesomeIcon
                  icon="fa-solid fa-user-plus"
                  className="text-primary fs-1 p-4"
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default NewJoin;
