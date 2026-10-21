import { useState, Fragment, useEffect } from "react";
import { Button, Table, Row, Col, Form, Spinner } from "react-bootstrap";

import { ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useFetch from "../hooks/useFetch";

const SizeColor = ({ orderStatus }) => {
  const [validated, setValidated] = useState(false);
  const [sizeColors, setSizeColors] = useState([
    {
      PurchaseOrderId: orderStatus.PurchaseOrderID,
      Color: "",
      Size: "",
      Quantity: 0,
      FOB: 0,
    },
  ]);
  const [reqResponse, saveData] = useFetch();

  useEffect(() => {
    fetch(
      process.env.REACT_APP_API_URL +
        "PurchaseOrders/GetSizeColor?" +
        new URLSearchParams({ purchaseOrderId: orderStatus.PurchaseOrderID }),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((res) => {
        if (res.ok)
          res.json().then((result) => {
            if (result.length > 0) {
              setSizeColors(result);
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orderStatus.PurchaseOrderID]);

  const handleChange = (e, index) => {
    let { name, value } = e.target;
    if (name === "FOB" || name === "Quantity") {
      value = parseFloat(value);
    }
    let list = [...sizeColors];
    list[index][name] = value;

    setSizeColors(list);
  };

  const onPaste = (event) => {
    event.clipboardData.items[0].getAsString((text) => {
      const lines = text.split("\n");
      const newArr = [];
      lines.forEach((line) => {
        const cell = line.split("\t");
        newArr.push({
          PurchaseOrderId: orderStatus.PurchaseOrderID,
          Color: cell[0],
          Size: cell[1],
          Quantity: Number(cell[2]),
          FOB: Number(cell[3]),
        });
      });
      setSizeColors(newArr);
    });
  };

  const removeRow = (index) => {
    const list = [...sizeColors];
    list.splice(index, 1);
    setSizeColors(list);
  };

  const addRowClick = () => {
    setSizeColors([
      ...sizeColors,
      {
        PurchaseOrderId: orderStatus.PurchaseOrderID,
        Color: "",
        Size: "",
        Quantity: 0,
        FOB: 0,
      },
    ]);
  };

  const saveSizeColors = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    saveData("PurchaseOrders/SaveSizeColor", "POST", sizeColors);
  };

  return (
    <Fragment>
      <Form
        noValidate
        validated={validated}
        onSubmit={saveSizeColors}
        method="POST"
      >
        <Row className="mb-3">
          <Table striped hover>
            <thead>
              <tr>
                <th>Color</th>
                <th>Size</th>
                <th>Qty</th>
                <th>FOB</th>
                <th>
                  <Button variant="outline-primary" onClick={addRowClick}>
                    <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sizeColors.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>
                      <Form.Control
                        onChange={(e) => handleChange(e, i)}
                        name="Color"
                        value={x.Color}
                        onPaste={onPaste}
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        onChange={(e) => handleChange(e, i)}
                        name="Size"
                        value={x.Size}
                        required
                      />
                    </td>
                    <td>
                      <Form.Control
                        onChange={(e) => handleChange(e, i)}
                        type="number"
                        name="Quantity"
                        value={x.Quantity}
                      />
                    </td>
                    <td>
                      <Form.Control
                        onChange={(e) => handleChange(e, i)}
                        type="number"
                        name="FOB"
                        value={x.FOB}
                      />
                    </td>
                    <td>
                      {" "}
                      <Button
                        variant="outline-danger"
                        onClick={() => removeRow(i)}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              <tr className="fw-bold">
                <td colSpan={2} className="text-center ">
                  Total
                </td>
                <td>
                  {sizeColors.reduce((tot, itm) => (tot += itm.Quantity), 0)}
                </td>
                <td>{sizeColors.reduce((tot, itm) => (tot += itm.FOB), 0)}</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Row>

        <Button variant="light" type="submit" as={Col} sm={1}>
          Cancel
        </Button>
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
          <Button variant="primary" type="submit" className="float-end">
            Save
          </Button>
        )}
      </Form>

      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default SizeColor;
