import { supabase } from './supabaseClient'; // adjust path as needed
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const TransactionList = async () => {
  try {
    const { data: datalist, error: error1 } = await supabase.rpc("expensedatalist");

    if (error1) {
      console.error("Error:", error1);

    } else {
      return (datalist || []);
    }
  } catch (error1) {
    console.error("Request failed:", error1);

  }
};

export const TransactionDelete = async (autocode) => {

  try {
    const { error: error3 } = await supabase.rpc('expensedatadelete', {
      p_autocode: autocode
    });

    if (error3) {
      toast.error("Deleted Failed" + error3.message);

    } else {
      toast.success("Deleted successfully!");

    }
  } catch (err) {
    toast.error('Error', err);

  }
}

export const ExpenseDataAdd = async (Amount, formattedDate, TOE, TOT, Descrp) => {

  try {
    const { error: error2 } = await supabase.rpc('expensedataadd', {
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

    }
  } catch (err) {
    toast.error('Error', err);

  }
}



export const ExpenseDataUpdate = async (autocode, Amount, formattedDate, TOE, TOT, Descrp) => {

  try {

    const { error: error2 } = await supabase.rpc('expensedetailupdate', {
      p_autocode: autocode,
      p_amount: Amount,
      p_dateoftrans: formattedDate,
      p_expensecode: TOE,
      p_transcode: TOT,
      p_descrp: Descrp
    });
    if (error2) {
      toast.error("Updated Failed" + error2.message);

    } else {
      toast.success("Updated successfully!");

    }
  } catch (err) {
    toast.error('Error', err);

  }
}

export const datefilterexpense = async (filStartDate, filEndDate,filtranscode) => { 

  try {   
    const { data: ReturnData, error: error2 } = await supabase.rpc('datefilterexpense', {
      p_filstartdate: filStartDate,
      p_filenddate: filEndDate,
      p_filtranscode: filtranscode
    });
    
    if (error2) {
      toast.error("Failed" + error2.message);
    } else {
      return ReturnData || [];
    }
  } catch (err) {
   
    toast.error('Error', err);

  }
}