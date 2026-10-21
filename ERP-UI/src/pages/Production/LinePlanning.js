import { useState, useEffect, useRef, Fragment } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Spinner,
  Button,
  Offcanvas,
  Nav,
  Modal,
} from "react-bootstrap";

import Actionbar from "../../components/layout/Actionbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { SalesOrder } from "../../components/DropDown";
import { ToastContainer, toast } from "react-toastify";

const LinePlanning = () => {
  const [availableResources, setAvailableResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [selectedPO, setSelectedPO] = useState({});
  const [show, setShow] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [title, setTitle] = useState("");
  const handleCloseModal = () => setShow(false);
  const [selectedDate, setSelectedDate] = useState({});
  const [changeList, setChangeList] = useState([]);
  const [idCounter, setIdCounter] = useState(1);
  let colorArr = ["#42f5c2", "#f5b942", "#42f5a7", "#42b3f5", "#42f5f5"];

  const calendarRef = useRef({});

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "LinePlanning", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setEventList(result);
      })
      .catch((err) => {
        console.log("Error check", err);
      });
  }, []);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "ProductionFloors", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (res.ok)
          res.json().then((result) => {
            setAvailableResources(result);
          });
      })
      .catch((err) => {
        console.log("Error check", err);
      });
  }, []);

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const handleEventAdd = (e) => {
    e.preventDefault();

    const totalDay =
      (selectedPO.OrderQuantity * (selectedPO.Sam || 32)) /
      selectedDate?.resource?._resource.extendedProps.AvailableMinutes;
    let endDate = addDays(selectedDate.dateStr, Math.ceil(totalDay));
    let resColor = colorArr[Math.floor(Math.random() * colorArr.length)];

    let newEvent = {
      id: 0,
      title: title,
      purchaseOrderId: selectedPO.PurchaseOrderID,
      resourceId: selectedDate.resource?.extendedProps?.ProductionFloorID,
      start: selectedDate.dateStr,
      end: endDate.toISOString().split("T")[0],
      color: resColor,
      uid: idCounter,
    };

    setIdCounter((pre) => pre + 1);
    // console.log("newRvent", newEvent);

    let api = calendarRef.current.getApi();
    api.addEvent(newEvent);

    setChangeList([...changeList, newEvent]);
    setShow(false);
  };

  const saveEvents = () => {
    fetch(process.env.REACT_APP_API_URL + "LinePlanning", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(changeList),
    })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
        } else {
          response.json().then((data) => {
            toast.error(response.statusText + " - " + data.Message, {
              position: "bottom-right",
            });
          });
        }
      })

      .catch((err) => {
        console.log("Error check", err);
      });
  };

  const getPoById = (id) => {
    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "PurchaseOrders/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setSelectedPO(res);
        setTitle(res.PurchaseOrderNo);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error check", err);
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <Actionbar pageTitle="Line Planning">
        <Nav.Link onClick={saveEvents} className="nav-link text-warning">
          <FontAwesomeIcon icon="fa-solid fa-arrows-rotate" /> Sync
        </Nav.Link>
      </Actionbar>

      <Offcanvas
        show={showCanvas}
        onHide={() => setShowCanvas(false)}
        placement="end"
        className="w-50"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Production Status</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body></Offcanvas.Body>
      </Offcanvas>

      <Row className="mt-2 mb-2">
        <Col>
          <Card>
            <Card.Body>
              <FullCalendar
                ref={calendarRef}
                plugins={[resourceTimelinePlugin, interactionPlugin]}
                initialView="resourceTimelineMonth"
                editable={true}
                selectable={true}
                resourceAreaColumns={[
                  {
                    field: "Floor",
                    headerContent: "Floor",
                  },
                  {
                    field: "Line",
                    headerContent: "Line",
                  },
                ]}
                resources={availableResources}
                resourceAreaWidth="10%"
                events={eventList}
                // eventChange={handleEventChange}
                dateClick={(e) => {
                  setSelectedDate(e);
                  setShow(true);
                }}
                eventDrop={(e) => {
                  // console.log("drop", e);
                  let newObj = {
                    id: Number(e.event.id),
                    title: e.event.title,
                    purchaseOrderId: e.event?.extendedProps?.purchaseOrderId,
                    resourceId: e.newResource?.extendedProps?.ProductionFloorID,
                    start: e.event.startStr,
                    end: e.event.endStr,
                    color: e.oldEvent.backgroundColor,
                    uid: e.event.extendedProps?.uid,
                  };
                  let arr = [...changeList];
                  const index = arr.findIndex(
                    (item) => item.uid === newObj.uid
                  );
                  // console.log("index", index);
                  if (index < 0) {
                    let temp = [...changeList];
                    const idx = temp.findIndex((item) => item.id === newObj.id);
                    if (idx < 0) {
                      setChangeList([...changeList, newObj]);
                    } else {
                      temp[idx] = newObj;
                      setChangeList(temp);
                    }
                  } else {
                    arr[index] = newObj;
                    setChangeList(arr);
                  }
                }}
                eventResize={(e) => {
                  // console.log("resize", e);
                  let newObj = {
                    id: Number(e.event.id),
                    title: e.event.title,
                    purchaseOrderId: e.event?.extendedProps?.purchaseOrderId,
                    resourceId: Number(e.event._def?.resourceIds[0]),
                    start: e.event.startStr,
                    end: e.event.endStr,
                    color: e.oldEvent.backgroundColor,
                    uid: e.event.extendedProps?.uid,
                  };
                  let arr = [...changeList];
                  const index = arr.findIndex(
                    (item) => item.uid === newObj.uid
                  );
                  // console.log("index", index);
                  if (index < 0) {
                    let temp = [...changeList];
                    const idx = temp.findIndex((item) => item.id === newObj.id);
                    if (idx < 0) {
                      //adding into changeList
                      setChangeList([...changeList, newObj]);
                    } else {
                      //replacing if it is already in changeList
                      temp[idx] = newObj;
                      setChangeList(temp);
                    }
                  } else {
                    arr[index] = newObj;
                    setChangeList(arr);
                  }
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={show} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add new Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <SalesOrder
              onChange={(value, action) => {
                getPoById(value.value);
              }}
              name="title"
            />
          </Form.Group>

          {/* <span>
            Floor: {eventInfo?.resource?._resource.extendedProps.Floor} Line:
            {eventInfo?.resource?._resource.extendedProps.Line} Available
            Minutes :{" "}
            {eventInfo?.resource?._resource.extendedProps.AvailableMinutes}
            <br />
            OrderQuantity: {selectedPO?.OrderQuantity}
            <br />
            SAM: {selectedPO?.Sam}
          </span> */}
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <Button variant="primary" disabled className="float-end mt-2">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </Button>
          ) : (
            <Button variant="primary" onClick={handleEventAdd}>
              Add
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default LinePlanning;
