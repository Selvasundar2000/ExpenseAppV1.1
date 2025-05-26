import React, { useState, useEffect, useRef } from 'react';
import Dropdown from './Utilities/InputControls/Dropdown';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AppBar, Toolbar, Box, Fab, Grid, Typography } from '@mui/material';
import TextBox from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CustomButton from './Utilities/InputControls/CustomButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from '../supabaseClient'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from 'datatables.net-react';
// import DT1 from 'datatables.net-bs5';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';


DataTable.use(DT);


const ContainerBody = () => {

  /*List function  -- start*/

  const [datalist, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);

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
  };

  const handleClose = () => {
    setAmount('');
    setTDate('');
    setTOE('');
    setTOT('');
    setOpen(false);
  };
  const [Amount, setAmount] = useState('');
  const [Tdate, setTDate] = useState(null);
  const [TOE, setTOE] = useState('');
  const [TOT, setTOT] = useState('');




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

    if (!Amount || !Tdate || !TOE || !TOT) {
      toast.error('Please Fill The Field !')
      return;
    }

    /*Save Function -- End*/
    const formattedDate = new Date(Tdate).toISOString().split('T')[0];
    const amountValue = Amount;
    const typeOfExpense = TOE;
    const typeOfTrans = TOT;


    try {
      const { data: Adddata, error: error2 } = await supabase.rpc('expensedataadd', {
        p_amount: Amount,
        p_dateoftrans: formattedDate,
        p_expensecode: TOE,
        p_transcode: TOT
      });

      if (error2) {

        toast.error("Insert Failed" + error2.message);
      } else {
        toast.success("Saved successfully!");
        fetchData();
        handleClose();


      }
    } catch (err) {

      toast.error('Error', err);
    }
  };

  /*Datatable -- start*/
  const columns = [
    {
      title: 'Date',
      data: null,
      render: function (data, type, row) {
        return `<a style="color:Blue" class="detVal">
        <span  class="badge bg-success detVal">${data.dateoftrans}</span></a>`;
      },
    },
    { title: "Amount", data: "amount" },
    { title: "Expense", data: "expensename" },
    { title: "Transaction", data: "transname" },
    {
      title: 'Action',
      data: null,
      render: function (data, type, row) {
        return `<a style="color:red" class="delval"><i class="bi bi-trash"></i></a>`;
      },
    },
  ]
  /*Datatable -- End*/


  /*Detail Function -- start*/

  const handleDetailTransaction = async (data) => {
    setOpen(true);
    setAmount(data.amount);
    setTOE(data.expensecode);
    setTOT(data.transcode);
    const parsedDate = new Date(data.dateoftrans);
    setTDate(parsedDate);
  }

  /*Detail Function -- end*/


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

      }
    } catch (err) {

      toast.error('Error', err);
    }
  };


  /*Delete Function -- End */



  return (
    <>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" />

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
                  <Grid item xs={8}>
                    <CustomButton
                      label="Add +"
                      onClick={handleAddTransaction}
                      variant="contained"
                      color="info"
                      id=""
                      size="large"
                    />
                  </Grid>
                </Grid>

              </DialogContent>
              <DialogActions>
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
              ) : (

                <div style={{ overflowX: 'auto', overflowY: 'auto', responsive: true, scrollY: '800px', }}>
                  <DataTable
                    data={datalist}
                    columns={columns}
                    className="table table-striped table-bordered"
                    options={{
                      scrollCollapse: true,
                      autoWidth: false,
                      searching: false,
                      paging: false,
                      order: [[0, 'desc']],
                      rowCallback: function (row, data) {
                        const delbtn = row.querySelector('.delval');
                        delbtn.onclick = () => {
                          handleDeleteTransaction(`${data.autocode}`);
                        };
                        const detbtn = row.querySelector('.detVal');
                        detbtn.onclick = () => {
                          handleDetailTransaction(data)
                        }

                      },
                    }}

                  />
                </div>
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
