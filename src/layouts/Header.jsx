import { AppBar, Typography, Grid } from "@mui/material";
export default function Header() {

  return (<>
    <AppBar position="static">
      <Typography variant="body2" component="div">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            Project Untitled
          </Grid>
        </Grid>
      </Typography>
    </AppBar>  

  </>);
}