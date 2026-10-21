import {
    Card,
    Button,
    Row,
    Col,
    Form,
    FormGroup,
    FormControl,
    FormLabel,
    Spinner,
    Table,
    Nav,
    Offcanvas,
    Pagination
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, createRef, Fragment } from "react";
import { ToastContainer, toast } from "react-toastify";
import { LC, Item, PI } from "../../components/DropDown";
import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import { CSVLink } from "react-csv";
const csvLink = createRef();

const ExcessBooking = () => {
    const [excessBooking, setExcessBooking] = useState({});
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toggle, setToggle] = useState(false);
    const [showCanvas, setShowCanvas] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState({
        pageIndex: 1,
        pageSize: 10,
        excelExport: false,
    });

    const [itemExportList, setItemExportList] = useState([]);
    const [res] = useGetAll("ExcessBooking?", searchCriteria, toggle);

    const getExcelData = () => {
        setSearchCriteria({ ...searchCriteria, excelExport: true });
        setItemExportList(res.data);
        setSearchCriteria({ ...searchCriteria, excelExport: false });
        setTimeout(() => {
            csvLink.current.link.click();
        }, 1000);
    };

    const handleRowClick = (item) => {
        setExcessBooking(item);
        console.log("excessbooking", excessBooking);
    };

    const handleClose = () => {
        setShowCanvas(false);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setExcessBooking({ ...excessBooking, [name]: value });
    };



    const saveExcessBooking = (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        const methodType = excessBooking.ExcessBookingID ? "PUT" : "POST";
        setLoading(true);
        fetch(process.env.REACT_APP_API_URL + "ExcessBooking", {
            method: methodType,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(excessBooking),
        })
            .then((response) => {
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
                setToggle(!toggle);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    };




    const headers = [
        { label: "FullName", key: "FullName" },
        { label: "User Name", key: "UserName" },
        { label: "Email", key: "Email" },
        { label: "PhoneNumber", key: "PhoneNumber" },
        { label: "Roles", key: "Roles" },
    ];


    return (
        <Fragment>
            <Actionbar pageTitle="Excess Booking">
                <Nav.Link
                    className="nav-link text-primary"
                    onClick={() => {
                        setShowCanvas(true);
                        setExcessBooking({});
                    }}
                >
                    <FontAwesomeIcon icon="fa-solid fa-circle-plus" />
                    Add
                </Nav.Link>

                <Nav.Link className="nav-link text-success" onClick={getExcelData}>
                    <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
                </Nav.Link>
                <CSVLink
                    headers={headers}
                    data={itemExportList}
                    filename="User List.csv"
                    className="hidden"
                    ref={csvLink}
                />
            </Actionbar>
            <Row className="mt-2">
                <Form.Group as={Col} sm="3">
                    <LC
                        onChange={(value) =>
                            setSearchCriteria({
                                ...searchCriteria,
                                jobId: value ? value.value : "",
                            })
                        }

                    />
                </Form.Group>
                <Form.Group as={Col} sm="3">
                    <PI
                        onChange={(value) =>
                            setSearchCriteria({
                                ...searchCriteria,
                                piId: value ? value.value : "",
                            })
                        }

                    />
                </Form.Group>

            </Row>
            <Row className="mt-2">
                <Col>
                    <Card>
                        <Card.Body>
                            <Table responsive striped hover size="sm">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Job No</th>
                                        <th>PI No</th>
                                        <th>Item</th>
                                        <th>Item Color</th>
                                        <th>Item Size</th>
                                        <th>Total Quantity</th>
                                        <th>Total Price</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {res.dataLoading && (
                                        <tr>
                                            <td colSpan="17" className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                    )}
                                    {!res.dataLoading && res.data.length === 0 && (
                                        <tr>
                                            <td colSpan="17" className="text-center">
                                                <b>No data found!</b>
                                            </td>
                                        </tr>
                                    )}
                                    {res.data?.map((item, index) => (
                                        <tr
                                            onClick={() => {
                                                handleRowClick(item);
                                            }}
                                            key={item.ExcessBookingID}
                                            className={
                                                item.ExcessBookingID === excessBooking.ExcessBookingID ? "table-active" : ""
                                            }
                                        >
                                            <td> {searchCriteria.pageIndex * searchCriteria.pageSize -
                                                searchCriteria.pageSize +
                                                index +
                                                1}
                                            </td>
                                            <td>{item.JobNo}</td>
                                            <td>{item.PINo}</td>
                                            <td>{item.ItemName}</td>
                                            <td>{item.ItemColor}</td>
                                            <td>{item.ItemSize}</td>
                                            <td>{item.TotalQuantity}</td>
                                            <td>{item.TotalPrice}</td>
                                            <td>
                                                <Button
                                                    variant="btn btn-sm btn-outline-primary ms-1"

                                                    onClick={() => {
                                                        setShowCanvas(true);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon="fa-solid fa-edit" title="Change Role" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <Pagination className="float-end">
                                <Pagination.Prev
                                    onClick={() =>
                                        setSearchCriteria({
                                            ...searchCriteria,

                                            pageIndex:
                                                searchCriteria.pageIndex === 1
                                                    ? 1
                                                    : searchCriteria.pageIndex - 1,
                                        })
                                    }
                                />

                                <Pagination.Next
                                    onClick={() =>
                                        setSearchCriteria({
                                            ...searchCriteria,

                                            pageIndex: searchCriteria.pageIndex + 1,
                                        })
                                    }
                                />
                            </Pagination>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Offcanvas
                show={showCanvas}
                onHide={handleClose}
                placement="end"
                className="w-50"
                scroll={false}
                backdrop="static"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Excess Booking</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Card>
                        <Card.Body>

                            <Form
                                noValidate
                                validated={validated}
                                onSubmit={saveExcessBooking}
                                method="POST"
                            >
                                <Row className="mb-2">
                                    <Form.Group as={Col}>
                                        <FormLabel>Job</FormLabel>
                                        <LC
                                            onChange={(value, action) =>
                                                setExcessBooking({
                                                    ...excessBooking,
                                                    [action.name]: value ? value.value : null,
                                                })
                                            }
                                            name="JobID"
                                            selected={excessBooking.JobID}
                                            isRequired={false}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="mb-2">

                                    <Form.Group as={Col}>
                                        <FormLabel>PI</FormLabel>
                                        <PI
                                            onChange={(value, action) =>
                                                setExcessBooking({
                                                    ...excessBooking,
                                                    [action.name]: value ? value.value : null,
                                                })
                                            }
                                            name="ProformaInvoiceID"
                                            selected={excessBooking.ProformaInvoiceID}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <FormLabel>Item</FormLabel>
                                        <Item
                                            onChange={(value, action) =>
                                                setExcessBooking({
                                                    ...excessBooking,
                                                    [action.name]: value ? value.value : null,
                                                })
                                            }
                                            name="ItemID"
                                            selected={excessBooking.ItemID}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row>
                                    <FormGroup as={Col}>
                                        <FormLabel>Item Color</FormLabel>
                                        <FormControl
                                            name="ItemColor"
                                            onChange={(e) => handleChange(e)}
                                            value={excessBooking.ItemColor}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup as={Col}>
                                        <FormLabel>Item Size</FormLabel>
                                        <FormControl
                                            name="ItemSize"
                                            onChange={(e) => handleChange(e)}
                                            value={excessBooking.ItemSize}
                                            required
                                        />
                                    </FormGroup>
                                </Row>

                                <Row className="mt-2">
                                    <FormGroup as={Col}>
                                        <FormLabel>Total Quantity</FormLabel>
                                        <FormControl
                                            name="TotalQuantity"
                                            onChange={(e) => handleChange(e)}
                                            value={excessBooking.TotalQuantity}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup as={Col}>
                                        <FormLabel>Total Price</FormLabel>
                                        <FormControl
                                            name="TotalPrice"
                                            onChange={(e) => handleChange(e)}
                                            value={excessBooking.TotalPrice}
                                            required
                                        />
                                    </FormGroup>
                                </Row>


                                {loading ? (
                                    <Button
                                        variant="primary"
                                        disabled
                                        className="float-end mt-2"
                                    >
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
                                        {excessBooking.ExcessBookingID ? "Update" : "Save"}
                                    </Button>
                                )}
                            </Form>


                        </Card.Body>
                    </Card>
                </Offcanvas.Body>
            </Offcanvas>
            <ToastContainer autoClose={2000} />
        </Fragment>
    );
};

export default ExcessBooking;
