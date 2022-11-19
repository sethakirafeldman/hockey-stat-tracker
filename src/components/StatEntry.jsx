import React, {useState} from 'react';
import uuid from 'react-uuid';

import TextField from '@mui/material/TextField';
import  { DesktopDatePicker }  from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {Button} from "@mui/material";
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../firebase";

export default function StatEntry( {activeUser, currentDate} ) {

const [goalValue, setGoalValue] = useState('');
const [assistValue, setAssistValue] = useState('');
const [dateValue, setDateValue] = useState(currentDate);

const handleKey = (event) => {
  if (event.key === "e" || event.key === "-" || event.key === "."){
    event.preventDefault();
  }
}

const handleGoals = (event) => {
    setGoalValue(event.target.value);
};

const handleAssists = (event) => {
  setAssistValue(event.target.value);
};

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
  if (assistValue || goalValue) {
    (async () => {
      let uniqid = uuid();
      try {
        // adds new data to db.
        await setDoc(doc(db, "points-history", uniqid), {
          player_id: activeUser.player_id,
          name: activeUser.name,
          goals: parseInt(goalValue),
          assists: parseInt(assistValue),
          date: dateValue,
          id: uniqid
        });
      }
      catch(err) {
        console.log(err)
      }
  
    })();
    // set state back to defaults
    setGoalValue('');
    setAssistValue('');
    setDateValue(currentDate);
  }

  else {
    console.log('error')
    // ideally this would cause red validation errors on form.
  }

};

    return (
        <>
        <h3>Enter stats</h3>
        <Box
          onSubmit = {handleSubmit}
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
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
          id="outlined-basic" 
          label="Goals" 
          variant="outlined" 
          type = "number" 
          value = {goalValue}
          required
          onKeyDown = {handleKey}
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
          onKeyDown = {handleKey}
          onChange = {handleAssists} 
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
        </>     
        )
}