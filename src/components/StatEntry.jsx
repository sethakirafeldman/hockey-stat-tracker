import React, {useState} from 'react';
import uuid from 'react-uuid';

//mui
import TextField from '@mui/material/TextField';
import  { DesktopDatePicker }  from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {Button} from "@mui/material";
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

//firebase
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../firebase";

export default function StatEntry( {activeUser, currentDate} ) {

const [goalValue, setGoalValue] = useState(0);
const [assistValue, setAssistValue] = useState(0);
const [dateValue, setDateValue] = useState(currentDate);
const [plusMinus, setPlusMinus] = useState(0);
const [leagueVal, setLeagueVal] = useState('');
const [open, setOpen] = useState(false);

// snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const [openSnack, setOpenSnack] = useState(false);

const handleSnack = () => {
  setOpenSnack(true);
};

const handleCloseSnack = (event, reason) => {
  
  if (reason === 'clickaway') {
    return;
  }

  setOpenSnack(false);
};  

// end of snackbar

// modal editor
const handleClickOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

const handleKey = {
  standard: (event) => {

    if (event.key === "e" || event.key === "-" || event.key === ".") {
        event.preventDefault();
    }
    else if (event.target.value.length >= 2) { 
      event.target.value = event.target.value.slice(0,-1);
    }
  },
  alternate: (event) => { // for +/- 
    if (event.key === "e" || event.key === "."){
      event.preventDefault();
    }
    else if (event.target.value.length >= 3) { // 3 because of the negative
      event.target.value = event.target.value.slice(0,-1);
    }
  }
};

const handleGoals = (event) => {
  setGoalValue(event.target.value); 
};

const handleAssists = (event) => {
  setAssistValue(event.target.value);
};

const handlePlusMinus = (event) => {
  setPlusMinus(event.target.value);
}

const handleLeague = (event) => { 
  setLeagueVal(event.target.value);
}

const handleDate = (date) => {
  let day = date.$D;
  let month = date.$M +1;
  let year = date.$y;

  if (date.$M < 10 && date.$D < 10 ) {
    month = `0${month}`;
    day = `0${day}`;
  }
  else if (date.$D < 10) {
    day = `0${day}`;
  }
  else if (date.$M < 10) {
    month = `0${month}`;
  }
  let YYYYMMDD = `${year}-${month}-${day}`;
  setDateValue(YYYYMMDD);
};

const handleSubmit = (event) => {
  event.preventDefault();
    (async () => {
      let uniqid = uuid();
      try {
        // adds new data to db.
        await setDoc(doc(db, "points-history", uniqid), {
          player_id: activeUser.player_id,
          name: activeUser.name,
          goals: parseInt(goalValue),
          assists: parseInt(assistValue),
          plusMinus: parseInt(plusMinus),
          league: leagueVal,
          date: dateValue,
          id: uniqid
        });
      }
      catch(err) {
        console.log(err)
      }
  
    })();
    handleSnack(); // this can be handled with state
    handleClose();
    // set state back to defaults
    setGoalValue(0);
    setAssistValue(0);
    setPlusMinus(0)
    setLeagueVal('');
    setDateValue(currentDate);  
};

    return (
      
        <>
        <Snackbar
          open={openSnack}
          autoHideDuration={3000}
          onClose={handleCloseSnack}
          anchorOrigin = {{ vertical: 'top', horizontal: 'right' }}
          >
          <Alert onClose={handleCloseSnack} severity="success" sx={{ width: 'fit-content' }}>
          Entry Successfully Added
          </Alert>
        </Snackbar>
    
        <Button variant="outlined" onClick={handleClickOpen}>
        Enter Stats
        </Button>
        <Dialog open = {open} onClose={handleClose}> 
        <DialogTitle>Enter Stats</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter your game stats here</DialogContentText>
        <Box
          onSubmit = {handleSubmit}
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          autoComplete="off"
        >
        <div className ="stat-fields">
        <TextField 
          inputProps={{
            step: 1,
            placeholder: 'Enter Goals',
            min: 0,
            max: 15,
            type: 'number'
          }}
          autoFocus = {true}
          id="outlined-basic" 
          label="Goals" 
          variant="outlined" 
          type = "number" 
          value = {goalValue}
          required
          onFocus = {(event) => event.target.select()}
          onKeyDown = {handleKey.standard}
          onChange = {handleGoals}
        />
        <TextField 
           inputProps={{
            step: 1,
            placeholder: 'Enter Assists',
            min: 0,
            max: 15,
            type: 'number'
          }}
          label="Assists" 
          variant="outlined" 
          type = "number" 
          required
          value = {assistValue}
          onFocus = {(event) => event.target.select()}
          onKeyDown = {handleKey.standard}
          onChange = {handleAssists} 
        />
      <TextField 
           inputProps={{
            step: 1,
            placeholder: 'Enter +/-',
            min: -15,
            max: 15,
            type: 'number'
          }}
          label="+/-" 
          variant="outlined" 
          type = "number"
          value = {plusMinus}
          onFocus = {(event) => event.target.select()}
          onKeyDown = {handleKey.alternate}
          onChange = {handlePlusMinus} 
        />
        <TextField
            sx = {{width: '100%', pb: 1}} 
            inputProps={{ maxLength: 12, placeholder: "ie. NHL" }}
            label="League" 
            variant="outlined" 
            type = "string" 
            name = "league"
            value = {leagueVal}
            onFocus = {(event) => event.target.select()}
            onChange = {handleLeague}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Date of Game"
          inputFormat="YYYY/MM/DD"
          value= {dateValue}
          onChange={(date) => {
            handleDate(date);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        </LocalizationProvider>
        <Button type = "submit" variant = "outlined">Submit Points</Button>
        </div>
        </Box>   
        </DialogContent>
        <DialogActions>
        </DialogActions>
        </Dialog>

        </>     

        )
}