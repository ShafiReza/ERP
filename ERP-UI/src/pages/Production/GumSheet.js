import { useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Container,
  Table,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import Actionbar from "../../components/layout/Actionbar";
import { ToastContainer, toast } from "react-toastify";
import {
  SalesOrder,
  Section,
  OffStandardCode,
} from "../../components/DropDown";
import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GumSheet = () => {
  const [gumSheet, setGumSheet] = useState({
    date: "",
    operatorNo: "",
    SpecNo: "",
  });

  const [validated, setValidated] = useState(false);
  const [OffStandard, setOffStandard] = useState({});
  const [OffStandardList, setOffStandardList] = useState([]);

  const bundleDropdown = [
    { value: 1, label: "101" },
    { value: 2, label: "102" },
    { value: 3, label: "103" },
    { value: 4, label: "104" },
    { value: 5, label: "105" },
    { value: 6, label: "106" },
    { value: 7, label: "107" },
    { value: 8, label: "108" },
  ];

  const addOffstandard = () => {
    setOffStandardList([
      ...OffStandardList,
      { code: OffStandard.code, duration: OffStandard.duration },
    ]);
  };

  const removeOffStandard = (index) => {
    let list = [...OffStandardList];
    list.splice(index, 1);
    setOffStandardList(list);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setGumSheet({ ...gumSheet, [name]: value });
  };

  const saveGumSheet = async (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();

      fetch(process.env.REACT_APP_API_URL + "gumsheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gumSheet),
      }).then(() => {
        toast.success("Data Added Successfuly", {
          position: "bottom-right",
        });
        setValidated(false);
      });
    }
    setValidated(true);
  };

  return (
    <div>
      <Actionbar pageTitle="Gumsheet">
        <NavLink to="/notification" className="nav-link text-primary">
          <FontAwesomeIcon icon="fa-solid fa-circle-plus" /> Add
        </NavLink>
        <NavLink to="/support" className="nav-link text-danger">
          <FontAwesomeIcon icon="fa-solid fa-trash-can" /> Delete
        </NavLink>
      </Actionbar>

      <Form
        noValidate
        validated={validated}
        onSubmit={saveGumSheet}
        method="POST"
      >
        <Row>
          <Col sm="8">
            <Card className="mt-2">
              <Card.Body>
                <Row className="mt-2 mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="date"
                      value={gumSheet.date}
                      onChange={(e) => handleChange(e)}
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Form.Label>Operator No</Form.Label>
                    <Form.Control
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      type="text"
                      name="operatorNo"
                      value={gumSheet.operatorNo}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Operator Name</Form.Label>
                    <Form.Control
                      name="OperatorName"
                      value={gumSheet.OperatorName}
                      readOnly
                    />
                  </Form.Group>
                </Row>
                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Spec No</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="SpecNo"
                      value={gumSheet.SpecNo}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Section</Form.Label>
                    <Section name="Section" />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>PO</Form.Label>
                    <SalesOrder
                      onChange={(value, action) =>
                        setGumSheet({
                          ...gumSheet,
                          [action.name]: value ? value.value : null,
                        })
                      }
                      name="PurchaseOrderID"
                    />
                  </Form.Group>
                </Row>

                <Row className="mb-2">
                  <Form.Group as={Col}>
                    <Form.Label>Bundle List</Form.Label>
                    <Select
                      isMulti
                      options={bundleDropdown}
                      className="basic-multi-select"
                      placeholder="Select Bundle"
                      classNamePrefix="select"
                      // onChange={(values) => {
                      //   setEmployeeCapability({
                      //     ...employeeCapability,

                      //     specs: [...values],
                      //   });
                      // }}
                    />
                  </Form.Group>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col sm="4">
            <Card className="mt-2">
              <Card.Header>OffStandard Code---Duration(min)</Card.Header>
              <Container className="mt-4">
                <Row className="mb-3">
                  <Form.Group as={Col} sm={5}>
                    <OffStandardCode
                      onChange={(value) => {
                        setOffStandard({
                          ...OffStandard,
                          code: value ? value.value : null,
                        });
                      }}
                    />
                  </Form.Group>

                  <Form.Group as={Col} sm={5}>
                    <Form.Control
                      onChange={(e) =>
                        setOffStandard({
                          ...OffStandard,
                          duration: e.target.value,
                        })
                      }
                      type="number"
                    />
                  </Form.Group>

                  <Form.Group as={Col}>
                    <Button variant="outline-primary" onClick={addOffstandard}>
                      <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                    </Button>
                  </Form.Group>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <Table striped hover size="sm">
                      <thead>
                        <th>Code</th>
                        <th>Duration</th>
                        <th></th>
                      </thead>
                      <tbody>
                        {OffStandardList.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item.code}</td>
                              <td>{item.duration}</td>
                              <td>
                                {" "}
                                <Button
                                  variant="outline-danger btn-sm"
                                  onClick={() => removeOffStandard(index)}
                                >
                                  <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Container>
            </Card>
          </Col>
        </Row>
      </Form>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default GumSheet;
