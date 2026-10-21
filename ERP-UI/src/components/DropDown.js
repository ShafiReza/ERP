import { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import useGetAll from "./hooks/useGetAll";
import useFetch from "./hooks/useFetch";
import { Spinner } from "react-bootstrap";

const Buyer = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetBuyerDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Buyer"
    />
  );
};

const Hour = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "Whole Day", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
    { label: "6", value: 6 },
    { label: "7", value: 7 },
    { label: "8", value: 8 },
    { label: "9", value: 9 },
    { label: "10", value: 10 },
    { label: "11", value: 11 },
    { label: "12", value: 12 },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Hour"
    />
  );
};

const OffStandardCode = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "NW", value: "NW" },
    { label: "MT", value: "MT" },
    { label: "RP", value: "RP" },
    { label: "TC", value: "TC" },
    { label: "TB", value: "TB" },
    { label: "BC", value: "BC" },
    { label: "MISC(CC)", value: "MISC(CC)" },
    { label: "MISC(OPC)", value: "MISC(OPC)" },
    { label: "CT", value: "CT" },
    { label: "ID", value: "ID" },
    { label: "OT", value: "OT" },
    { label: "HO", value: "HO" },
    { label: "LC-NH", value: "LC-NH" },
    { label: "LC-RT", value: "LC-RT" },
    { label: "LC-BD", value: "LC-BD" },
    { label: "LC-FL", value: "LC-FL" },
    { label: "BU", value: "BU" },
    { label: "FM", value: "FM" },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Code"
    />
  );
};

const IssueType = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "Printer Setup/Problem", value: "Printer Setup/Problem" },
    { label: "Mail Setup/Problem", value: "Mail Setup/Problem" },
    { label: "Software Installation", value: "Software Installation" },
    { label: "CC Camera", value: "CC Camera" },
    { label: "Hardware Problem", value: "Hardware Problem" },
    { label: "ERP Issue", value: "ERP Issue" },
    { label: "Computer Lock", value: "Computer Lock" },
    { label: "IP Phone", value: "IP Phone" },
    { label: "Operating System Setup", value: "Operating System Setup" },
    {
      label: "Attendance Machine Setup/Problem",
      value: "Attendance Machine Setup/Problem",
    },
    { label: "Meeting", value: "Meeting" },
    { label: "Networking", value: "Networking" },
    { label: "Others", value: "Others" },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Issue Type"
    />
  );
};

const Customer = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetCustomerDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Customer"
    />
  );
};

const PI = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetPIDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select PI"
    />
  );
};

const Division = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDivisionDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      {...props}
      options={response.data}
    />
  );
};

const VoucherType = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetVoucherTypeDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select VoucherType"
    />
  );
};

const Item = (props) => {
  const [showRequiredMsg, setShowRequiredMsg] = useState(false);
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetItemDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  useEffect(() => {
    if (props.isRequired) {
      if (!props.selected && props.isRequired === true) {
        setShowRequiredMsg(true);
      } else if (props.selected) {
        setShowRequiredMsg(false);
      }
    }
  }, [props]);

  return (
    <Fragment>
      {response.dataLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Fragment>
          <Select
            {...props}
            value={arr[0]}
            options={response.data}
            isClearable={() => setIsClearable(!isClearable)}
            placeholder="Select Item"
          />
          {showRequiredMsg === true ? (
            <p className="text-danger">Please Select Item</p>
          ) : null}
        </Fragment>
      )}
    </Fragment>
  );
};

const MarketingOfficer = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll(
    "DropDown/GetDropDownList?type=MarketingOfficer"
  );
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      isClearable={() => setIsClearable(!isClearable)}
      {...props}
      value={arr[0]}
      options={response.data}
    />
  );
};

const ItemCategory = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetItemCategoryDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Fragment>
      {response.dataLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Select
          {...props}
          value={arr[0]}
          options={response.data}
          isClearable={() => setIsClearable(!isClearable)}
          placeholder="Select Item Category"
        />
      )}
    </Fragment>
  );
};

const Supplier = (props) => {
  const [showIsRequiredMsg, setShowIsRequiredMsg] = useState(false);
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetSupplierDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  useEffect(() => {
    if (props.isRequired) {
      if (!props.selected && props.isRequired === true) {
        setShowIsRequiredMsg(true);
      } else if (props.selected) {
        setShowIsRequiredMsg(false);
      }
    }
  }, [props]);

  return (
    <Fragment>
      <Select
        value={arr[0]}
        {...props}
        options={response.data}
        isClearable={() => setIsClearable(!isClearable)}
        placeholder="Select Supplier"
      />
      {showIsRequiredMsg === true ? (
        <p className="text-danger">Please Select Supplier</p>
      ) : null}
    </Fragment>
  );
};

