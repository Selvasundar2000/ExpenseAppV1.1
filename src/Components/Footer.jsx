import React from "react";
import { Box } from "@mui/material";
import {Typography} from "@mui/material";
export default function Footer(){
    return(<>
      <Box textAlign="center" pt={5}>
              <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} Selva Sundar Pvt Ltd. All rights reserved.
              </Typography>
            </Box>
    </>)
}