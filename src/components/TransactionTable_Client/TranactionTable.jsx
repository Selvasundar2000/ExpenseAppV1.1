import DataTable from "react-data-table-component";
import React, { useState, useEffect, } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TransactionList, TransactionDelete } from "../../services/DBconfunc";
import sharedRef from "../../lib/sharedRef";

export default function TransactionTable({ RefreshTransTbl, onDetail, setRefreshTotalCount, FilterDateUpdate }) {

    const [datalist, setDataList] = useState('');

    const fetchData = async () => {
        const data = await TransactionList();
        setDataList(data);
    };
    useEffect(() => {
        if (FilterDateUpdate === '') {
            fetchData();
        }
        else {
            setDataList(FilterDateUpdate);
            sharedRef.current = [FilterDateUpdate];
        }

    }, [RefreshTransTbl, FilterDateUpdate]);

    const handleDeleteTransaction = async (autocode) => {
        if (!autocode) {
            toast.error('Empty ExpenseCode!')
            return;
        }
        await TransactionDelete(autocode);
        setDataList(prev => prev.filter(item => item.autocode !== autocode)); // Refresh the data      
        setRefreshTotalCount(prev => !prev);
    };
    const handleDetailTransaction = async (data) => {
        sharedRef.current = [data];
        onDetail();
    }


    /*Datatable -- start*/
    const columns = [
        {
            name: "Date",
            selector: row => row.dateoftrans,
            cell: row => (
                <button style={{
                    color: "blue",
                    cursor: "pointer",
                    background: "none",  
                    border: "none",     
                    padding: 0,          
                    font: "inherit"     
                }}

                    className="detVal" onClick={() => handleDetailTransaction(row)} >
                    <span className="badge bg-primary">{row.dateoftrans}</span>
                </button>
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
                    <span className="badge bg-success w-45 text-center">Credit</span>
                ) : (
                    <span className="badge bg-danger w-45 text-center">Debit</span>
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
                <button
                    style={{
                        color: "red", 
                        cursor: "pointer",
                        background: "none",  
                        border: "none",      
                        padding: 0,          
                        font: "inherit"     
                    }}
                    onClick={() => handleDeleteTransaction(row.autocode)}
                    className="delval"
                    type="button"
                >


                    <i className="bi bi-trash"></i>
                </button>
            ),
        },
    ];
    return (<>

        <div className="card shadow p-1 mb-5 bg-white rounded">
            <DataTable
                columns={columns}
                data={datalist}
                pagination={true}
                highlightOnHover
                persistTableHead
                noHeader={true}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10, 15, 20]}
            />
        </div>
    </>

    )

}