const Unit = (props) => {
  const [showIsRequiredMsg, setShowIsRequiredMsg] = useState(false);
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetUnitDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  useEffect(() => {
    if (props.isRequired) {
      if (!props.selected && props.isRequired === true) {
        setShowIsRequiredMsg(true);
      } else if (props.selected) {
        setShowIsRequiredMsg(false);
      }
    }
  }, [props]);

  return (
    <Fragment>
      <Select
        value={arr[0]}
        {...props}
        options={response.data}
        isClearable={() => setIsClearable(!isClearable)}
        placeholder="Select Unit"
      />
      {showIsRequiredMsg === true ? (
        <p className="text-danger">Please Select Unit</p>
      ) : null}
    </Fragment>
  );
};
const ProductionUnit = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetProductionUnitDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Production Unit"
    />
  );
};

const Costsheet = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Costsheet");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      isClearable={() => setIsClearable(!isClearable)}
      value={arr[0]}
      {...props}
      options={response.data}
    />
  );
};

const Requisition = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetRequisitionDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Requisition"
    />
  );
};

const SalesOrder = (props) => {
  const [showIsRequiredMsg, setShowIsRequiredMsg] = useState(false);
  const [isClearable, setIsClearable] = useState(false);

  useEffect(() => {
    if (props.isRequired) {
      if (!props.selected && props.isRequired === true) {
        setShowIsRequiredMsg(true);
      } else if (props.selected) {
        setShowIsRequiredMsg(false);
      }
    }
  }, [props]);

  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      const res = await fetch(
        process.env.REACT_APP_API_URL +
          "DropDown/GetPurchaseOrderDropDown?" +
          new URLSearchParams({ searchCriteria: inputValue }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      return data;
    }
  };

  return (
    <Fragment>
      <AsyncSelect
        {...props}
        isClearable={() => setIsClearable(!isClearable)}
        cacheOptions
        placeholder="Select PO"
        loadOptions={loadOptions}
        defaultValue={{
          value: props.selected,
          label: props.selectedPO ? props.selectedPO : "Select PO",
        }}
      />
      {showIsRequiredMsg === true ? (
        <p className="text-danger">Please Select PO</p>
      ) : null}
    </Fragment>
  );
};

const EmployeeWithCardNo = (props) => {
  const [isClearable, setIsClearable] = useState(false);

  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      const res = await fetch(
        process.env.REACT_APP_API_URL +
          "DropDown/GetEmployeeWithCardNoDropDown?" +
          new URLSearchParams({ searchCriteria: inputValue }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      return data;
    }
  };

  return (
    <AsyncSelect
      {...props}
      isClearable={() => setIsClearable(!isClearable)}
      cacheOptions
      placeholder="Search Card No"
      loadOptions={loadOptions}
    />
  );
};

const Employee = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetEmployeeDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      value={arr[0]}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Employee"
    />
  );
};

const LeaveType = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetLeaveTypeDropdown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      {...props}
      value={arr[0]}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select LeaveType"
    />
  );
};

const AccountType = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetAccountTypeDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Account type"
    />
  );
};

const Invoice = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [invoiceDropdown, getInvoiceDropDown] = useFetch();

  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      const res = await fetch(
        process.env.REACT_APP_API_URL +
          "DropDown/GetExportInvoiceDropDown?" +
          new URLSearchParams({ searchCriteria: inputValue }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      return data;
    }
  };

  useEffect(() => {
    if (props.selected) {
      getInvoiceDropDown(
        "DropDown/GetExportInvoiceDropDown?" +
          new URLSearchParams({ searchCriteria: props.selected }),
        "GET"
      );
    }
  }, [getInvoiceDropDown, props]);

  return (
    <AsyncSelect
      {...props}
      value={invoiceDropdown.data[0]}
      isClearable={() => setIsClearable(!isClearable)}
      cacheOptions
      placeholder="Select Invoice"
      loadOptions={loadOptions}
    />
  );
};

const AccountNo = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetAccountDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      required
    />
  );
};

const ParentAccount = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetParentAccountDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select parent account"
    />
  );
};

