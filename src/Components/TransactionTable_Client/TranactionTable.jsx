import DataTable from "react-data-table-component";
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TransactionList, TransactionDelete, totalexpensecount } from "../../services/DBconfunc";
import sharedRef from "../../lib/sharedRef";

export default function TransactionTable({ RefreshTransTbl, onDetail,setRefreshTotalCount }) {
    const [datalist, setDataList] = useState('');
    const fetchData = async () => {
        const data = await TransactionList();
        setDataList(data);
    };
    useEffect(() => {
        fetchData();
    }, [RefreshTransTbl]);
    const handleDeleteTransaction = async (autocode) => {
        if (!autocode) {
            toast.error('Empty ExpenseCode!')
            return;
        }
        await TransactionDelete(autocode);
        setDataList(prev => prev.filter(item => item.autocode !== autocode)); // Refresh the data      
       setRefreshTotalCount(prev=>!prev);
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

    return (<>
        {datalist.length === 0 ? (
            <p>No data available.</p>
        ) : (<>

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
        )}
    </>
    )

}