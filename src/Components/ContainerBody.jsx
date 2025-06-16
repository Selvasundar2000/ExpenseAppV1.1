import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import Dropdown from './Utilities/InputControls/Dropdown';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AppBar, Toolbar, Box, Fab, Grid, Typography } from '@mui/material';
import TextBox from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { supabase } from '../DBAccess/supabaseClient'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable from "react-data-table-component";
import TotalCntDrCr from './Utilities/TotCntDrCr';
import { debounce } from 'lodash';
import FloatFilterBtn from './FloatFilterBtn';
import TransactionTable from './TranactionTable';
import Header from './Header'
import Footer from './Footer';
import { ExpenseDataAdd, TransactionList, ExpenseDataUpdate } from "../DBAccess/DBconfunc";
import sharedRef from './sharedRef';

const ContainerBody = () => {

  const [divUptBtn, setdivUptBtn] = useState(false);
  const [divAddBtn, setdivAddBtn] = useState(false);

  /*List function  -- start 1*/

  const [datalist, setDataList] = useState([]);

  const fetchData = async () => {
    const data = await TransactionList();
    setDataList(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

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
    await ExpenseDataAdd(Amount, Tdate, TOE, TOT, Descrp);    
      toast.success("Saved successfully!");
      handleClose();  

  }

  const [autocode, setAutoCode] = useState(null);

  const detailbindFun = useCallback(() => detailbindControl());

  function detailbindControl() {
    const sysDateFormat = new Date(sharedRef.current[0].dateoftrans);
    setdivUptBtn(sharedRef.current[1].showhide)
    setOpen(sharedRef.current[1].showhide);
    setAmount(sharedRef.current[0].amount);
    setTDate(sysDateFormat);
    setTOE(sharedRef.current[0].expensecode);
    setTOT(sharedRef.current[0].transcode);
    setDescrp(sharedRef.current[0].descrp);
  }

  const handleUpdateTransaction = async (data) => {
    const autocode = sharedRef.current[0].autocode;
    const formattedDate = new Date(Tdate);

    try {
      if (!Amount || !formattedDate || !TOE || !TOT || !Descrp) {

        toast.error('Please Fill The Field !')
        return;
      }
      else if (autocode === null || autocode === '') {
        toast.error('AutoCode is Empty !');
        return
      }
      else {

         await ExpenseDataUpdate(autocode, Amount, formattedDate, TOE, TOT, Descrp);        
          toast.success("Saved successfully!");          
          handleClose();
       
      }
    } catch (err) {

      toast.error('Error', err);
    }
  }

  return (
    <>


      {/* First Row */}
      < Grid container spacing={2} ></Grid>
      <Grid item xs={12}>
        {/* Header */}
        <Header />
        <Fab
          color={'primary'}
          onClick={handlePlusClick}
          aria-label="AddTransaction"
          style={{
            position: 'fixed',
            bottom: '120px',
            right: '20px'
          }}
        ><div style={{ fontSize: 35 }} > <i className="bi bi-plus" style={{ fontSize: 35, }}></i></div>
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
                  {divUptBtn ?
                    <Button
                      id='btnUpdate'
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={handleUpdateTransaction}
                    >Update +</Button>
                    : null}
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
                <TransactionTable onDetail={detailbindFun} />
                <TotalCntDrCr />
                <FloatFilterBtn />
              </>
              )}
            </Grid>
          </Grid>
        </Grid>
        {/* Footer */}

        <Footer />
      </Grid >
    </>
  );
};
export default ContainerBody;