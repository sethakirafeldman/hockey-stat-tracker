import React, {useRef, useEffect} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { doc, setDoc, deleteDoc } from "firebase/firestore"; 
import { db } from "../firebase";

import {Button} from "@mui/material";
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function SharpEditor(props) {
    // console.log(props.cutHistory);

    const ref = useRef();
    const closeMenu = () => ref.current.close();

    // uses empty string as this is required for rendering as value in Textfields
    // trying to pull in prev vals from props.

    useEffect( ()=>{

    },[]);

    const [editValues, setEditValues] = React.useState({
        date: '',
        cut: '',
        notes: '',
        entryId: ''        
    });

    // takes entryId passed in from props after submit clicked
    const editCuts = async (entry) => {
        const cutRef = doc(db, "sharpens", entry);
        console.log(editValues);
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
            entryId: props.entryId
        })        
    };

    const handleEditSubmit = (event) => {
        console.log(editValues.cut)
        editCuts(editValues.entryId);
        closeMenu();
    };

    const deleteItem = async (event) => {        
        await deleteDoc(doc(db, "sharpens", props.entryId));
    };

    return (
    
    <Popup
    ref = {ref}
    trigger={open => (
        <Button className="button">Edit</Button>
    )}
    position="left"
    nested
    // closeOnDocumentClick
    // closeOnEscape
    >
    <span> 
        <TextField 
            label ="Date"
            variant = "outlined"
            name = "date"
            type = "date"
            value = {editValues.date}
            onChange = {handleEdit}
        />
        <Select
            name = "cut"
            labelId="cut selector edit"
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
        <TextField 
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
        <Button onClick = {handleEditSubmit} type = "submit" variant = "outlined">Submit Change</Button>
        <Button type = "button" onClick = {deleteItem} >Delete Entry</Button>
    </span>
</Popup>
)
}