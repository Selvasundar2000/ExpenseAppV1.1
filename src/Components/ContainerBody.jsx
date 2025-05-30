import React, { useState, useEffect, useRef } from 'react';
import Dropdown from './Utilities/InputControls/Dropdown';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AppBar, Toolbar, Box, Fab, Grid, Typography } from '@mui/material';
import TextBox from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from '../supabaseClient'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from "react-data-table-component";
import TotalCntDrCr from './Utilities/TotCntDrCr';

const ContainerBody = () => {

  const [divUptBtn, setdivUptBtn] = useState(false);
  const [divAddBtn, setdivAddBtn] = useState(false);

  /*List function  -- start*/

  const [datalist, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);

 const loadUsers = () => {
    setRenderKey(prevKey => prevKey + 1); // changes key => forces re-render
  };

  const fetchData = async () => {
    try {
      const { data: datalist, error: error1 } = await supabase.rpc("expensedatalist");

      if (error1) {
        console.error("Error:", error1);
      } else {
        setDataList(datalist || []);  // Ensure data is set correctly
      }
    } catch (error1) {
      console.error("Request failed:", error1);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [])
  /*List function  -- End*/

  const [open, setOpen] = useState(false);

  const handlePlusClick = () => {
    setOpen(true);
    setdivUptBtn(false);
    setdivAddBtn(true);
  };

  const handleClose = () => {
    setAmount('');
    setTDate(null);
    setTOE('');
    setTOT('');
    setDescrp('');
    setOpen(false);
    setAutoCode(null);
  };
  const [Amount, setAmount] = useState('');
  const [Tdate, setTDate] = useState(null);
  const [TOE, setTOE] = useState('');
  const [TOT, setTOT] = useState('');
  const [Descrp, setDescrp] = useState('');

  const TypesOfExpenses = [
    { value: 1, label: 'Food' },
    { value: 2, label: 'Housing' },
    { value: 3, label: 'Groceries' },
    { value: 4, label: 'Travel' },
    { value: 5, label: 'Medical' },
    { value: 6, label: 'Entertainment' },
    { value: 7, label: 'Other Expenses' }
  ];

  const TypeOfTransactioon = [
    { value: 1, label: "Credit" },
    { value: 2, label: "Debit" },
  ]

  /*Save function -- start*/
  const handleAddTransaction = async () => {

    if (!Amount || !Tdate || !TOE || !TOT || !Descrp) {
      toast.error('Please Fill The Field !')
      return;
    }

    /*Save Function -- End*/
    const year = Tdate.getFullYear();
    const month = String(Tdate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(Tdate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    try {

      const { data: Adddata, error: error2 } = await supabase.rpc('expensedataadd', {
        p_amount: Amount,
        p_dateoftrans: formattedDate,
        p_expensecode: TOE,
        p_transcode: TOT,
        p_descrp: Descrp
      });

      if (error2) {

        toast.error("Insert Failed" + error2.message);
      } else {
        toast.success("Saved successfully!");
        fetchData();
       await  loadUsers();
        handleClose();

      }
    } catch (err) {

      toast.error('Error', err);
    }
  };

  /*Datatable -- start*/
  const columns = [
    {
      name: "Date",
      selector: row => row.dateoftrans,
      cell: row => (
        <a style={{ color: "blue" }} className="detVal" onClick={() => handleDetailTransaction(row)} href="#">
          <span className="badge bg-primary">{row.dateoftrans}</span>
        </a>
      ),
      sortable: true,
    },
    {
      name: "Amount",
      selector: row => row.amount,
      cell: row => (
        <>
          <span className="bi bi-currency-rupee"></span> {row.amount}
        </>
      ),
      sortable: true,
    },
    {
      name: "Expense",
      selector: row => row.expensename,
      sortable: true,
    },
    {
      name: "Transaction",
      selector: row => row.transcode,
      cell: row =>
        row.transcode === 1 ? (
          <span className="badge bg-success">Credit</span>
        ) : (
          <span className="badge bg-danger">Debit</span>
        ),
      sortable: true,
    },
    {
      name: "Description",
      selector: row => row.descrp,
      sortable: true,
    },
    {
      name: "Action",
      cell: row => (
        <a
          style={{ color: "red", cursor: "pointer" }}
          onClick={() => handleDeleteTransaction(row.autocode)}
          className="delval"
          href="#"
        >
          <i className="bi bi-trash"></i>
        </a>
      ),
    },
  ];

  /*Datatable -- End*/


  /*Detail Function -- start*/

  const [autocode, setAutoCode] = useState(null);

  const handleDetailTransaction = async (data) => {
    setOpen(true);
    setAmount(data.amount);
    setTOE(data.expensecode);
    setTOT(data.transcode);
    const parsedDate = new Date(data.dateoftrans);
    setTDate(parsedDate);
    setdivUptBtn(true);
    setdivAddBtn(false);
    setAutoCode(data.autocode);
    setDescrp(data.descrp);
  }


  /*Detail Function -- end*/

  /*Update function -- start*/
  const handleUpdateTransaction = async (data) => {
    /*Save Function -- End*/
    const year = Tdate.getFullYear();
    const month = String(Tdate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(Tdate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    try {
      if (!Amount || !Tdate || !TOE || !TOT || !Descrp) {

        toast.error('Please Fill The Field !')
        return;
      }
      else if (autocode === null || autocode === '') {
        toast.error('AutoCode is Empty !');
        return
      }
      else {

        const { data: Deldata, error: errs } = await supabase.rpc('expensedetailupdate', {

          p_autocode: autocode,
          p_amount: Amount,
          p_dateoftrans: formattedDate,
          p_expensecode: TOE,
          p_transcode: TOT,
          p_descrp: Descrp
        });


        if (errs) {

          toast.error("Update Failed" + errs.message);
        } else {
          toast.success("Updated successfully!");
          fetchData();
          await loadUsers();
          handleClose();

        }
      }
    } catch (err) {

      toast.error('Error', err);
    }
  }

  /*Update function -- End*/

  /*Delete Function -- Start*/

  const handleDeleteTransaction = async (autocode) => {

    if (!autocode) {
      toast.error('Empty ExpenseCode!')
      return;
    }

    try {
      const { data: Deldata, error: error3 } = await supabase.rpc('expensedatadelete', {
        p_autocode: autocode
      });

      if (error3) {

        toast.error("Deleted Failed" + error3.message);
      } else {
        toast.success("Deleted successfully!");
        fetchData();
       await  loadUsers();

      }
    } catch (err) {

      toast.error('Error', err);
    }
  };
  /*Delete Function -- End */
  return (
    <>

      {/* First Row */}
      < Grid container spacing={2} ></Grid>
      <Grid item xs={12}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div">
              Project untitled
            </Typography>
          </Toolbar>
        </AppBar>
        <Fab
          onClick={handlePlusClick}
          color="primary"
          aria-label="add"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
          }}
        ><div style={{ fontSize: 35 }} >+</div>
        </Fab>
        {/* Main content container */}
        <Grid container spacing={6}>
          <Typography variant="body1">
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Expense</DialogTitle>
              <DialogContent>
                <br />
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Select Start Date"
                        value={Tdate}
                        format={"dd-MMM-yyyy"}
                        onChange={(newDate) => setTDate(newDate)}
                        width={250}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Dropdown
                      id="drTypeOfExpense"
                      label="Type of expense"
                      options={TypesOfExpenses}
                      value={TOE}
                      onChange={(e) => setTOE(e.target.value)}
                      width={200}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextBox
                      id="txtAmount"
                      label="Amount"
                      value={Amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                      placeholder="Enter your Amount in ₹"
                      width={250}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Dropdown
                      label="Type of Transaction"
                      options={TypeOfTransactioon}
                      value={TOT}
                      onChange={(e) => setTOT(e.target.value)}
                      width={200}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextBox
                      id="txtDescription"
                      label="Description"
                      value={Descrp}
                      onChange={(e) => {
                        setDescrp(e.target.value);
                      }}
                      placeholder="Enter your Description"
                      width={250}
                    />
                  </Grid>

                </Grid>
              </DialogContent>
              <DialogActions>
                <Grid item xs={8}>
                  {divAddBtn ?
                    <Button
                      id='btnAdd'
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleAddTransaction}
                    >Add +</Button>
                    : null}
                  {divUptBtn ? <Button
                    id='btnUpdate'
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={handleUpdateTransaction}
                  >Update +</Button> : null}
                </Grid>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </Typography>
          {/* DataTable */}
          <Grid container spacing={2}>
            <Grid item xs={12} >
              <h1>Expense Data</h1>
              {datalist.length === 0 ? (
                <p>No data available.</p>
              ) : (<>
                <DataTable
                  columns={columns}
                  data={datalist}
                  pagination={false}
                  highlightOnHover
                  persistTableHead
                  noHeader={true}
                />
                <TotalCntDrCr key={renderKey} />
              </>

              )}
            </Grid>
          </Grid>
        </Grid>
        {/* Footer */}
        <Box textAlign="center" pt={5}>
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </Typography>
        </Box>
      </Grid>
    </>
  );
};
export default ContainerBody;