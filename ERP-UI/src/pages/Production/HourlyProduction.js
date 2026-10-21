import { Fragment, useEffect, useState } from "react";
import {
  Card,
  Button,
  Table,
  Row,
  Col,
  Form,
  Nav,
  Spinner,
} from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import { SalesOrder, Hour, Floor, FloorLine } from "../../components/DropDown";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HourlyProduction = () => {
  const [validated, setValidated] = useState(false);
  const [productionStatusList, setProductionStatusList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({});
  const [localSearchCriteria, setLocalSearchCriteria] = useState({
    date: new Date().toISOString().split("T")[0],
  });
  const [toggle, setToggle] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  useEffect(() => {
    if (searchCriteria.purchaseOrderId) {
      setProductionStatusList([]);
      setLoading(true);
      fetch(
        process.env.REACT_APP_API_URL +
          "HourlyProduction/GetProductionStatus?" +
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

  const handleKeyPress = (event) => {
    // Allow only numeric values (digits 0-9) and the backspace key
    const regex = /^[0-9\b]+$/;
    if (!regex.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleColumnChange = (e, index) => {
    let { name, value } = e.target;

    let list = [...productionStatusList];
    list[index][name] = value;

    setProductionStatusList(list);
  };

  const deleteRow = (index) => {
    const list = [...productionStatusList];
    list.splice(index, 1);
    setProductionStatusList(list);
  };

  const addRowBillow = (index) => {
    const modifiedArray = [
      ...productionStatusList.slice(0, index + 1),
      {
        Sequence: productionStatusList[index].Sequence,
        Sam: productionStatusList[index].Sam,
        Section: productionStatusList[index].Section,
        SpecNo: productionStatusList[index].SpecNo,
        SpecId: productionStatusList[index].SpecId,
        CardNo: "",
        Output: "",
      },
      ...productionStatusList.slice(index + 1),
    ];
    setProductionStatusList(modifiedArray);
  };

  const searchProductionStatus = () => {
    if (
      localSearchCriteria.purchaseOrderId &&
      localSearchCriteria.section &&
      localSearchCriteria.date &&
      localSearchCriteria.hour &&
      localSearchCriteria.floor &&
      localSearchCriteria.line
    ) {
      setSearchCriteria(localSearchCriteria);
      setToggle(!toggle);
    } else {
      toast.warn("Please input all field", {
        position: "bottom-right",
      });
    }
  };

  const saveProductionStatus = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      setLoading(true);

      const formBody = [];
      if (localSearchCriteria.purchaseOrderId === null) {
        toast.warn("Please select Po", {
          position: "bottom-right",
        });
        return;
      } else {
        productionStatusList.forEach((ele) => {
          formBody.push({
            ...ele,
            PurchaseOrderId: localSearchCriteria.purchaseOrderId,
            Date: localSearchCriteria.date?.split("T")[0],
            Hour: localSearchCriteria.hour,
            Section: localSearchCriteria.section,
            Floor: localSearchCriteria.floor,
            Line: localSearchCriteria.line,
            Output: parseInt(ele.Output),
          });
        });
      }

      fetch(
        process.env.REACT_APP_API_URL + "HourlyProduction/SaveProductionStatus",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formBody),
        }
      ).then((response) => {
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
        setLoading(false);
        setValidated(false);
      });
    }
    setValidated(true);
  };

  useEffect(() => {
    const handleEnterKey = (event) => {
      if (event.key === "Enter" && event.target.nodeName === "INPUT") {
        var form = event.target.form;
        var index = Array.prototype.indexOf.call(form, event.target);
        var nextElement = form.elements[index + 1];

        // Check if the next element exists and is an input field
        if (nextElement && nextElement.nodeName === "INPUT") {
          nextElement.focus();
        } else {
          form.elements[index + 3].focus();
        }
        event.preventDefault();
      }
    };

    document.addEventListener("keydown", handleEnterKey);

    return () => {
      document.removeEventListener("keydown", handleEnterKey);
    };
  }, []);

  return (
    <div>
      <Actionbar pageTitle="Hourly Production">
        <div className="mt-2">
          <Form.Check
            type="switch"
            label="Quality"
            onChange={handleCheckboxChange}
            checked={isChecked}
          />
        </div>

        <Nav.Link to="/support" className="nav-link text-success">
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
      </Actionbar>
      <Row className="">
        <Col>
          <Form
            noValidate
            validated={validated}
            onSubmit={saveProductionStatus}
            method="POST"
          >
            <Row className="mt-2">
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
                <FloorLine
                  onChange={(value) => {
                    setLocalSearchCriteria({
                      ...localSearchCriteria,
                      line: value ? value.value : "",
                    });
                  }}
                  selected={localSearchCriteria.line}
                  floor={localSearchCriteria.floor}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <SalesOrder
                  onChange={(value) => {
                    setLocalSearchCriteria({
                      ...localSearchCriteria,
                      purchaseOrderId: value ? value.value : "",
                    });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  type="Date"
                  onChange={(e) =>
                    setLocalSearchCriteria({
                      ...localSearchCriteria,
                      date: e.target.value,
                    })
                  }
                  value={localSearchCriteria.date?.split("T")[0]}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Hour
                  onChange={(value) => {
                    setLocalSearchCriteria({
                      ...localSearchCriteria,
                      hour: value ? value.value : "",
                    });
                  }}
                />
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Control
                  type="number"
                  placeholder="Section"
                  onChange={(e) =>
                    setLocalSearchCriteria({
                      ...localSearchCriteria,
                      section: parseInt(e.target.value),
                    })
                  }
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
                          <th></th>
                          <th>#</th>
                          <th>Operation</th>
                          {/* <th>SAM</th>
                          <th>Section</th> */}
                          <th>Target</th>
                          <th>Card No</th>
                          <th>Output</th>
                          <th>Down Time</th>
                          {isChecked ? (
                            <Fragment>
                              <th>Check Quantity</th>
                              <th>Defect Codes</th>
                            </Fragment>
                          ) : null}
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
                              <td className="d-flex">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => addRowBillow(i)}
                                >
                                  +
                                </Button>
                                <Button
                                  variant="outline-danger ms-1"
                                  size="sm"
                                  onClick={() => deleteRow(i)}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                                </Button>
                              </td>
                              <td>{i + 1}</td>
                              <td>{item.SpecNo}</td>
                              {/* <td>{item.Sam}</td>
                              <td>{item.Section}</td> */}
                              <td>{(60 / item.Sam).toFixed()}</td>
                              <td>
                                <Form.Control
                                  onChange={(e) => handleColumnChange(e, i)}
                                  name="CardNo"
                                  value={item?.CardNo}
                                  required
                                  size="sm"
                                />
                              </td>
                              <td>
                                <Form.Control
                                  onChange={(e) => handleColumnChange(e, i)}
                                  name="Output"
                                  value={item?.Output}
                                  required
                                  size="sm"
                                  onKeyPress={handleKeyPress}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  onChange={(e) => handleColumnChange(e, i)}
                                  name="DownTime"
                                  value={item?.DownTime}
                                  size="sm"
                                  onKeyPress={handleKeyPress}
                                />
                              </td>
                              {isChecked ? (
                                <Fragment>
                                  <td>
                                    <Form.Control
                                      onChange={(e) => handleColumnChange(e, i)}
                                      name="CheckQty"
                                      value={item?.CheckQty}
                                      size="sm"
                                      onKeyPress={handleKeyPress}
                                    />
                                  </td>
                                  <td>
                                    <Form.Control
                                      onChange={(e) => handleColumnChange(e, i)}
                                      name="DefectCodes"
                                      value={item?.DefectCodes}
                                      size="sm"
                                    />
                                  </td>
                                </Fragment>
                              ) : null}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>

                    {loading ? (
                      <Button variant="primary" disabled className="float-end">
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
                      <Button
                        variant="primary"
                        type="submit"
                        className="float-end"
                      >
                        Save
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default HourlyProduction;
