import { useState, useEffect, useRef } from "react";
import { Card, Row, Col, Nav, Badge } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Actionbar from "../../components/layout/Actionbar";
import useGetAll from "../../components/hooks/useGetAll";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

registerAllModules();

const TNA = () => {
  const hotRef = useRef(null);
  const exportButtonRef = useRef(null);
  const [toggle, setToggle] = useState(false);
  const [searchCriteria] = useState({
    assignTo: "merchant",
  });
  const [changeList, setChangeList] = useState([]);
  const [res] = useGetAll("Tna?", searchCriteria, toggle);
  const user = JSON.parse(localStorage.getItem("user")) ?? {};

  const cellRenderer = (
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) => {
    const nextColumnData = instance.getDataAtCell(row, col + 1);
    // console.log("nextColumnData", nextColumnData);
    if (
      value < new Date().toISOString().split("T")[0] &&
      nextColumnData === null
    ) {
      td.style.color = "red";
    } else {
      td.style.color = "black";
    }
    td.innerHTML = value;
  };

  const columns = [
    { data: "PurchaseOrderId", readOnly: true },
    { data: "PONo", readOnly: true },
    { data: "StyleNo", readOnly: true },
    { data: "OrderQuantity", readOnly: true },
    { data: "ExitDate", readOnly: true },
    { data: "StyleDescription", readOnly: true },
    { data: "FactoryName", readOnly: true },
    { data: "FabricDueDate", readOnly: true, renderer: cellRenderer },
    { data: "FabricIHDate", readOnly: user.role === "STORE" ? false : true },
    { data: "DyeLotDueDate", readOnly: true, renderer: cellRenderer },
    { data: "DyeLotStatus" },
    { data: "VCodeDueDate", readOnly: true, renderer: cellRenderer },
    { data: "VCodeStatus" },
    { data: "ShadeApprovalDueDate", readOnly: true, renderer: cellRenderer },
    { data: "ShadeApprovalStatus" },
    { data: "JssDueDate", readOnly: true, renderer: cellRenderer },
    { data: "JssStatus" },
    { data: "TrimCardSewingDueDate", readOnly: true, renderer: cellRenderer },
    { data: "TrimCardSewingStatus" },
    {
      data: "TrimCardFinishingDueDate",
      readOnly: true,
      renderer: cellRenderer,
    },
    { data: "TrimCardFinishingStatus" },
    { data: "TestReportDueDate", readOnly: true, renderer: cellRenderer },
    { data: "TestReportStatus" },
    { data: "SewingTrimsDueDate", readOnly: true, renderer: cellRenderer },
    { data: "SewingTrimsStatus" },
    { data: "FinishingTrimsDueDate", readOnly: true, renderer: cellRenderer },
    { data: "FinishingTrimsStatus" },
    { data: "PlanCutDate", readOnly: true },
    { data: "ClarificationDueDate", readOnly: true, renderer: cellRenderer },
    { data: "ClarificationStatus" },
    { data: "TopSampleDueDate", readOnly: true, renderer: cellRenderer },
    { data: "TopSampleStatus" },
    { data: "Cutting", readOnly: true },
    { data: "Sewing", readOnly: true },
    { data: "Finishing", readOnly: true },
    { data: "ShippedQuantity", readOnly: true },
    { data: "Notes" },
  ];

  const handleExportClick = () => {
    const hot = hotRef.current.hotInstance;
    const exportPlugin = hot.getPlugin("exportFile");

    exportPlugin.downloadFile("csv", {
      bom: false,
      columnDelimiter: ",",
      columnHeaders: false,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: "csv",
      filename: "TNA_[YYYY]-[MM]-[DD]",
      mimeType: "text/csv",
      rowDelimiter: "\r\n",
      rowHeaders: true,
    });
  };

  useEffect(() => {
    exportButtonRef.current.addEventListener("click", handleExportClick);
  }, []);

  const columnNames = res.data.length > 0 ? Object.keys(res.data[0]) : [];

  const saveList = () => {
    if (changeList.length === 0) {
      return;
    }
    fetch(process.env.REACT_APP_API_URL + "Tna", {
      method: "POST",
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
        setToggle(!toggle);
        setChangeList([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Actionbar pageTitle="Time & Action Calendar">
        <Nav.Link className="nav-link text-primary">
          <Badge className="me-2">
            You have made {changeList.length} changes
          </Badge>
        </Nav.Link>
        <Nav.Link className="nav-link text-primary" onClick={saveList}>
          <FontAwesomeIcon icon="fa-solid fa-share-from-square" /> Save
        </Nav.Link>
        <Nav.Link className="nav-link text-success" ref={exportButtonRef}>
          <FontAwesomeIcon icon="fa-solid fa-file-excel" /> Excel
        </Nav.Link>
      </Actionbar>

      <Row className="mt-2">
        <Col>
          <Card>
            <Card.Body>
              <HotTable
                ref={hotRef}
                data={res.data}
                columns={columns}
                colHeaders={columnNames}
                rowHeaders={true}
                hiddenColumns={{
                  columns: [0],
                }}
                fixedColumnsStart={5}
                afterChange={(changes, source) => {
                  changes?.forEach(([row, prop, oldValue, newValue]) => {
                    const purchaseOrderId =
                      hotRef.current.hotInstance.getDataAtCell(row, 0); // PurchaseOrderId is in the first column
                    console.log("purchaseOrderId", purchaseOrderId);
                    setChangeList((pre) => [
                      ...pre,
                      {
                        PurchaseOrderId: purchaseOrderId,
                        Property: prop,
                        Value: newValue,
                      },
                    ]);
                  });
                }}
                filters={true}
                dropdownMenu={true}
                columnSorting={true}
                manualColumnResize={true}
                height={window.innerHeight - 200}
                width="auto"
                licenseKey="non-commercial-and-evaluation"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default TNA;
