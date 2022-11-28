import React, {useEffect, useState}  from 'react';
import SharpEditor from "./SharpEditor";

import uuid from 'react-uuid';

//mui
import TextField from '@mui/material/TextField';
import  { DesktopDatePicker }  from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {Button} from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Typography from '@mui/material/Typography';

// firebase
import { doc, setDoc } from "firebase/firestore"; 
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from "../firebase";

export default function Sharpens (props) {
    
    const [sharpenVal, setSharpenVal] = useState('1/2');
    const [notesVal, setNotesVal] = useState('');
    const [dateValue, setDateValue] = useState(props.currentDate);

    const [cutHistory, setCutHistory] = useState([]);

    const addEntry = async () => {
        let uniqid = uuid();

        try {
            await setDoc(doc(db, "sharpens", uniqid), {
                player_id: props.activeUser.player_id,
                cut: sharpenVal,
                notes: notesVal,
                date: dateValue,
                id: uniqid
            });
            setNotesVal('');
        }
        catch(err) {
            console.log(err);
        }
    };

    const handleEntry = (event) => {
        if (event.target.name === 'cut selector') {
            setSharpenVal(event.target.value);
        }

        else if (event.target.name === 'notes field') {
            setNotesVal(event.target.value);
        }
    }

    const handleDate = (date) => {

        let day = date.$D;
        let month = date.$M + 1; // month index starts at 0 by default
        let year = date.$y;
      
        if (date.$M < 10 && date.$D < 10 ) {
          month = `0${month}`;
          day = `0${day}`;
        }
        else if (date.$D < 10) {
          day = `0${day}`;
        }
        else if (date.$M < 10) {
          month = `0${month}`;
        }
        let YYYYMMDD = `${year}-${month}-${day}`;
        setDateValue(YYYYMMDD);
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        addEntry();
    }
    
    useEffect(()=> {
        // check prev entries
        try {
            const q = query(collection(db, "sharpens"), where("player_id", "==", props.activeUser.player_id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cutArr = [];
            querySnapshot.forEach((doc) => {
                cutArr.push(doc.data());
            });

            cutArr.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            setCutHistory(cutArr);
            });
            return () => {
                unsubscribe();
            }
        }

        catch(err) {
            console.log(err);
        }

    }, [props.activeUser]);

    return (
        <>
        <section id = "sharpen-section">
        <Typography variant="h4" gutterBottom sx = {{mt: 2}}>Sharpenings</Typography>
        <div className ="text-area">
        <p>Here, you may enter your skate sharpenings to keep track of when you last went to the pro shop.</p>
        <p>Not sure about what hollow to use? Check out this guide below</p>
        <p>Standard cut is usually 1/2", but may depend on the shop.</p>
        </div>
        <figure>
        <img id = "sharpen-diagram" alt = "sharpening diagram" src ="https://cdn.shopify.com/s/files/1/0505/8838/5453/files/blog-skate-sharpening-skate-bite-guide-en.png?v=1626575546"></img>
        <figcaption>Source: <a href="https://www.sourceforsports.ca/pages/skate-sharpening">https://www.sourceforsports.ca/pages/skate-sharpening</a></figcaption>
        </figure>

        <h3>Enter Sharpening Info</h3>
        
        <Box
          onSubmit = {handleSubmit}
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
        <div className = "stat-fields">
        <InputLabel id="cut-selector">Cut</InputLabel>
        <Select
            name = "cut selector"
            labelId="cut-selector"
            value = {sharpenVal}
            label = "Cut"
            onChange = {handleEntry}
        >
        <MenuItem value = {'1'}>1"</MenuItem>
        <MenuItem value = {'3/4'}>3/4"</MenuItem>
        <MenuItem value = {'5/8'}>5/8"</MenuItem>
        <MenuItem value = {'1/2'}>1/2"</MenuItem>
        <MenuItem value = {'3/8'}>3/8"</MenuItem>
        </Select>
          
        <TextField 
            inputProps = {{
                maxLength: 280,
            }}
            name = "notes field"
            multiline
            maxRows={3}
            id="notes-field" 
            label="Notes" 
            variant="outlined" 
            onChange = {handleEntry}
            value = {notesVal}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label="Date"
          inputFormat="YYYY/MM/DD"
          value= {dateValue}
          onChange={(date) => {
            handleDate(date);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
        </LocalizationProvider>
        <Button type = "submit" variant = "outlined">Submit</Button>
        </div>
        </Box>   
        </section>
        <h3>Sharpenings</h3>
        <div className="table">
            <TableContainer sx = {{ display: 'flex', justifyContent: 'center', width:'auto'}} component={Paper}>
            <Table sx = {{ minWidth: 300, maxWidth: 650}}  aria-label="sharpen table">
            <TableHead sx = {{bgcolor: 'primary.light', color: 'text.secondary'}}>
            <TableRow>
                <TableCell sx = {{color:'white', whiteSpace: 'nowrap'}}>Date (YYYY-MM-DD)</TableCell>
                <TableCell sx = {{color:'white'}} align="left">Cut</TableCell>
                <TableCell sx = {{color:'white'}} align = "left">Notes</TableCell>
                <TableCell></TableCell>
            </TableRow>    
            </TableHead>
            <TableBody>
            {cutHistory ? cutHistory.map((row)=> (
                <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                > 
                <TableCell component="th" scope="row">{row.date}</TableCell>
                <TableCell align="left">{`${row.cut}"`}</TableCell>
                <TableCell align="left">{row.notes}</TableCell>
                <TableCell>
                    <SharpEditor 
                        entryId = {row.id}
                        cutHistory = {cutHistory}
                        />
                </TableCell>
                </TableRow>   
            ))
            :
            null

            }           
            </TableBody>
            </Table>
          </TableContainer>
        </div>
        </>
    )
};