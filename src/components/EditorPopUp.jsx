import React, {useRef, useEffect} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { doc, setDoc, deleteDoc } from "firebase/firestore"; 
import { db } from "../firebase";

import {Button} from "@mui/material";
import TextField from '@mui/material/TextField';

export default function EditorPopUp(props) {

    const ref = useRef();
    const closeMenu = () => ref.current.close();

    useEffect( ()=>{
        props.pointsHistory.forEach((item) => {
            if (item.id === props.entryId) {
                setEditValues({
                    date: item.date,
                    goals: item.goals,
                    assists: item.assists,
                    entryId: item.id
                })
            }
        }) 
    },[]);
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
            entryId: props.entryId
        })        
    };

    const handleEditSubmit = (event) => {
        editStats(editValues.entryId);
        closeMenu();
    };

    const deleteItem = async (event) => {        
        await deleteDoc(doc(db, "points-history", props.entryId));
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
                    onChange = {handleEdit}
                />
                <Button onClick = {handleEditSubmit} type = "submit" variant = "outlined">Submit Change</Button>
                <Button type = "button" onClick = {deleteItem} >Delete Entry</Button>
            </span>
        </Popup>
    )
};