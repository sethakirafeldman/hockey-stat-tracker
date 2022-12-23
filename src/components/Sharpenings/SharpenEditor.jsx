import React, {useRef, useEffect, useState} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { doc, setDoc, deleteDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

//mui
import {Button} from "@mui/material";
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Tooltip from '@mui/material/Tooltip';
import FormControl from '@mui/material/FormControl';
import { InputLabel } from '@mui/material';

export default function SharpenEditor( {entryId, cutHistory} ) {
  
    const ref = useRef();
    const closeMenu = () => ref.current.close();

    // uses empty string as this is required for rendering as value in Textfields
    useEffect( () => {
        cutHistory.forEach((item) => {
            if (item.id === entryId) {
                setEditValues({
                    date: item.date,
                    cut: item.cut,
                    notes: item.notes,
                    entryId: item.id
                })
            }
        }) 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [editValues, setEditValues] = useState({
        date: '',
        cut: '',
        notes: '',
        entryId: ''        
    });

    // takes entryId passed in from props after submit clicked
    const editCuts = async (entry) => {
        const cutRef = doc(db, "sharpens", entry);
        await setDoc(cutRef, {
            date: editValues.date,
            cut: editValues.cut,
            notes: editValues.notes
        }, {merge: true})
    };

    // as values change in editor, updates editValues
    const handleEdit = (event) => {
        setEditValues( {
            ...editValues,
            [event.target.name]: event.target.value,
            entryId: entryId
        })        
    };

    const handleEditSubmit = (event) => {
        editCuts(editValues.entryId);
        closeMenu();
    };

    const deleteItem = async (event) => {        
        await deleteDoc(doc(db, "sharpens", entryId));
    };

    return (
    
    <Popup
    ref = {ref}
    trigger={open => (
        <EditIcon sx ={{"&:hover":{color:"#1989fa"}}}></EditIcon>
    )}
    position="left"
    nested
    // closeOnDocumentClick
    // closeOnEscape
    >
    <span> 
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel 
            id="cut-selector-edit">Cut</InputLabel>
        <Select
            sx = {{width: '75%', pb: 1, mt: 1}}
            name = "cut"
            labelId="cut-selector-edit"
            label = "Cut"
            onChange = {handleEdit}
            value = {editValues.cut}
        >
            <MenuItem value = {'1'}>1"</MenuItem>
            <MenuItem value = {'3/4'}>3/4"</MenuItem>
            <MenuItem value = {'5/8'}>5/8"</MenuItem>
            <MenuItem value = {'1/2'}>1/2"</MenuItem>
            <MenuItem value = {'3/8'}>3/8"</MenuItem>
        </Select>
        </FormControl>
        <TextField
            sx = {{width: '100%', pb: 1}} 
            inputProps={{
                min: 0,
                max: 280,
                type: 'string'
            }}
            label="Notes" 
            variant="outlined" 
            type = "number" 
            name = "notes"
            multiline
            value = {editValues.notes}
            onChange = {handleEdit}
        />
        <TextField 
            sx = {{width: '100%', pb: 1}}
            label ="Date"
            variant = "outlined"
            name = "date"
            type = "date"
            value = {editValues.date}
            onChange = {handleEdit}
        />
        <Tooltip title = 'Submit Change'>
        <Button sx = {{width: '50%'}} onClick = {handleEditSubmit} type = "submit" variant = "outlined"><CheckIcon/></Button>
        </Tooltip>
        <Tooltip title = 'Delete Permanently'>
        <Button sx = {{color:'red', width: '50%'}} variant = "outlined" type = "button" onClick = {deleteItem}><DeleteForeverIcon/></Button>
        </Tooltip>
    </span>
</Popup>
)
}