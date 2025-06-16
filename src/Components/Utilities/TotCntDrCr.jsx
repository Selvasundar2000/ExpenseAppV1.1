import { supabase } from '/ExpenseApp/expenseapp/src/DBAccess/supabaseClient'
import { useState, useEffect, useCallback } from 'react';
import DataTable from "react-data-table-component";
import { currencyFormat } from '../currencyFormat';
import { totalexpensecount } from '../../DBAccess/DBconfunc';

export default function TotalCntDrCr({Refreshdata}) {
    const [datalist, setDataList] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        const datal = await totalexpensecount();
        setDataList(datal)
    };
    useEffect(() => {
        fetchData();
    }, [])


    const columns = [
        {
            name: "Total Credit",
            selector: row => <span style={{ color: 'green', fontWeight: 'bold' }}> ₹&nbsp;{currencyFormat(row.total_credit)}</span>,
            sortable: false,
        },
        {
            name: "Total Debit",
            selector: row => <span style={{ color: 'red', fontWeight: 'bold' }}> ₹&nbsp;{currencyFormat(row.total_debit)}</span>,
            sortable: false,
        },
        {
            name: "Total Transaction",
            selector: row => <span style={{ color: 'black', fontWeight: 'bold' }}> ₹&nbsp;{currencyFormat(row.total_transamount)}</span>,
            sortable: false,
        }
    ];

    return (
        <>

            <div className="card shadow p-1 mb-1 bg-white rounded">

                <DataTable
                    columns={columns}
                    data={datalist}
                    pagination={false}
                    highlightOnHover
                    persistTableHead
                    noHeader={true}
                />
               
            </div>

        </>
    )
}

