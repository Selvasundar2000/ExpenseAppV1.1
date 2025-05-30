import { supabase } from '../../supabaseClient'
import { useState, useEffect } from 'react';
import { TotCrDrCntFns } from './TotCrDrCntFns';

export default function TotalCntDrCr() {

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
    useEffect(() => {
        fetchData();
    }, [])
    return (
        <>
            {datalist.length === 0 ? (<p>Data is Empty</p>) : (<> 
            Total Credit:{datalist[0].total_credit} <br/>
            Total Debit: {datalist[0].total_debit}<br/>
            Total Transaction Amount:  {datalist[0].total_transamount}
            </>)}
        </>
    )
}

