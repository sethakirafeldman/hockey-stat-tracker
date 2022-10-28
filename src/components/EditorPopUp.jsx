import React, {useRef} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { doc, addDoc, collection, setDoc } from "firebase/firestore"; 
import { db } from "../firebase";

import {Button} from "@mui/material";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function EditorPopUp(props) {

    const ref = useRef();
    const closeMenu = () => ref.current.close();

    // uses empty string as this is required for rendering as value in Textfields
    // may be better to set to current values pre edit.
    const [editValues, setEditValues] = React.useState({
        date: '',
        goals: '',
        assists: '',
        entryId: ''        
    });

    const editStats = async (entry) => {
        const statRef = doc(db, "points-history", entry);
        await setDoc(statRef, {
            date: editValues.date,
            goals: editValues.goals,
            assists: editValues.assists
        }, {merge: true})
    };

    const handleEdit = (event) => {
        setEditValues( {
            ...editValues,
            [event.target.name]: event.target.value,
            entryId: props.rowId
        })        
    };

    const handleEditSubmit = (event) => {
        editStats(editValues.entryId);
        closeMenu();
        // props.getPlayerHistory();
        // not the best way to do this, but it works. 
        // window.location.reload(true);
    };


    return( 
    <Popup
        ref = {ref}
        trigger={open => (
            <Button className="button">Edit</Button>
        )}
        position="left center"
        closeOnDocumentClick
        closeOnEscape
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
             <TextField 
                inputProps={{
                    step: 1,
                    placeholder: 0,
                    min: 0,
                    max: 15,
                    type: 'number'
                }}
                label="Goals" 
                variant="outlined" 
                type = "number" 
                name = "goals"
                value = {editValues.goals}
                required
                onChange = {handleEdit}
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
                name = "assists"
                value = {editValues.assists}
                required
                onChange = {handleEdit}
             />
             <Button onClick = {handleEditSubmit} type = "submit" variant = "outlined">Submit Change</Button>
             <Button type = "button">Delete Entry</Button>
        </span>
    </Popup>
    )
};