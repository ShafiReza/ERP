import { Card, Button, Row, Col, Form, Spinner } from "react-bootstrap";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Actionbar from "../../components/layout/Actionbar";

const ChangePassword = () => {
  const [password, setPassword] = useState({});
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPassword({ ...password, [name]: value });
  };

  const savePassword = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    fetch(process.env.REACT_APP_API_URL + "Account/ChangePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(password),
    })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          toast.success("Data Added Successfuly", {
            position: "bottom-right",
          });
        } else {
          toast.error(response.statusText + "(" + response.status + ")", {
            position: "bottom-right",
          });
        }
        setValidated(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <div>
      <Actionbar pageTitle="Change Password"></Actionbar>
      <Row className="mb-2 mt-2">
        <Col>
          <Card>
            <Card.Body>
              <Form
                noValidate
                validated={validated}
                onSubmit={savePassword}
                method="POST"
              >
                <Row className="mb-3">
                  <Form.Group as={Col}>
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="password"
                      name="OldPassword"
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="password"
                      name="NewPassword"
                      required
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      onChange={(e) => handleChange(e)}
                      type="password"
                      name="ConfirmPassword"
                      required
                    />
                  </Form.Group>
                </Row>

                <Button variant="light" type="cancel" as={Col} className="mt-2">
                  Reset
                </Button>
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
                  <Button
                    variant="primary"
                    type="submit"
                    className="float-end mt-2"
                  >
                    Save
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default ChangePassword;
