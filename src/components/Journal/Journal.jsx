import React, {useState} from 'react';
import uuid from 'react-uuid';
import dayjs from 'dayjs';

import JournalDisplay from "./JournalDisplay";
import AlertSnack from ".././AlertSnack";

//mui
import Typography from '@mui/material/Typography';
// eslint-disable-next-line
import { Box, Paper, TextField, Button, InputLabel, MenuItem, FormControl  } from '@mui/material'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

//firebase
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

import {getCurrentDate} from '../../utils';

export default function Journal({ activeUser }) {
    // for modal 
    const [open, setOpen] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);

    // modal editor
    const handleClickOpen = () => {
        setOpen(true);
    };
  
    const handleClose = () => {
        setOpen(false);
    };


    const [journalValues, setJournalValues] = useState({
        preGame: 1,
        postGame: 1,
        textField: '',
        dateField: getCurrentDate(),
        entryId: '',
        player_id: activeUser.player_id        
    });

    const handleChange = (event) => {
        let getAtt = event.target.getAttribute("name");
        if (getAtt === "textField") {
            console.log('text')
            setJournalValues({
                ...journalValues,
                // [event.target.name]: event.target.value
                textField: event.target.value
            })
        }
    };

    // make into custom hook?
    const handleDate = (date) => {
        date = dayjs(date).format('YYYY-MM-DD');
        setJournalValues({
            ...journalValues,
            dateField: date
        })
    };

    const handleSubmit = (event) =>{
        event.preventDefault();
        (async () => {
            let journalId = uuid();
            const journalRef = doc(db, "journal", journalId);
            try {
                await setDoc(journalRef, {
                    preGame: journalValues.preGame,
                    postGame: journalValues.postGame,
                    textField: journalValues.textField,
                    dateField: journalValues.dateField,
                    entryId: journalId,
                    player_id: journalValues.player_id 
                });
            }
            catch(err) {
                console.log(err)
            }
            setJournalValues({
                preGame: 1,
                postGame: 1,
                textField: '',
                dateField: getCurrentDate(),
                entryId: '',
                player_id: activeUser.player_id     
            });
        })();
        handleClose();
        setOpenSnack(true);
    };

    return (
    <Box 
        sx ={{ display: "flex", flexDirection: "column", alignItems: "center", pb:20}}
        component="form"
        autoComplete="off"
    > 

    <AlertSnack 
        openSnack = {openSnack} 
        onClose = {()=> setOpenSnack(false)} 
        type = {"success"} 
        text = {"Journal entry added."} 
    />
    <Paper 
        elevation = {3} 
        square 
        sx = {{p:2, m:2, mt:2, mb:2, borderRadius: 1, borderColor:"primary.main", borderWidth: 2, width: "50%", margin: 'auto'}}
    >
        <Typography sx = {{m: 1}} variant="h4" gutterBottom>Journal</Typography>
        <Typography sx = {{m: 1, textAlign:"center", width: "60%", lineHeight: "1.5", mb: 2}} variant="p" gutterBottom>
            Hockey is as much a mental game as it is a physical one. Here, you may log how your game went. Something memorable happen?
            This is the place to put it to paper.
        </Typography>
        <Dialog open = {open} onClose={handleClose}> 
        <DialogTitle>Journal Entry</DialogTitle>
        <DialogContent sx = {{textAlign: 'center'}}>
          <DialogContentText>Enter Some Info About Your Game</DialogContentText>
        <Box sx={{ m: 1 }} >
            {/* <Typography>1-10 Rating for Pre and Post Game:</Typography> */}
            {/* <FormControl sx ={{mt: 2}}>
            <InputLabel sx = {{fontSize: ".75em"}} id="pregame-rating">Pre</InputLabel>
            <Select
                name = "preGame"
                sx = {{ m: 1}}
                labelId="pregame-rating"
                id="pre-rating-select"
                value = {journalValues.preGame}
                onChange = {handleChange}
                label="Pre">
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
            </Select>
            </FormControl>
            <FormControl  sx ={{mt:2}} >
            <InputLabel sx = {{fontSize: ".75em"}} id="postgame-rating">Post</InputLabel>    
            <Select
                name = "postGame"
                sx = {{m: 1}}
                labelId="postgame-rating"
                id="post-rating-select"
                value= {journalValues.postGame}
                onChange = {handleChange}
                label="Post">
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={2}>2</MenuItem>
                    <MenuItem value={3}>3</MenuItem>
                    <MenuItem value={4}>4</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={6}>6</MenuItem>
                    <MenuItem value={7}>7</MenuItem>
                    <MenuItem value={8}>8</MenuItem>
                    <MenuItem value={9}>9</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
            </Select>
            </FormControl> */}
        </Box>
        <TextField
            required
            name = "textField"
            value = {journalValues.textField}
            sx = {{width: '100%', margin: 'auto', mb: 2}}
            placeholder="Enter some notes about the game."
            multiline 
            rows={4}
            onChange = {handleChange}
        />
        <LocalizationProvider                 
        name = "dateField"
        dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                name = "dateField"
                label="Date"
                inputFormat="YYYY/MM/DD"
                value={journalValues.dateField}
                onChange={(date) => {
                    handleDate(date);
                }}
                renderInput={(params) => <TextField type = "date" name = "dateField" {...params} />}
            />
        </LocalizationProvider>
       
        </DialogContent>

        <Button onClick = {handleSubmit}>Submit</Button>
        <DialogActions>
        </DialogActions>
        </Dialog>
    </Paper>
    <Button variant="outlined" onClick={handleClickOpen}>
            Journal Entry
        </Button>
        <JournalDisplay activeUser = {activeUser} />
    </Box> 
    )
};