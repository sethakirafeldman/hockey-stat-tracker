import React, {useRef, useEffect} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import { doc, setDoc, deleteDoc } from "firebase/firestore"; 
import { db } from "../firebase";

//mui
import {Button} from "@mui/material";
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Tooltip from '@mui/material/Tooltip';

export default function EditorPopUp(props) {

    const ref = useRef();
    const closeMenu = () => ref.current.close();

    useEffect( () => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // uses empty string as this is required for rendering as value in Textfields
    // may be better to set to current values pre edit.
    const [editValues, setEditValues] = React.useState({
        date: '',
        goals: '',
        assists: '',
        entryId: ''        
    });


    const handleEdit = (event) => {
        setEditValues( {
            ...editValues,
            [event.target.name]: event.target.value,
            entryId: props.entryId
        })        
    };

    const handleEditSubmit = (event) => {
        (async () => {
            const statRef = doc(db, "points-history", editValues.entryId);
            await setDoc(statRef, {
                date: editValues.date,
                goals: editValues.goals,
                assists: editValues.assists
            }, {merge: true})
        })();
        closeMenu();
        // add some kind of effect here.
    };

    const deleteItem = async (event) => {        
        await deleteDoc(doc(db, "points-history", props.entryId));
    };

    return( 
        <Popup
            ref = {ref}
            trigger={open => (
                <EditIcon sx ={{"&:hover":{color:"#1989fa"}}}></EditIcon>
                // <Button className="button">Edit</Button>
            )}
            position="left center"
            closeOnDocumentClick
            closeOnEscape
            >
            <span> 
                <TextField 
                    sx = {{width: '100%', pb: 1, mt: 1 }}
                    label ="Date"
                    variant = "outlined"
                    name = "date"
                    type = "date"
                    value = {editValues.date}
                    onChange = {handleEdit}
                    
                />
                <TextField
                    sx = {{width: '50%', pb: 1}} 
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
                    sx = {{width:'50%', pb: 1}} 
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
                <Tooltip title = "Submit Change">
                    <Button onClick = {handleEditSubmit} type = "submit" variant = "outlined" sx = {{width: '50%'}}><CheckIcon/></Button>
                </Tooltip>
                <Tooltip title = "Delete Permanently">
                    <Button variant = "outlined" type = "button" onClick = {deleteItem} sx = {{color:'red', width: '50%'}} ><DeleteForeverIcon/></Button>
                </Tooltip>
            </span>
        </Popup>
    )
};