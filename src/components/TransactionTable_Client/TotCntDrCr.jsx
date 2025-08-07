import { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import { currencyFormat } from '../../lib/currencyFormat';
import { totalexpensecount } from '../../services/DBconfunc';

export default function TotalCntDrCr({RefreshTotTbl,RefreshTotalCount,FilterCountUpdate}) {
    const [datalist, setDataList] = useState([]);


    const fetchData = async () => {
        const datal = await totalexpensecount();
        setDataList(datal)
    };
    useEffect(() => {
        if (FilterCountUpdate === '') {
            fetchData();
        } else {
            setDataList(FilterCountUpdate);
        }   
    }, [RefreshTotTbl,RefreshTotalCount,FilterCountUpdate])


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
                    highlightOnHover
                    persistTableHead
                    noHeader={true}                   
                />               
            </div>

        </>
    )
}

