import React from 'react';

import TextField from '@mui/material/TextField';
import  {DesktopDatePicker}  from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {Button, Grid, GridItem} from "@mui/material";
import Box from '@mui/material/Box';


export default function StatEntry() {

const [dateValue, setDateValue] = React.useState();

  const handleChange = (newValue) => {
    setDateValue(newValue);
  };

console.log(dateValue);

    return (
        <>
        <h3>Enter stats</h3>
        <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
        >
        <div>
        <TextField id="outlined-basic" label="Goals" variant="outlined" type = "number" />
        <TextField id="outlined-basic" label="Assists" variant="outlined" type = "number" />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Date of Game"
          inputFormat="MM/DD/YYYY"
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
        </LocalizationProvider>
        <Button type = "submit" variant = "outlined">Submit Points</Button>
        </div>
        </Box>   
        </>     
        )
}