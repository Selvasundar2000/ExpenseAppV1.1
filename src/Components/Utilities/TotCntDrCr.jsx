import { supabase } from '../../supabaseClient'
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import DataTable from "react-data-table-component";
import { currencyFormat } from '../currencyFormat';

export default function TotalCntDrCr({ refresh }) {

    const [datalist, setDataList] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            const { data: datalist, error: error1 } = await supabase.rpc("totaldebitcreditcount");

            if (error1) {
                console.error("Error:", error1);
            } else {

                setDataList(datalist || []);  // Ensure data is set correctl                
            }
        } catch (error1) {
            console.error("Request failed:", error1);
        } finally {
            setLoading(false);
        }
    };
    const debouncedFetchData = useCallback(debounce(fetchData, 300), []);
    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (refresh !== undefined) {
            debouncedFetchData();
        }
    }, [refresh, debouncedFetchData]);


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

            {/* {datalist.length === 0 ? (<p>Data is Empty</p>) : (<>
                Total Credit:{datalist[0].total_credit} <br />
                Total Debit: {datalist[0].total_debit}<br />
                Total Transaction Amount:  {datalist[0].total_transamount}
            </>)} */}
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

