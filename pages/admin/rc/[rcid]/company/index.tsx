import React, { useEffect, useState } from "react";
import { Button, Grid, IconButton, Modal, Stack } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { useRouter } from "next/router";

import DataGrid from "@components/DataGrid";
import Meta from "@components/Meta";
import AddCompany from "@components/Modals/AddCompanyAdmin";
import useStore from "@store/store";
import requestCompany, { CompanyRc } from "@callbacks/admin/rc/company";

const BASE_ROUTE = "/admin/rc";

const gridMain = {
  width: "100%",
  display: "flex",
  alignItems: "right",
  justifyContent: "right",
};

const columns: GridColDef[] = [
  {
    field: "ID",
    headerName: "ID",
    width: 90,
  },
  {
    field: "company_name",
    headerName: "Company",
    width: 300,
  },
  {
    field: "CreatedAt",
    headerName: "Registered on",
    valueGetter: ({ value }) =>
      value &&
      `${new Date(value).toLocaleDateString()} ${new Date(
        value
      ).toLocaleTimeString()}`,
    width: 300,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "viewdetails",
    headerName: "View Details",
    width: 400,
    sortable: false,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Link
        href={{
          pathname: `${BASE_ROUTE}/${params.row.recruitment_cycle_id}/company/${params.row.ID}`,
        }}
      >
        <Button variant="contained" sx={{ width: "80%" }}>
          View
        </Button>
      </Link>
    ),
  },
];

function Index() {
  const [openNew, setOpenNew] = React.useState(false);
  const handleOpenNew = () => {
    setOpenNew(true);
  };
  const handleCloseNew = () => {
    setOpenNew(false);
  };
  const router = useRouter();
  const { rcid } = router.query;
  const rid = (rcid || "").toString();
  const { token } = useStore();
  const [rows, setRow] = useState<CompanyRc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCompanydata = async () => {
      if (rid === undefined || rid === "") return;
      let response = await requestCompany.getall(token, rid);
      setRow(response);
      setLoading(false);
    };
    if (rid !== "") getCompanydata();
  }, [token, rid]);
  return (
    <div className="container">
      <Meta title="Company" />
      <Stack>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <h2>Company</h2>
          </Grid>
          <Grid item xs={6} style={gridMain}>
            <div>
              <IconButton onClick={handleOpenNew}>
                <AddIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>

        <DataGrid
          rows={rows}
          getRowId={(row) => row.ID}
          columns={columns}
          loading={loading}
        />
      </Stack>
      <Modal open={openNew} onClose={handleCloseNew}>
        <AddCompany handleCloseNew={handleCloseNew} />
      </Modal>
    </div>
  );
}

Index.layout = "adminPhaseDashBoard";
export default Index;
