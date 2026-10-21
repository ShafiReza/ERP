import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Form, Row, Button, Image, Spinner } from "react-bootstrap";

const LogIn = () => {
  let navigate = useNavigate();
  const [messages, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    const { userName, password } = event.target;
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("UserName", userName.value);
    urlencoded.append("Password", password.value);
    urlencoded.append("grant_type", "password");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(process.env.REACT_APP_LOGIN_API_URL, requestOptions)
      .then((res) => {
        if (res.ok) {
          res.json().then((result) => {
            setLoading(false);
            if (result.access_token === "Error") {
              setMessage([{ error: "Invalid Email or Password" }]);
              return;
            } else {
              localStorage.setItem(
                "user",
                JSON.stringify({
                  userName: result.userName,
                  fullName: result.fullName,
                  role: result.role,
                  cardNo: result.cardNo,
                })
              );
              localStorage.setItem("token", result.access_token);
              navigate("/dashboard");
            }
          });
        } else {
          setMessage([{ error: "Invalid Email or Password" }]);
        }
        setLoading(false);
        setValidated(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <Card>
        <Card.Body>
          <Row>
            <Col className="p-5">
              <Row className="justify-content-md-center mb-2">
                <Image
                  src="logo.jpg"
                  className="img-fluid"
                  style={{ maxHeight: "100px", maxWidth: "150px" }}
                />
              </Row>

              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                method="POST"
              >
                {messages.map((item) => (
                  <li className="text-danger" key={item}>
                    {item.error && item.error}
                  </li>
                ))}

                <Row className="mb-3">
                  <Form.Group>
                    <Form.Label>User Name</Form.Label>
                    <Form.Control name="userName" required />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      name="password"
                      type="password"
                      maxLength="30"
                      required
                    />
                  </Form.Group>
                </Row>

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
                  <Button variant="primary" type="submit" className="float-end">
                    Login
                  </Button>
                )}
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LogIn;
