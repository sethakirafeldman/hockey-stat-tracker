import React, {useState} from 'react';
import uuid from 'react-uuid';
import dayjs from 'dayjs';

import JournalDisplay from "./JournalDisplay";
import AlertSnack from ".././AlertSnack";

//mui
import Typography from '@mui/material/Typography';
// eslint-disable-next-line
import { Box, Paper, TextField, Button, InputLabel, MenuItem, FormControl, Select  } from '@mui/material'; 
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// toggle buttons
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//icons
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

//firebase
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

import {getCurrentDate} from "../../utils";

export default function JournalEntry({ activeUser }) {
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
        preGame: 3,
        postGame: 3,
        leagueField: '',
        textField: '',
        dateField: getCurrentDate(),
        entryId: '',
        player_id: activeUser.player_id        
    });

    const handleChange = {

        league: (event) => {
            setJournalValues({
                ...journalValues,
                leagueField: event.target.value
            })
        },

        text: (event) => {
            setJournalValues({
                ...journalValues,
                textField: event.target.value
            });
        },
        date: (date) => {
            date = dayjs(date).format('YYYY-MM-DD');
            setJournalValues({
                ...journalValues,
                dateField: date
            })
        },

        preGame: (event, selected) => {
            setJournalValues({
                ...journalValues,
                preGame: selected
            })
        },
        postGame: (event, selected) => {
            setJournalValues({
                ...journalValues,
                postGame: selected
            })
        }
    }

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
                    leagueField: journalValues.leagueField,
                    dateField: journalValues.dateField,
                    entryId: journalId,
                    player_id: journalValues.player_id 
                });
            }
            catch(err) {
                console.log(err)
            }
            setJournalValues({
                preGame: 3,
                postGame: 3,
                textField: '',
                leagueField: '',
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
        className = {`fade-in`}
        sx ={{ display: "flex", flexDirection: "column", alignItems: "center", pb:20}}
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
        sx = {{p:2, m:2, mt:2, mb:2, textAlign:'center', borderRadius: 1, borderColor:"primary.main", borderWidth: 2, width: "50%", margin: 'auto'}}
    >
        <Typography sx = {{m: 1}} variant="h4" gutterBottom>Journal</Typography>
        <Typography sx = {{m: 1, textAlign:"left", width: "60%", lineHeight: "1.5", mb: 2}} variant="p" gutterBottom>
            Hockey is as much a mental game as it is a physical one. 
            Here, you may log how your game went. Something memorable happen?
            This is the place to put it to paper.
        </Typography>
        <Dialog open = {open} onClose={handleClose}> 
        <DialogTitle>Journal Entry</DialogTitle>
        <DialogContent sx = {{textAlign: 'center'}}>
          <DialogContentText>Game Info</DialogContentText>
        <Box sx={{ m: 1 }}> 
            <Typography>Rate your how you felt before and after your game.</Typography>
            <InputLabel sx = {{fontSize: ".75em", m:1}} id="pregame-rating">Before</InputLabel>
            <ToggleButtonGroup
                name= "preGame"
                sx ={{m:1}}
                size = "large"
                value={journalValues.preGame}
                exclusive
                onChange={handleChange.preGame}
                aria-label="pregame emotion"
            >
                <ToggleButton value ={1}><MoodBadIcon/></ToggleButton>
                <ToggleButton value ={2}><SentimentVeryDissatisfiedIcon/></ToggleButton>
                <ToggleButton value ={3}><SentimentDissatisfiedIcon/></ToggleButton>
                <ToggleButton value ={4}><SentimentSatisfiedIcon/></ToggleButton>
                <ToggleButton value ={5}><SentimentVerySatisfiedIcon/></ToggleButton>
            </ToggleButtonGroup>
            <InputLabel sx = {{fontSize: ".75em", m:1}} id="postgame-rating">After</InputLabel>
            <ToggleButtonGroup
                sx ={{m:1}}
                size = "large"
                name = "postGame"
                value={journalValues.postGame}
                exclusive
                onChange={handleChange.postGame}
                aria-label="postgame emotion"
            >
                <ToggleButton value ={1}><MoodBadIcon/></ToggleButton>
                <ToggleButton value ={2}><SentimentVeryDissatisfiedIcon/></ToggleButton>
                <ToggleButton value ={3}><SentimentDissatisfiedIcon/></ToggleButton>
                <ToggleButton value ={4}><SentimentSatisfiedIcon/></ToggleButton>
                <ToggleButton value ={5}><SentimentVerySatisfiedIcon/></ToggleButton>
            </ToggleButtonGroup>
        </Box>
        <InputLabel sx = {{fontSize: ".75em", m:1}} id="journal-leaguefield">League</InputLabel>
        <TextField
            required
            name = "leagueField"
            id = "journal-leaguefield"
            value = {journalValues.leagueField}
            sx = {{width: '25%', margin: 'auto', mb: 2}}
            placeholder="ie. NHL"
            onChange = {handleChange.league}
        />
        <InputLabel sx = {{fontSize: ".75em", m:1}} id="journal-textfield">Journal</InputLabel>
        <TextField
            required
            name = "textField"
            id = "journal-textfield"
            value = {journalValues.textField}
            sx = {{width: '100%', margin: 'auto', mb: 2}}
            placeholder="Enter some notes about the game."
            multiline 
            rows={4}
            onChange = {handleChange.text}
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
                    handleChange.date(date);
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
    <Button variant="outlined" onClick={handleClickOpen} sx ={{mb:2}}>
        Journal Entry
    </Button>
        <JournalDisplay activeUser = {activeUser} />
    </Box> 
    )
};