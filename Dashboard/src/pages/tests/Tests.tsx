import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./tests.scss";
import { useState } from "react";
import { testRows } from "../../data";


const columns: GridColDef[] = [
  {
    field: "id",
    type: "number",
    headerName: "ID",
    width: 150,
  },
  {
    field: "tests",
    type: "string",
    headerName: "Name",
    width: 150,
  },
  {
    field: "Typedescription",
    type: "string",
    headerName: "Type",
    width: 150,
  },

  
];

const Users = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="users" style={{overflow:"hidden"}}>
      <div className="info">
        <h1>Tests</h1>
        {}
      </div>
      <DataTable slug="tests" columns={columns} rows={testRows} />
    </div>
  );
};

export default Users;