const Company = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetCompanyDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select Company"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const CostCenter = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetCostCenterDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const BankForwardingNo = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("Dropdown/GetBankForwardingDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const Year = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: 2017, value: 2017 },
    { label: 2018, value: 2018 },
    { label: 2019, value: 2019 },
    { label: 2020, value: 2020 },
    { label: 2021, value: 2021 },
    { label: 2022, value: 2022 },
    { label: 2023, value: 2023 },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Year"
    />
  );
};

const ShipMode = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "Sea", value: 1 },
    { label: "Air", value: 2 },
    { label: "Road", value: 3 },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Ship Mode"
    />
  );
};

const Month = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Month"
    />
  );
};

const Floor = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetFloorDropDown");
  response.data.forEach(function (item) {
    item.value = item.ValueString;
  });
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Floor"
    />
  );
};

const FloorLine = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetLineDropDown?floor=" + props.floor);
  response.data.forEach(function (item) {
    item.value = item.ValueString;
  });
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Line"
    />
  );
};

const ItemByPo = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll(
    "DropDown/GetItemByPoDropDown?poId=" + props.poId
  );

  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Fragment>
      {response.dataLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Select
          value={arr[0]}
          {...props}
          options={response.data}
          isClearable={() => setIsClearable(!isClearable)}
          placeholder="Select Item"
        />
      )}
    </Fragment>
  );
};

const EmployeeType = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "Worker", value: 1 },
    { label: "Staff", value: 2 },
  ];
  const arr = list.filter((item) => item.value === props.selected);
  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Employee Type"
    />
  );
};

const Bank = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetBankDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Bank"
    />
  );
};

const EducationalQualification = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const BloodGroup = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const Religion = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const Department = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetHrDepartmentDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Department"
    />
  );
};

const PrimeDepartments = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDepartmentDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Department"
    />
  );
};

const Designation = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDesignationDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Designation"
    />
  );
};

const Section = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetSectionDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Section"
    />
  );
};

const Branch = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetBranchDropdown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const SalaryGrade = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const Gender = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    {
      label: "Male",
      value: 1,
    },
    {
      label: "Female",
      value: 2,
    },
  ];
  const arr = list.filter((item) => item.value === props.selected);
  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const MaritalStatus = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    {
      label: "Married",
      value: 1,
    },
    {
      label: "Unmarried",
      value: 2,
    },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const Shift = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetShiftDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);
  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Shift"
    />
  );
};

const Store = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetDropDownList?type=Store");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const Factory = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetFactoryDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Factory"
    />
  );
};

const PurchaseOrder = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetPurchaseOrderDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select Purchase Order"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};
const LC = (props) => {
  const [showIsRequiredMsg, setShowIsRequiredMsg] = useState(false);
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetJobDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  useEffect(() => {
    if (props.isRequired) {
      if (!props.selected && props.isRequired === true) {
        setShowIsRequiredMsg(true);
      } else if (props.selected) {
        setShowIsRequiredMsg(false);
      }
    }
  }, [props]);

  return (
    <Fragment>
      <Select
        value={arr[0]}
        {...props}
        options={response.data}
        placeholder="Select LC/Contract/Job"
        isClearable={() => setIsClearable(!isClearable)}
      />
      {showIsRequiredMsg === true ? (
        <p className="text-danger">Please Select Job</p>
      ) : null}
    </Fragment>
  );
};

const BL = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetBLDropdown?", null, props?.toggle);
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select BL"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const BackToBackLC = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [b2bDropdown, getb2bDropDown] = useFetch();

  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      const res = await fetch(
        process.env.REACT_APP_API_URL +
          "DropDown/GetBackToBackLCDropdown?" +
          new URLSearchParams({ searchCriteria: inputValue }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      return data;
    }
  };

  useEffect(() => {
    if (props.selected) {
      getb2bDropDown(
        "DropDown/GetBackToBackLCDropdown?" +
          new URLSearchParams({ searchCriteria: props.selected }),
        "GET"
      );
    }
  }, [getb2bDropDown, props]);

  return (
    <AsyncSelect
      {...props}
      value={b2bDropdown.data[0]}
      isClearable={() => setIsClearable(!isClearable)}
      cacheOptions
      placeholder="Select B2B LC"
      loadOptions={loadOptions}
    />
  );
};

