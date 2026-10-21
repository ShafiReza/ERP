import { useState, Fragment, useCallback, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Spinner,
  Nav,
  Offcanvas,
  Table,
} from "react-bootstrap";
import Actionbar from "../../components/layout/Actionbar";
import useFetch from "../../components/hooks/useFetch";
import { SalesOrder } from "../../components/DropDown";
import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Cutting = () => {
  const [showCanvas, setShowCanvas] = useState(false);
  const [cutting, setCutting] = useState({ BundleList: [] });
  const [validated, setValidated] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [res, getData] = useFetch();
  const [reqResponse, saveData] = useFetch();

  const getAllCuttingPlan = useCallback(() => {
    getData("CuttingPlan?" + new URLSearchParams(searchCriteria), "GET");
  }, [getData, searchCriteria]);

  useEffect(() => {
    getAllCuttingPlan();
  }, [getAllCuttingPlan]);

  const bundleClick = async () => {
    const response = await fetch(
      process.env.REACT_APP_API_URL +
        "CuttingPlan/GetLastBundleNo/" +
        cutting.PurchaseOrderID,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const lastBundleNo = await response.json();

    const localBundle = [];
    const bundleNumber = Math.ceil(
      cutting.CuttingQuantity / cutting.BundlePerQuantity
    );
    let count = lastBundleNo !== null ? parseInt(lastBundleNo) : 0;
    for (let i = 1; i <= bundleNumber; i++) {
      localBundle.push({
        BundleNo: ++count,
        Quantity: cutting.BundlePerQuantity,
        Size: "",
        CuttingPlanID: cutting.CuttingPlanID,
      });
    }
    setCutting({ ...cutting, BundleList: localBundle });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCutting({ ...cutting, [name]: value });
  };

  const handleLoopChange = (e, index) => {
    const { value, name } = e.target;
    let list = [...cutting.BundleList];
    list[index][name] = value;

    setCutting({ ...cutting, BundleList: list });
  };

  const saveCutting = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    saveData("CuttingPlan", "POST", cutting, getAllCuttingPlan);
  };

  const getCuttingPlanById = (CuttingPlanID) => {
    fetch(process.env.REACT_APP_API_URL + "CuttingPlan/" + CuttingPlanID, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        setCutting(result);
        setShowCanvas(true);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <Actionbar pageTitle="Cutting">
        <Nav.Link
          onClick={() => {
            setShowCanvas(true);
            setCutting({ BundleList: [] });
          }}
          className="nav-link text-primary"
        >
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </Nav.Link>
      </Actionbar>
      <Row className="mt-2">
        <Form.Group as={Col} sm="3">
          <SalesOrder
            onChange={(value, action) =>
              setSearchCriteria({
                ...searchCriteria,
                [action.name]: value ? value.value : null,
              })
            }
            name="purchaseOrderId"
          />
        </Form.Group>
      </Row>
      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Table striped responsive borderless hover>
                <thead>
                  <th>#</th>
                  <th>PONo</th>
                  <th>Cutting No</th>
                  <th>Cutting Date</th>
                  <th>Cutting Quantity</th>
                  <th></th>
                </thead>
                <tbody>
                  {res.dataLoading && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                  )}
                  {!res.dataLoading && res.data?.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <b>No data found!</b>
                      </td>
                    </tr>
                  )}
                  {res.data.map((item, index) => (
                    <tr
                      key={item.CuttingPlanID}
                      className={
                        item.CuttingPlanID === cutting.CuttingPlanID
                          ? "table-active"
                          : ""
                      }
                    >
                      <td>{index + 1}</td>
                      <td>{item.PONo}</td>
                      <td>{item.CuttingNo}</td>
                      <td>{item.CuttingDate}</td>
                      <td>{item.CuttingQuantity}</td>
                      <td>
                        <Button
                          variant="btn btn-sm btn-outline-primary"
                          onClick={() => getCuttingPlanById(item.CuttingPlanID)}
                        >
                          <FontAwesomeIcon icon="fa-solid fa-pen" />
                        </Button>
                        <Button variant="btn btn-sm btn-outline-danger ms-1">
                          <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Offcanvas
        show={showCanvas}
        onHide={() => setShowCanvas(false)}
        placement="end"
        className="w-75"
        scroll={true}
        backdrop={false}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Generate Bundle </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={saveCutting}
                method="POST"
              >
                <Row className="mt-2 mb-2">
                  <Col>
                    <Row className="mb-2">
                      <Form.Group as={Col} sm="3">
                        <SalesOrder
                          onChange={(value, action) =>
                            setCutting({
                              ...cutting,
                              [action.name]: value ? value.value : null,
                            })
                          }
                          name="PurchaseOrderID"
                          selected={cutting.PONo}
                        />
                      </Form.Group>
                    </Row>
                    <Row className="mb-2">
                      <Col>
                        <Card>
                          <Card.Body>
                            <Row>
                              <Form.Group as={Col}>
                                <Form.Label>Cutting No</Form.Label>
                                <Form.Control
                                  onChange={(e) => handleChange(e)}
                                  type="text"
                                  name="CuttingNo"
                                  value={cutting.CuttingNo}
                                  required
                                />
                              </Form.Group>

                              <Form.Group as={Col}>
                                <Form.Label>Cutting Date</Form.Label>
                                <Form.Control
                                  onChange={(e) => handleChange(e)}
                                  type="date"
                                  name="CuttingDate"
                                  value={cutting.CuttingDate}
                                  required
                                />
                              </Form.Group>

                              <Form.Group as={Col}>
                                <Form.Label>Cutting Quantity</Form.Label>
                                <Form.Control
                                  onChange={(e) => handleChange(e)}
                                  type="number"
                                  name="CuttingQuantity"
                                  value={cutting.CuttingQuantity}
                                  required
                                />
                              </Form.Group>

                              <Form.Group as={Col}>
                                <Form.Label>Ply / Bundle</Form.Label>
                                <Form.Control
                                  onChange={(e) => handleChange(e)}
                                  type="number"
                                  name="BundlePerQuantity"
                                  value={cutting.BundlePerQuantity}
                                  required
                                />
                              </Form.Group>

                              <Form.Group as={Col}>
                                <Form.Label>No of Bundle</Form.Label>
                                <Form.Control
                                  value={Math.ceil(
                                    cutting.CuttingQuantity /
                                      cutting.BundlePerQuantity
                                  )}
                                  readOnly
                                />
                              </Form.Group>
                              <Form.Group as={Col}>
                                <Button
                                  variant="btn  btn-outline-success"
                                  onClick={bundleClick}
                                  style={{ marginTop: "30px" }}
                                >
                                  Generate Bundle
                                </Button>
                              </Form.Group>
                            </Row>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    <Row className="mb-2">
                      {cutting?.BundleList?.map((item, i) => {
                        return (
                          <Col sm={3} key={i} className="mb-2">
                            <Card>
                              <Card.Body>
                                <Row>
                                  <Col>Bdl# {item.BundleNo}</Col>
                                  <Col>
                                    <Form.Control
                                      name="Quantity"
                                      onChange={(e) => handleLoopChange(e, i)}
                                      value={item.Quantity}
                                      type="number"
                                      placeholder="Quantity"
                                    />
                                  </Col>
                                  <Col>
                                    <Form.Control
                                      name="Size"
                                      onChange={(e) => handleLoopChange(e, i)}
                                      value={item.Size}
                                      placeholder="Size"
                                    />
                                  </Col>
                                </Row>
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>

                    {reqResponse.loading ? (
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
                        variant="btn  btn-outline-primary"
                        type="submit"
                        className="float-end"
                      >
                        Save Changes
                      </Button>
                    )}
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Offcanvas.Body>
      </Offcanvas>

      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default Cutting;
