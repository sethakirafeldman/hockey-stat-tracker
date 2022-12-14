import React, {useRef, useEffect, useState} from 'react';
import Popup from 'reactjs-popup';
import DeleteConfirmation from '../General/DeleteConfirmation';

import 'reactjs-popup/dist/index.css';

import { doc, setDoc } from "firebase/firestore"; 
import { db } from "../../firebase";

//mui
import {Button} from "@mui/material";
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Tooltip from '@mui/material/Tooltip';

export default function StatEditor({entryId, pointsHistory}) {

    const [showConfirmation,setShowConfirmation ] = useState(false);

    const ref = useRef();
    const closeMenu = () => ref.current.close();

    // uses empty string as this is required for rendering as value in Textfields
    const [editValues, setEditValues] = useState({
        date: '',
        goals: '',
        assists: '',
        league: '',
        plusMinus: '',
        entryId: ''        
    });
    
    useEffect( () => {
        pointsHistory.forEach((item) => {
            if (item.id === entryId) {
                setEditValues({
                    date: item.date,
                    goals: item.goals,
                    assists: item.assists,
                    league: item.league,
                    plusMinus: item.plusMinus,
                    entryId: item.id
                })
            }
        }) 
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
    const handleEdit = (event) => {
        if (event.key === "Enter") { 
            event.preventDefault();
        }
        else {
            setEditValues( {
                ...editValues,
                [event.target.name]: event.target.value,
                entryId: entryId
            });        
        }     
    };

    const handleKey = {
        standard: (event) => {
          if (event.key === "e" || event.key === "-" || event.key === "." || event.key === 'CapsLock') {
              event.preventDefault();
          }
          else if (event.target.value.length >= 2) {
            event.target.value = event.target.value.slice(0,-1);
          }
        },
        alternate: (event) => { // for +/-
          if (event.key === "e" || event.key === "."){
            event.preventDefault();
          }
          else if (event.target.value.length >= 3) { // for negative values
            event.target.value = event.target.value.slice(0,-1);
          }
        }
      };

    const handleEditSubmit = (event) => {
        (async () => {
            const statRef = doc(db, "points-history", editValues.entryId);
            // it would be nice to add missing fields if missing
            await setDoc(statRef, {
                date: editValues.date,
                goals: editValues.goals,
                assists: editValues.assists,
                plusMinus: editValues.plusMinus,
                league: editValues.league,
            }, {merge: true})
        })();
        closeMenu();
    };
    
    const handleConfirmDelete = () => {  
        setShowConfirmation(true);
    };

    return( 
        <>
        
        <DeleteConfirmation 
            onClose = {()=> setShowConfirmation(false)}
            openConfirm = {showConfirmation}
            entryId = {entryId}
            dbName = {"points-history"}
        /> 
    
        <Popup
            ref = {ref}
            trigger={open => (
                <EditIcon sx ={{"&:hover":{color:"#1989fa"}}}></EditIcon>
            )}
            position="left center"
            nested
            >
            <span> 
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
                    onKeyDown = {handleKey.standard}
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
                    onKeyDown = {handleKey.standard}
                    onChange = {handleEdit}
                />
                <TextField
                    sx = {{width:'50%', pb: 1}} 
                    inputProps={{
                        step: 1,
                        placeholder: 0,
                        min: -15,
                        max: 15,
                        type: 'number'
                    }}
                    label="+/-" 
                    variant="outlined" 
                    type = "number" 
                    name = "plusMinus"
                    value = {editValues.plusMinus}
                    onKeyDown = {handleKey.alternate}
                    onChange = {handleEdit}
                />
                <TextField
                    sx = {{width: '100%', pb: 1}} 
                    inputProps={{ maxLength: 8 }}
                    label="League" 
                    variant="outlined" 
                    type = "string" 
                    name = "league"
                    value = {editValues.league}
                    onChange = {handleEdit}
                />

                <TextField 
                    sx = {{width: '100%', pb: 1, mt: 1 }}
                    label ="Date"
                    variant = "outlined"
                    name = "date"
                    type = "date"
                    value = {editValues.date}
                    onKeyDown = {handleKey.standard}
                    onChange = {handleEdit}  
                />
                <Tooltip title = "Submit Change">
                    <Button onClick = {handleEditSubmit} type = "submit" variant = "outlined" sx = {{width: '50%'}}><CheckIcon/></Button>
                </Tooltip>
                <Tooltip title = "Delete Permanently">
                    <Button variant = "outlined" type = "button" onClick = {handleConfirmDelete} sx = {{color:'red', width: '50%'}} >
                        <DeleteForeverIcon/>
                    </Button>     
                </Tooltip>
            </span>
         
        </Popup>

        </>
    )
};