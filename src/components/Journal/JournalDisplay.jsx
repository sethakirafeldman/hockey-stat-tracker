import React, {useEffect, useState} from 'react';
import AlertSnack from ".././AlertSnack";

// mui
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import TextField from "@mui/material/TextField";
import DoneIcon from '@mui/icons-material/Done';
import Tooltip from '@mui/material/Tooltip';

// mui date picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

//firebase
import { db } from "../../firebase";
import { collection, onSnapshot, query, where, setDoc, doc, deleteDoc } from 'firebase/firestore';

export default function JournalDisplay ({activeUser}) {

    const [journalHistory, setJournalHistory] = useState([]);
    const [currentStory, setCurrentStory] = useState({
        entryId: "",
        dateField: "",
        textField: "",
        player_id: activeUser.player_id
    });

    const [editText, setEditText] = useState(false);
    const [editSuccess, setEditSuccess] = useState(false);
    const [warnDelete, setWarnDelete] = useState(false);

    // dialog
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleClickText = (event) => {
        setCurrentStory({
            ...currentStory,
            entryId: event.target.getAttribute("name"),
            dateField: event.target.getAttribute("date"),
            textField: event.target.innerText,
        });
        handleOpen();
    }

    const handleEdit = () => {
        setEditText(true);
    };

    const handleChange = (event) => {
        setCurrentStory({
            ...currentStory,
            [event.target.name]: event.target.value
        });

    };
    
    const handleSave = () => {
         ( async () => {
            const journalRef = doc(db, "journal", currentStory.entryId);

            await setDoc(journalRef, {
                entryId: currentStory.entryId,
                player_id: activeUser.player_id,
                textField: currentStory.textField,
                dateField: currentStory.dateField,
            }, {merge: true})
         })();
         setEditText(false);
    };

    const handleDelete = async () => {
        try {  
            await deleteDoc(doc(db, "journal", currentStory.entryId)); 
        }
        catch {

        }
        handleClose();
    }

    useEffect(() =>{
        try {
            const dbQuery = query(collection(db, "journal"), where ("player_id", "==", activeUser.player_id));
            const unsubscribe = onSnapshot(dbQuery, (querySnapshot) => {
                const journalArr = [];

                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "modified") {
                        setEditSuccess(true);
                    }
    
                    else if (change.type === "removed") {
                        setWarnDelete(true);
                    }
                  });
                querySnapshot.forEach((doc) => {
                    journalArr.push(doc.data());
                });
                journalArr.sort((a, b) => {
                    return new Date(b.dateField) - new Date(a.dateField);
                });
                setJournalHistory(journalArr);
            });

            return () => {
                unsubscribe();
            }

        }
        catch {

        }
    }, [activeUser]);
    
    return (
    <>
    <AlertSnack 
        openSnack = {editSuccess} 
        onClose = {()=> setEditSuccess(false)} 
        type = {"success"} 
        text = {"Successfully saved."} 
    />

    <AlertSnack 
        openSnack = {warnDelete} 
        onClose = {()=> setWarnDelete(false)} 
        type = {"success"} 
        text = {"Entry deleted."} 
    />
     <TableContainer sx = {{ margin: 2, width: '50vw', bgcolor: 'primary.light', color: 'text.primary'}}>
        <Table>
        <TableHead>
        <TableRow>
         <TableCell sx = {{color:'white', padding: 1}} align="left">Date</TableCell>
         <TableCell sx = {{color:'white', padding: 1}} align="left">Journal Entry</TableCell>
        </TableRow>
            <Dialog
                fullWidth
                sx ={{ margin: "auto"}}
                open={open}
                onClose={handleClose}
            >

            {!editText ?
            <DialogTitle sx ={{margin: 2}}>{`Entry | ${currentStory.dateField}`}</DialogTitle>
            :

            <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDatePicker
                name = "dateField"
                label="Change Date"
                inputFormat="YYYY/MM/DD"
                value = {currentStory.dateField}
                onChange={handleChange}
                renderInput={(params) => <TextField sx ={{width: "10em", margin: 2}}{...params} />}
                
            />
            </LocalizationProvider>

            }

            <Paper elevation={3} sx = {{padding: 4}} >
            { !editText ? 
            <Typography sx = {{padding: 2}}>{currentStory.textField}</Typography>  
            :
            
            <TextField 
                name = "textField"
                onChange = {handleChange} 
                fullWidth multiline 
                variant="outlined" 
                value = {currentStory.textField}/>
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
            <Box sx ={{display: 'flex', justifyContent:'space-between',padding: 1}}>
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
       
        {journalHistory ? journalHistory.map((row) => (
            <TableRow
                name = {row.entryId}
                key = {row.entryId}
                sx={{ '&:last-child td, &:last-child th': {border: 0} }}
            >
                <TableCell 
                name = {row.dateField} 
                sx = {{bgcolor: "white", padding: 1}} 
                component="th" 
                scope="row">
                {row.dateField}
                </TableCell>
                <Tooltip title="click to view/edit">
                <TableCell 
                    date = {row.dateField} 
                    name = {row.entryId} 
                    onClick = {handleClickText} 
                    sx = {{textAlign: "left", cursor: "pointer", maxWidth: "10vw", bgcolor: "white", padding: 1, whiteSpace: "nowrap", textOverflow:"ellipsis", overflow: 'hidden' }} 
                    align="center">
                    {row.textField}
                </TableCell>
                </Tooltip>
            </TableRow>
        ))
        :
        null
        }
        </TableHead>
        </Table>
     </TableContainer>
     </>
    )
}