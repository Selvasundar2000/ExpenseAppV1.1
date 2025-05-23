import React, { useState,useEffect } from 'react';
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

import ExpenseDataListComponent from '../ExpenseDataListComponent';


const ContainerBody = () => {
 const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
 const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("expensedatalist");
    if (!error) {
      setData(data || []);
    }
    setLoading(false);
  };


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
  const handleAddTransaction = async() => {

    if (!Amount || !Tdate || !TOE || !TOT) {
      toast.error('Please Fill The Field !')
      return;
    }

    const formattedDate = new Date(Tdate).toISOString().split('T')[0];
    const amountValue = Amount;
    const typeOfExpense = TOE;
    const typeOfTrans = TOT;

    

    try {
      const { data, error } =await supabase.rpc('expensedataadd', {
        p_amount: Amount,
        p_dateoftrans: formattedDate,
        p_expensecode: TOE,
        p_transcode: TOT
      });

      if (error) {

        toast.error("Insert Failed" + error.message);
      } else {
        toast.success("Saved successfully!");
       
        handleClose();
   fetchData();

      }
    } catch (err) {

      toast.error('Error', err);
    }
  };
 useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      {/* First Row */}
      <div className="row">
        <div className="col-12">
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

          <div className='container'>
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
          <ExpenseDataListComponent loading={loading} refreshData={fetchData}/>

          </div>
          {/* Footer */}
          <Box textAlign="center" pt={5}>
            <Typography variant="body2" color="textSecondary">
              © {new Date().getFullYear()} Your Company. All rights reserved.
            </Typography>
          </Box>

        </div>
      </div>
    </>
  );


};

export default ContainerBody;
