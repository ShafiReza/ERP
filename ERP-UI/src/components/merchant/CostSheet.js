import { useState, Fragment, useEffect, useMemo } from "react";
import { Button, Table, Row, Col, Form, Spinner } from "react-bootstrap";

import { ItemCategory, Unit } from "../DropDown";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CostSheet = ({ orderStatus }) => {
  const [validated, setValidated] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [costSheetDetails, setInputList] = useState([
    {
      PurchaseOrderId: orderStatus.PurchaseOrderID,
      ItemCategoryId: 0,
      Consumption: 0,
      Wastage: 0,
      UnitId: 0,
      UnitPrice: 0,
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(
      process.env.REACT_APP_API_URL +
        "Costsheet?" +
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
              setInputList(result);
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [orderStatus.PurchaseOrderID, toggle]);

  const grandTotal = useMemo(
    () =>
      costSheetDetails.reduce(
        (total, item) => {
          if (item.TotalPrice) {
            return (total += Number(item.TotalPrice));
          }
          return total;
        },

        0
      ),
    [costSheetDetails]
  );

  const handleChange = (e, index) => {
    let { name, value } = e.target;
    if (name === "Consumption" || name === "UnitPrice" || name === "Wastage") {
      value = parseFloat(value);
    }

    let list = [...costSheetDetails];

    list[index][name] = value;
    if (list[index]["Consumption"]) {
      list[index]["TotalQuantity"] =
        (list[index]["Consumption"] * 100 +
          list[index]["Consumption"] * list[index]["Wastage"]) /
        100;
    }

    if (list[index]["TotalQuantity"]) {
      list[index]["TotalPrice"] =
        list[index]["TotalQuantity"] * list[index]["UnitPrice"];
    }
    setInputList(list);
  };

  const onPaste = (event) => {
    event.clipboardData.items[0].getAsString((text) => {
      const lines = text.split("\n");
      const newArr = [];
      lines.forEach((line) => {
        const cell = line.split("\t");
        newArr.push({
          ItemCode: cell[0],
          Quantity: Number(cell[1]),
          UnitName: cell[2],
          UnitPrice: Number(cell[3]),
        });
      });
      const tempArray = [];
      newArr.forEach((item) => {
        let promiseForItemID = fetch("ItemCode").then((response) =>
          response.json()
        );
        let promiseForUnitID = fetch("UnitName").then((response) =>
          response.json()
        );
        Promise.all(promiseForItemID, promiseForUnitID).then((values) => {
          tempArray.push({
            ItemID: values[0],
            Quantity: item.Quantity,
            UnitID: values[1],
            UnitPrice: item.UnitPrice,
          });
        });
      });
      setInputList(tempArray);
    });
  };

  const removeRowClick = (index, item) => {
    if (item.CostSheetId) {
      fetch(
        process.env.REACT_APP_API_URL +
          "Costsheet?" +
          new URLSearchParams({
            costsheetId: item.CostSheetId,
          }),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            toast.warn("Data Deleted Successfuly", {
              position: "bottom-right",
            });
            setToggle(!toggle);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const list = [...costSheetDetails];
      list.splice(index, 1);
      setInputList(list);
    }
  };

  const addRowClick = () => {
    setInputList([
      ...costSheetDetails,
      {
        PurchaseOrderId: orderStatus.PurchaseOrderID,
        ItemCategoryId: 0,
        Consumption: 0,
        Wastage: 0,
        UnitId: 0,
        UnitPrice: 0,
      },
    ]);
  };

  const saveCostsheet = (e) => {
    const formBody = costSheetDetails.map((item) => {
      return { ...item, PurchaseOrderId: orderStatus.PurchaseOrderID };
    });

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setLoading(true);
      e.preventDefault();
      fetch(process.env.REACT_APP_API_URL + "Costsheet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formBody),
      })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Data Added Successfuly", {
              position: "bottom-right",
            });
          } else {
            toast.error(res.statusText + " - " + res.status, {
              position: "bottom-right",
            });
          }
          setValidated(false);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setValidated(true);
  };

  const copyCostSheet = () => {
    const newArray = costSheetDetails.map(
      ({ CostSheetId, PurchaseOrderId, ...rest }) => rest
    );
    const jsonString = JSON.stringify(newArray);
    localStorage.setItem("costSheet", jsonString);
  };

  const pasteCostSheet = () => {
    let tempArray = JSON.parse(localStorage.getItem("costSheet")) ?? [];
    if (tempArray.length === 0) {
      return;
    } else {
      setInputList(tempArray);
    }
  };

  return (
    <Fragment>
      <Form
        noValidate
        validated={validated}
        onSubmit={saveCostsheet}
        method="POST"
      >
        <Row className="mb-3">
          <div className="d-flex">
            <Button onClick={copyCostSheet}>Copy</Button>
            <Button onClick={pasteCostSheet} className="ms-2">
              Paste
            </Button>
          </div>
          <Table striped hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Category</th>
                <th>Unit</th>
                <th>Consumption</th>
                <th>Wastage</th>
                <th>Total Quantity</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>
                  <Button variant="outline-primary" onClick={addRowClick}>
                    <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {costSheetDetails.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="col-md-4">
                      <ItemCategory
                        onChange={(value) => {
                          x.ItemCategoryId = value ? value.value : null;
                          setInputList([...costSheetDetails]);
                        }}
                        name="ItemCategoryId"
                        selected={x.ItemCategoryId}
                        onPaste={onPaste}
                      />
                    </td>
                    <td className="col-md-2">
                      <Unit
                        onChange={(value) => {
                          x.UnitId = value ? value.value : null;
                          setInputList([...costSheetDetails]);
                        }}
                        name="UnitId"
                        selected={x.UnitId}
                      />
                    </td>
                    <td className="col-md-1">
                      <Form.Control
                        onChange={(e) => handleChange(e, i)}
                        type="number"
                        name="Consumption"
                        value={x.Consumption}
                        required
                      />
                    </td>
                    <td className="col-md-1">
                      <Form.Control
                        onChange={(e) => handleChange(e, i)}
                        type="number"
                        name="Wastage"
                        value={x.Wastage}
                        required
                      />
                    </td>
                    <td className="col-md-1">{x.TotalQuantity}</td>
                    <td className="col-md-1">
                      <Form.Control
                        onChange={(e) => handleChange(e, i)}
                        type="number"
                        name="UnitPrice"
                        value={x.UnitPrice}
                        required
                      />
                    </td>
                    <td className="col-md-1">{x?.TotalPrice?.toFixed(4)}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        onClick={(e) => removeRowClick(i, x)}
                      >
                        <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={4}></td>
                <td>FOB: {orderStatus.FOB}</td>
                <td>CM: {orderStatus.AgreedCM}</td>
                <td>
                  Budget: {(orderStatus.FOB - orderStatus.AgreedCM).toFixed(2)}
                </td>
                <td
                  className={
                    orderStatus.FOB - orderStatus.AgreedCM < grandTotal
                      ? "text-danger"
                      : ""
                  }
                >
                  {grandTotal.toFixed(4)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Row>

        <Button variant="light" type="submit" as={Col} sm={1}>
          Cancel
        </Button>
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
            disabled={
              orderStatus.FOB - orderStatus.AgreedCM < grandTotal ? true : false
            }
          >
            Save
          </Button>
        )}
      </Form>

      <ToastContainer autoClose={2000} />
    </Fragment>
  );
};

export default CostSheet;
