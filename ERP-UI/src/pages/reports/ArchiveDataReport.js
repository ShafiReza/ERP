import {
    Card,
    Button,
    Table,
    Row,
    Col,
    Form,
    Spinner,
    Pagination,
    InputGroup,
    Nav
  } from "react-bootstrap";
  import Actionbar from "../../components/layout/Actionbar";
  import { useState, createRef, Fragment } from "react";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { CSVLink } from "react-csv";
  const csvLink = createRef();
  
  const ArchiveDataReport = () => {
    const [searchCriteria, setSearchCriteria] = useState({});
    const [archiveList, setArchiveList] = useState([]);
    const [itemExportList, setItemExportList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getReport=()=>{
        if(searchCriteria.fromDate && searchCriteria.toDate){
            setLoading(true);
            fetch(
                process.env.REACT_APP_API_URL + "Report/GetArchiveReport?" + new URLSearchParams(searchCriteria),
          
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
                    setArchiveList(response);
                    setLoading(false);
    
                })
                .catch((err) => {
                  console.log(err);
                  setLoading(false);
                });
        }

    }

    const getExcelData = () => {
        if (searchCriteria.fromDate && searchCriteria.toDate) {
          fetch(
            process.env.REACT_APP_API_URL + "Report/GetArchiveReport?" + new URLSearchParams(searchCriteria),
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
                setItemExportList(response);
                setTimeout(() => {
                  csvLink.current.link.click();
                }, 1000);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      };

    const headers = [
        { label: "Factory", key: "Factory" },
        { label: "Date", key: "Date" },
        { label: "No Of Employees", key: "NoOfEmployees" },
        { label: "Total Hours", key: "TotalHours" },
        { label: "Avg Hours", key: "AvgHours" },
      ];

    return (
      <Fragment>
        <Actionbar pageTitle="Archive Data">
        <Nav.Link className="nav-link text-success" onClick={getExcelData}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
        <CSVLink
          headers={headers}
          data={itemExportList}
          filename="ArchiveData.csv"
          className="hidden"
          ref={csvLink}
        />
        </Actionbar>
        <Row className="mt-2">
          <Form.Group as={Col} sm="3"> 
            <InputGroup>
              <InputGroup.Text>From</InputGroup.Text>
              <Form.Control
                type="date"
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    fromDate: e.target.value,
                  })
                }
                value={searchCriteria.fromDate}
              />
            </InputGroup>
         </Form.Group>
         <Form.Group as={Col} sm="3"> 
            <InputGroup>
              <InputGroup.Text>To</InputGroup.Text>
              <Form.Control
                type="date"
                onChange={(e) =>
                  setSearchCriteria({
                    ...searchCriteria,
                    toDate: e.target.value,
                  })
                }
                value={searchCriteria.toDate}
              />
            </InputGroup>
            </Form.Group>
            <Form.Group as={Col} sm="3"> 
            <Button onClick={getReport}>Preview</Button>
            </Form.Group>
        </Row>
  
        <Row className="mt-2">
          <Col>
            <Card>
              <Card.Body>
                <Table responsive hover size="sm" striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Factory</th>
                      <th>Date</th>
                      <th>No Of Employees</th>
                      <th>Total Hours</th>
                      <th>Avg Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                    )}
                    {!loading && archiveList?.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center">
                          <b>No data found!</b>
                        </td>
                      </tr>
                    )}
                    {archiveList.map((item, index) => (
                      <tr
                        key={index}

                      >
                        <td>{index + 1}</td>
                        <td>{item.Factory}</td>
                        <td>{item.Date}</td>
                        <td>{item.NoOfEmployees}</td>
                        <td>{item.TotalHours}</td>
                        <td>{item.AvgHours}</td>
                   
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
  
      </Fragment>
    );
  };
  
  export default ArchiveDataReport;
  