const Style = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [styleDropdown, getStyleDropDown] = useFetch();

  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      const res = await fetch(
        process.env.REACT_APP_API_URL +
          "DropDown/GetStyleDropDown?" +
          new URLSearchParams({ searchCriteria: inputValue }),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      return data;
    }
  };

  useEffect(() => {
    if (props.selected) {
      getStyleDropDown(
        "DropDown/GetStyleDropDown?" +
          new URLSearchParams({ searchCriteria: props.selected }),
        "GET"
      );
    }
  }, [getStyleDropDown, props]);

  return (
    <AsyncSelect
      {...props}
      value={styleDropdown.data[0]}
      isClearable={() => setIsClearable(!isClearable)}
      cacheOptions
      placeholder="Select Style"
      loadOptions={loadOptions}
    />
  );
};

const CuttingNo = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll(
    "Dropdown/GetCuttingPlanDropDown?" +
      new URLSearchParams({
        purchaseOrderId: props.purchaseOrderId ? props.purchaseOrderId : 0,
      })
  );
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select Cutting"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const OperationCatogory = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetOperationCategoryDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select OperationCatogory"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const Spec = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetSpecDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select Spec"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const FDBP = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetFDBPDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select FDBP No"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const JobClass = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetJobClassDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select JobClass"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const StyleOperation = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetOperationDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Fragment>
      {response.dataLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : (
        <Select
          value={arr[0]}
          {...props}
          options={response.data}
          placeholder="Select Operation"
          isClearable={() => setIsClearable(!isClearable)}
        />
      )}
    </Fragment>
  );
};

const Season = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetSeasonDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select Season"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const PaymentType = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetPaymentTypeDropDown");
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      placeholder="Select Payment Type"
      isClearable={() => setIsClearable(!isClearable)}
    />
  );
};

const Role = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetRoleDropDown");
  response.data.forEach(function (item) {
    item.value = item.ValueString;
  });
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Role"
    />
  );
};

const Port = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const [response] = useGetAll("DropDown/GetPortDropDown");
  response.data.forEach(function (item) {
    item.value = item.ValueString;
  });
  const arr = response.data.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={response.data}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Port"
    />
  );
};

const BLTobeEndoresTo = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "Kontoor US LLC", value: "Kontoor US LLC" },
    { label: "Kontoor Canada CO", value: "Kontoor Canada CO" },
    { label: "Demco CZ SRO", value: "Demco CZ SRO" },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select BLTobeEndoresTo"
    />
  );
};

const CountryName = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "USA", value: "USA" },
    { label: "CANADA", value: "CANADA" },
    { label: "CZECH REPUBLIC", value: "CZECH REPUBLIC" },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Country"
    />
  );
};

const FinalDestination = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "SAVANNAN", value: "SAVANNAN" },
    { label: "HALIFAX", value: "HALIFAX" },
    { label: "BREMERHAVEN", value: "BREMERHAVEN" },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Destination"
    />
  );
};

const HsCode = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "62034200", value: "62034200" },
    { label: "62046200", value: "62046200" },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select HS Code"
    />
  );
};

const SightDays = (props) => {
  const [isClearable, setIsClearable] = useState(false);
  const list = [
    { label: "75", value: 75 },
    { label: "90", value: 90 },
    { label: "120", value: 120 },
  ];
  const arr = list.filter((item) => item.value === props.selected);

  return (
    <Select
      value={arr[0]}
      {...props}
      options={list}
      isClearable={() => setIsClearable(!isClearable)}
      placeholder="Select Sight Days"
    />
  );
};

export {
  EmployeeWithCardNo,
  IssueType,
  SightDays,
  HsCode,
  FinalDestination,
  CountryName,
  BLTobeEndoresTo,
  Branch,
  CuttingNo,
  Style,
  Buyer,
  Customer,
  MarketingOfficer,
  VoucherType,
  ItemCategory,
  MaritalStatus,
  Gender,
  SalaryGrade,
  Section,
  Designation,
  Department,
  Religion,
  BloodGroup,
  EducationalQualification,
  Bank,
  EmployeeType,
  Floor,
  FloorLine,
  Shift,
  Month,
  Year,
  LeaveType,
  BankForwardingNo,
  CostCenter,
  Company,
  ParentAccount,
  AccountNo,
  AccountType,
  Costsheet,
  Item,
  Supplier,
  Unit,
  ProductionUnit,
  Division,
  Requisition,
  SalesOrder,
  Employee,
  Invoice,
  Store,
  PurchaseOrder,
  LC,
  OperationCatogory,
  Spec,
  StyleOperation,
  Factory,
  JobClass,
  FDBP,
  Role,
  PI,
  BL,
  BackToBackLC,
  Port,
  Season,
  Hour,
  OffStandardCode,
  ShipMode,
  PaymentType,
  ItemByPo,
  PrimeDepartments,
};
