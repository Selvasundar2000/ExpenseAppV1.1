import React from "react";
import { supabase } from "../../supabaseClient";

export const TotCrDrCntFns = async (payload = {}) => {
      try {
        const { data, error1 } = await supabase.rpc("totaldebitcreditcount");  
        if (error1) {
          console.error("Error:", error1);
        } else {           
         return data;
        }
      } catch (error1) {
        console.error("Request failed:", error1);
      }    
};
