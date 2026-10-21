import { Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import Mmr from "../components/widgets/Mmr";
import CutToShipment from "../components/widgets/CutToShipment";
import Actionbar from "../components/layout/Actionbar";
// import OrderToShip from "../components/widgets/OrderToShip";
// import OnTimeDelivery from "../components/widgets/OnTimeDelivery";
import CPM from "../components/widgets/Cpm";
import ManPower from "../components/widgets/ManPower";
import NewJoin from "../components/widgets/NewJoin";
import DropOut from "../components/widgets/DroOut";
import { Floor } from "../components/DropDown";
import { useState } from "react";

const Dashboard = () => {
  const [searchCriteria, setSearchCriteria] = useState({ floor: "ASWL -2" });

  return (
    <div>
      <Actionbar pageTitle="Dashboard">
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
      </Actionbar>
      <Row>
        <Col sm="9">
          <Row className="mt-2">
            <Col>
              <ManPower searchCriteria={searchCriteria} />
            </Col>
            <Col>
              <Mmr searchCriteria={searchCriteria} />
            </Col>
            <Col>
              <NewJoin searchCriteria={searchCriteria} />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col>
              <DropOut searchCriteria={searchCriteria} />
            </Col>
            <Col>
              <CPM searchCriteria={searchCriteria} />
            </Col>
            <Col>
              <CutToShipment searchCriteria={searchCriteria} />
            </Col>
            {/* <Col>
              <OrderToShip searchCriteria={searchCriteria} />
            </Col> */}
          </Row>

          <Row className="mt-2">
            {/* <Col sm="4">
              <OnTimeDelivery searchCriteria={searchCriteria} />
            </Col> */}
          </Row>
        </Col>
        <Col sm="3">
          <Card className="mt-2">
            <Card.Header>Tasks</Card.Header>
            <Card.Body>
              <ListGroup as="ol" numbered>
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">Subheading</div>
                    Cras justo odio
                  </div>
                  <Badge bg="primary" pill>
                    14
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">Subheading</div>
                    Cras justo odio
                  </div>
                  <Badge bg="primary" pill>
                    14
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">Subheading</div>
                    Cras justo odio
                  </div>
                  <Badge bg="primary" pill>
                    14
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* <Row className="mt-2">
        <Col>
          <LoadCapacityChart data={loadCapacity} />
        </Col>
        <Col>
          <OrderShippedChart data={data} />
        </Col>
      </Row> */}
    </div>
  );
};

export default Dashboard;
