import React, {useState, useEffect} from 'react';
import dayjs from 'dayjs';

import {convertToEmoticons} from "../../utils";

//mui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import InputLabel from '@mui/material/InputLabel';

// icons
import DoneIcon from '@mui/icons-material/Done';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PreviewIcon from '@mui/icons-material/Preview';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

// mui date picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

// toggle buttons
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

//firebase
import { db } from "../../firebase";
import { setDoc, doc, deleteDoc } from 'firebase/firestore';

export default function JournalEditor ({activeUser, journalHistory, entryId}) {
    const [editText, setEditText] = useState(false);

    // dialog
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [currentDisplay, setCurrentDisplay] = useState({
        entryId: "",
        dateField: "",
        preGame: "",
        postGame: "",
        textField: "",
        player_id: activeUser.player_id
    });

    const trimExcess = (str) => {
        str = str.replace(/\s+/g, ' ').trim()
        return str;
    };

    useEffect(() =>{
        journalHistory.forEach((item)=> {
            if (item.entryId === entryId) {
                setCurrentDisplay({
                    entryId: entryId,
                    dateField: item.dateField,
                    preGame: item.preGame,
                    postGame: item.postGame,
                    leagueField: item.leagueField,
                    textField: item.textField,
                    player_id: activeUser.player_id
                })
            }
        })
    }, [entryId, activeUser, journalHistory]);

    const showEditor = () => {
        handleOpen()
    }

    const handleChange = {
        text: (event) => {
            setCurrentDisplay({
                ...currentDisplay,
                textField: event.target.value
            })
        },
        date: (date) => {
            date = dayjs(date).format('YYYY-MM-DD');
            setCurrentDisplay({
                ...currentDisplay,
                dateField: date
            })
        },

        league: (event) => {
            setCurrentDisplay({
                ...currentDisplay,
                leagueField: event.target.value
            })
        },

        preGame: (event, selected) => {
            setCurrentDisplay({
                ...currentDisplay,
                preGame: selected
            })
        },

        postGame: (event, selected) => {
            setCurrentDisplay({
                ...currentDisplay,
                postGame: selected
            })
        }
    };

    const handleDelete = async () => {
        try {  
            await deleteDoc(doc(db, "journal", currentDisplay.entryId)); 
        }
        catch {

        }
        handleClose();
    }

    const handleEdit = () => {
        setEditText(true);
    }

    const handleSave = () =>{
        ( async () => {
            const journalRef = doc(db, "journal", currentDisplay.entryId);

            await setDoc(journalRef, {
                entryId: currentDisplay.entryId,
                player_id: activeUser.player_id,
                preGame: currentDisplay.preGame,
                postGame: currentDisplay.postGame,
                leagueField: currentDisplay.leagueField,
                textField: currentDisplay.textField,
                dateField: currentDisplay.dateField,
            }, {merge: true})
         })();
         setEditText(false);
    }

    return (
        <>
            <PreviewIcon
                onClick = {showEditor}
            />
            <Dialog
                fullWidth
                sx ={{ margin: "auto"}}
                open={open}
                onClose={handleClose}
            >
            {!editText ?
            <DialogTitle sx ={{margin: 2}}>{`Entry | ${currentDisplay.dateField}`}</DialogTitle>
            :
            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                name = "dateField"
                label="Change Date"
                inputFormat="YYYY/MM/DD"
                value = {currentDisplay.dateField}
                onChange={handleChange.date}
                renderInput={(params) => <TextField sx ={{width: "10em", margin: 2}}{...params} />}
            />
            </LocalizationProvider>

            }

            <Paper elevation={3} sx = {{padding: 4}} >
            { !editText ?
            <Box sx ={{display:'flex', flexDirection: 'column', alignItems:'center', justifyContent:'center'}}>
            <Typography sx={{fontSize: ".75em", textAlign:'center', margin: 1}}> 
                Before:
            </Typography>
            {convertToEmoticons(currentDisplay.preGame)}
            <Typography sx={{fontSize: ".75em", textAlign:'center', margin: 1}}> 
                After:
            </Typography>
            {convertToEmoticons(currentDisplay.postGame)}
            <Typography sx={{fontSize: ".75em", textAlign:'center', margin: 1}}> 
                League
            </Typography>
            <Typography sx = {{padding: 2}}>{currentDisplay.leagueField}</Typography> 
            <Typography sx={{fontSize: ".75em", textAlign:'center', margin: 1}}> Journal</Typography>
            <Typography sx = {{padding: 2}}>{currentDisplay.textField}</Typography>  
            </Box>
            :
            <>
         
            <Box sx ={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            {/* <Typography sx ={{margin:'auto', padding: 1}}>Edit Entry</Typography> */}
            <InputLabel sx = {{fontSize: ".75em"}} id="pregame-edit">Before</InputLabel>
            <ToggleButtonGroup
                sx ={{m:1}}
                size = "medium"
                name = "preGame"
                value={currentDisplay.preGame}
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
        
            <InputLabel sx = {{fontSize: ".75em"}} id="postgame-edit">After</InputLabel>
            <ToggleButtonGroup
                sx = {{m:1}}
                size = "medium"
                name = "postGame"
                value={currentDisplay.postGame}
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
            
            <InputLabel sx = {{fontSize: ".75em"}} id="league-edit">League</InputLabel>
            <TextField 
                sx ={{width: '4.5em', margin:1}}
                name = "leagueField"
                id = "league-edit"
                onChange = {handleChange.league} 
                variant="outlined" 
                value = {currentDisplay.leagueField}
            />
            <InputLabel sx = {{fontSize: ".75em"}} id="text-edit">Journal</InputLabel>
            <TextField 
                sx ={{margin:1}}
                name = "textField"
                id = "text-edit"
                onChange = {handleChange.text} 
                fullWidth multiline 
                variant="outlined" 
                value = {trimExcess(currentDisplay.textField)}
            />
            </Box>
              </>  
            }   
            </Paper>    
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }} > 
                <CloseIcon />
            </IconButton>
            <Box sx ={{display: 'flex', justifyContent:'space-between', padding: 1}}>
                <Tooltip title = "delete forever">
                <DeleteForeverIcon sx= {{m: 1, color:'red'}} onClick = {handleDelete}></DeleteForeverIcon>
                </Tooltip>
                {!editText ?
                    <Tooltip title = "edit entry">
                    <EditIcon onClick = {handleEdit} sx ={{"&:hover":{color:"#1989fa"}, m:1}}></EditIcon>
                    </Tooltip>
                    :
                    <Tooltip title ="save">
                    <DoneIcon onClick = {handleSave} sx ={{"&:hover":{color:"#1989fa"}, color: "black", m:1}}></DoneIcon>
                    </Tooltip>
                }
            </Box>
            </Dialog>
        </>
    )
}