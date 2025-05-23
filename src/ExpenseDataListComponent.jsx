import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import DataTable from 'datatables.net-react';
import DT1 from 'datatables.net-bs5';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';

DataTable.use(DT);

function ExpenseDataListComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.rpc("expensedatalist");

        if (error) {
          console.error("Error:", error);
        } else {
          console.log("Data received:", data);  // Log data
          setData(data || []);  // Ensure data is set correctly
        }
      } catch (error) {
        console.error("Request failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Expense Data</h1>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <DataTable
          data={data}
          columns={[
            { title: "Amount", data: "amount" },
            { title: "Transaction", data: "transname" },
            { title: "Expense", data: "expensename" },
            { title: "Date", data: "dateoftrans" },
          ]}
          className="table table-striped table-bordered"
          options={{
            paging: true,
            responsive: true,
            searching: true,
            order: [[0, "desc"]], // Sort by date
          }}
        />

      )}


    </div>
  );
}

export default ExpenseDataListComponent;
