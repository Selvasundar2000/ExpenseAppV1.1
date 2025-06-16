import React,{useState} from "react";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from "@mui/material";
import Fab from "@mui/material/Fab";

export default function FloatFilterBtn() {
     const [fabopen, setfabOpen] = useState(false);
    
      const handleToggle = () => setfabOpen(prev => !prev);  


    return (<>
        <Fab
            onClick={handleToggle}
            aria-label="Filter"
            style={{
                position: 'fixed',
                bottom: '50px',
                right: '20px',
                color: "white",
                backgroundColor: "grey"
            }}
        ><div style={{ fontSize: 35 }} > <i className="bi bi-funnel" style={{ fontSize: 25, }}></i></div>
        </Fab>

        <Box sx={{ position: 'fixed', bottom: 50, right: 90 }}>
            {fabopen && (
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, mb: 1, justifyContent: 'flex-end' }}>
                    <Fab size="small" sx={{ backgroundColor: '#fff' }} aria-label="add-user">
                        <i className="bi bi-person-plus" style={{ fontSize: 18 }}></i>
                    </Fab>
                    <Fab size="small" sx={{ backgroundColor: '#fff' }} aria-label="add-doc">
                        <i className="bi bi-calendar-date" style={{ fontSize: 18 }}></i>
                    </Fab>
                    <Fab size="small" sx={{ backgroundColor: '#fff' }} aria-label="upload">
                        <i className="bi bi-upload" style={{ fontSize: 18 }}></i>
                    </Fab>
                </Box>
            )}
        </Box>
    </>

    )
}