import { AppBar,Typography,Toolbar } from "@mui/material";
export default function Header(){

return(<>
 <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div">
              Project untitled
            </Typography>
          </Toolbar>
        </AppBar>
</>);
}