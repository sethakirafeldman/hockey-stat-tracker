import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import {Button} from "@mui/material";
import TextField from '@mui/material/TextField';

export default function EditorPopUp(props) {
    const [editValues, setEditValues] = React.useState({
        date: "",
        goals: "",
        assists: ""        
    });

    const handleEdit = (event) => {
        try {
            setEditValues( {
                ...editValues,
                [event.target.name]: event.target.value
            })
            console.log(editValues);
        }
        catch {

        }
    };

    return( 
    <Popup
        trigger={open => (
            <Button className="button">Edit {open ? null : null}</Button>
        )}
        position="left center"
        closeOnDocumentClick
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
             <Button type = "submit" variant = "outlined">Submit Change</Button>
             <Button type = "button">Delete Entry</Button>
        </span>
    </Popup>
    )
};