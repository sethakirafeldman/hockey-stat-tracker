import React from 'react';
import uuid from 'react-uuid';

import TextField from '@mui/material/TextField';
import  { DesktopDatePicker }  from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {Button, Grid, GridItem} from "@mui/material";
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'

import { doc, addDoc, collection } from "firebase/firestore"; 
import { db } from "../firebase";

export default function StatEntry(props) {

const dateToday = () => {
  let year = dayjs().year();
  let month = dayjs().month() + 1;
  let day = dayjs().date();
  
  if (month < 10 && day < 10 ) {
    month = `0${month}`;
    day = `0${day}`;
  }
  else if (day < 10) {
    day = `0${day}`;
  }
  else if (month < 10) {
    month = `0${month}`;
  }
  return `${year}-${month}-${day}`;
};  

const [goalValue, setGoalValue] = React.useState({});
const [assistValue, setAssistValue] = React.useState({});
const [dateValue, setDateValue] = React.useState(dateToday());

const addStats = async () =>  {
  await addDoc(collection(db, "points-history"), {
    // grab from state and props
    player_id: props.activeUser.player_id,
    name: props.activeUser.name,
    goals: Number(goalValue),
    assists: Number(assistValue),
    date: dateValue,
    id: uuid()
  });
};

const handleKey = (event) => {
  if (event.key == "e" || event.key == "-" || event. key == "."){
    event.preventDefault();
  }
}

const handleGoals = (event) => {
  // if (event.taget.value ==)
  setGoalValue(event.target.value);
};

const handleAssists = (event) => {
  setAssistValue(event.target.value);
};

const handleDate = (date) => {
  // need to grab current date(could be today)
  // date selector not working now. 
  setDateValue(date);
};

const handleSubmit = (event) => {
  // needs to handle goals, assists and date fields and store in state.
  event.preventDefault();
  addStats();
}

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
        <div>
        <TextField 
          defaultValue="Hello World"
          inputProps={{
            step: 1,
            placeholder: 0,
            min: 0,
            max: 15,
            type: 'number'
          }}
          id="outlined-basic" 
          label="Goals" 
          variant="outlined" 
          type = "number" 
          onKeyDown = {handleKey}
          onChange = {handleGoals}
        />
        <TextField 
           inputProps={{
            step: 1,
            placeholder: 0,
            min: 0,
            max: 15,
            type: 'number'
          }}
          label="Assists" 
          variant="outlined" 
          type = "number" 
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