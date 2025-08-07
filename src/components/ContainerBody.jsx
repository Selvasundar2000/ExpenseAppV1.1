import React, { useState, useEffect, useCallback } from 'react';
// import Dropdown from './InputControls/Dropdown';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Box, Fab, Grid } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TotalCntDrCr from './TransactionTable_Client/TotCntDrCr'
import FloatFilterBtn from './InputControls/FloatFilterBtn';
import TransactionTable from './TransactionTable_Client/TranactionTable';
import Header from '../layouts/Header'
import Footer from '../layouts/Footer';
import { ExpenseDataAdd, TransactionList, ExpenseDataUpdate } from "../services/DBconfunc";
import sharedRef from '../lib/sharedRef';
import { TextInput, Dropdown, DateInput, } from './InputControls/MuiFormControls';
import { formFields } from '../components/FormFieldsConfig/formConfig_AddTrans';
import { parseDateToISO } from '../lib/parseDateToISO';

const ContainerBody = () => {
  const [FilterDateUpdate, setFilterDateUpdate] = useState('');
  const [FilterCountUpdate, setFilterCountUpdate] = useState('');

  const [formData, setFormData] = useState({});
  const [divUptBtn, setdivUptBtn] = useState(false);
  const [divAddBtn, setdivAddBtn] = useState(false);

  /*List function  -- start 1*/

  const [RefreshTransTbl, setRefreshTransTbl] = useState(false);
  const [RefreshTotTbl, setRefreshTotTbl] = useState(false);

  const [RefreshTotalCount, setRefreshTotalCount] = useState('');


  function refreshTransTable() {
    setRefreshTransTbl(prev => !prev);
    setRefreshTotTbl(prev => !prev);
  }


  const fetchData = async () => {
    await TransactionList();
  };
  useEffect(() => {
    fetchData();
  }, [RefreshTransTbl, RefreshTotTbl]);

  const [open, setOpen] = useState(false);

  const handlePlusClick = () => {
    setOpen(true);
    setdivUptBtn(false);
    setdivAddBtn(true);
  };

  const handleUpdateClick = () => {
    setOpen(true);
    setdivUptBtn(true);
    setdivAddBtn(false);
  };


  const handleClose = () => {
    setOpen(false);
    setFormData({});
  };


  /*Save function -- start*/
  const handleAddTransaction = async () => {

    if (!formData.Amount || !formData.Tdate || !formData.TOE || !formData.TOT || !formData.Descrp) {
      toast.error('Please Fill The Field !')
      return;
    }
    await ExpenseDataAdd(formData.Amount, formData.Tdate, formData.TOE, formData.TOT, formData.Descrp);
    refreshTransTable();
    handleClose();
  }


  const detailbindFun = useCallback(() => detailbindControl());

  function detailbindControl() {
    handleUpdateClick();

    var formDateConvert = (parseDateToISO(sharedRef.current[0].dateoftrans));

    formData.Amount = (sharedRef.current[0].amount);
    formData.Tdate = (formDateConvert);
    formData.TOE = (sharedRef.current[0].expensecode);
    formData.TOT = (sharedRef.current[0].transcode);
    formData.Descrp = (sharedRef.current[0].descrp);

  }

  const handleUpdateTransaction = async (data) => {

    const autocode = sharedRef.current[0].autocode;
    const formattedDate = parseDateToISO(formData.Tdate);;

    try {
      if (!formData.Amount || !formattedDate || !formData.TOE || !formData.TOT || !formData.Descrp) {

        toast.error('Please Fill The Field !')
        return;
      }
      else if (autocode === null || autocode === '') {
        toast.error('AutoCode is Empty !');
        return
      }
      else {
        await ExpenseDataUpdate(autocode, formData.Amount, formattedDate, formData.TOE, formData.TOT, formData.Descrp);
        refreshTransTable();
        handleClose();

      }
    } catch (err) {

      toast.error('Error', err);
    }
  }
  const fieldTypeByKey = formFields.reduce((acc, field) => {
    acc[field.key] = field.type;
    return acc;
  }, {});
  const handleChange = (key, value) => {
    if (fieldTypeByKey[key] === 'checkbox') {
      setFormData((prev) => {
        const existing = prev[key] || [];
        const updated = existing.includes(value)
          ? existing.filter((v) => v !== value)
          : [...existing, value];
        return { ...prev, [key]: updated };
      });
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };

  const inputComponents = {
    text: TextInput,
    date: DateInput,
    dropdown: Dropdown
  };

  return (<>

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

    {/* Popup content */}
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Expense</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {formFields.map((field) => {
            const Component = inputComponents[field.type];
            if (!Component) return null;

            const gridSize = field.gridSize || 6;

            return (
              <Grid item xs={12} sm={gridSize} key={field.key}>
                {field.type === 'checkbox' ? (
                  <Component
                    label={field.label}
                    selectedValues={formData[field.key] || []}
                    onChange={(value) => handleChange(field.key, value)}
                    options={field.options}
                  />
                ) : field.type === 'radio' ? (
                  <Component
                    label={field.label}
                    name={field.key}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    options={field.options}
                  />
                ) : (
                  <Component
                    label={field.label}
                    value={formData[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    name={field.key}
                    options={field.options}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {divAddBtn && (
          <Button
            id="btnAdd"
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddTransaction}
          >
            ADD +
          </Button>
        )}
        {divUptBtn && (
          <Button
            id="btnUpdate"
            variant="contained"
            color="success"
            size="large"
            onClick={handleUpdateTransaction}
          >
            UPDATE +
          </Button>
        )}
        <Button onClick={handleClose} color="inherit">
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>


    {/* <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Expense</DialogTitle>
        <DialogContent>
          <br />         

          {formFields.map((field) => {
        const Component = inputComponents[field.type];
        if (!Component) return null;

        if (field.type === 'checkbox') {
          return (
            <Component
              key={field.key}
              label={field.label}
              selectedValues={formData[field.key] || []}
              onChange={(value) => handleChange(field.key, value)}
              options={field.options}
            />
          );
        }
        return (
          <Component
            key={field.key}
            label={field.label}
            value={formData[field.key] || ''}
            onChange={(e) => handleChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            name={field.key}
            options={field.options}
          />
        );
      })}

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
      </Dialog> */}


    {/* DataTable */}
    <Box sx={{ p: { xs: 2, sm: 3, md: 14 } }}>
      <Grid container spacing={2} >
        <Grid item xs={12} md={2} >
          <TransactionTable RefreshTransTbl={RefreshTransTbl} onDetail={detailbindFun} setRefreshTotalCount={setRefreshTotalCount} FilterDateUpdate={FilterDateUpdate}
          />
        </Grid>
        <Grid item xs={12} md={10}>
          <TotalCntDrCr RefreshTotTbl={RefreshTotTbl} RefreshTotalCount={RefreshTotalCount}
            FilterCountUpdate={FilterCountUpdate}
          />
        </Grid>
      </Grid>
      <FloatFilterBtn setFilterDateUpdate={setFilterDateUpdate} setFilterCountUpdate={setFilterCountUpdate} />

    </Box>
    {/* Footer */}
    <Footer />

  </>
  );
};
export default ContainerBody;