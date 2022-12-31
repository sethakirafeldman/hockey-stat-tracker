import React, {useEffect, useState}  from 'react';
import SharpenEditor from "./SharpenEditor";
import dayjs from 'dayjs'
import AlertSnack from '../AlertSnack';

import {summaryTheme, tableTheme} from '../../theme';

import uuid from 'react-uuid';

//mui
import TextField from '@mui/material/TextField';
import  { DesktopDatePicker }  from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {Button, Paper} from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

import {
    Table, 
    TableBody, 
    TableCell, TableRow, 
    TableContainer, 
    TableHead, 
    TablePagination, 
    TableFooter 
} from '@mui/material';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {getCurrentDate} from '../../utils';

//mui modal
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

// firebase
import { doc, setDoc } from "firebase/firestore"; 
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from "../../firebase";

export default function SharpenDisplay ({activeUser}) {
    
    const [sharpenVal, setSharpenVal] = useState('1/2');
    const [notesVal, setNotesVal] = useState('');
    const [dateValue, setDateValue] = useState(getCurrentDate());

    const [cutHistory, setCutHistory] = useState([]);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //snackbar
    const [editSuccess, setEditSuccess] = useState(false);
    const [warnDelete, setWarnDelete] = useState(false);
    const [entryAdded, setEntryAdded] = useState(false);

    // pagination
    const [count, setCount] = useState(5);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [trimRows, setTrimRows] = useState();

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const addEntry = async () => {
        let uniqid = uuid();

        try {
            await setDoc(doc(db, "sharpens", uniqid), {
                player_id: activeUser.player_id,
                cut: sharpenVal,
                notes: notesVal,
                date: dateValue,
                id: uniqid
            });
            setNotesVal('');
            handleClose();
            setEntryAdded(true);
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
        let YYYYMMDD = dayjs(date).format('YYYY-MM-DD');
        setDateValue(YYYYMMDD);
      };

    const handleSubmit = (event) => {
        event.preventDefault();
        addEntry();
    }
    
    useEffect(()=> {
        // check prev entries
        try {
            const q = query(collection(db, "sharpens"), where("player_id", "==", activeUser.player_id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const cutArr = [];

            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "modified") {
                    setEditSuccess(true);
                }

                else if (change.type === "removed") {
                    setWarnDelete(true);
                }
              });

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

    }, [activeUser]);

    // pagination update
    useEffect(() => {
        setCount(cutHistory.length);
        let trimmed;
        if (rowsPerPage > 0 && rowsPerPage < cutHistory.length ) {
            trimmed = cutHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
            setTrimRows(trimmed);
        }

        else {
            setTrimRows(cutHistory);
        }
      }, [rowsPerPage, page, cutHistory]);

    return (
    <Box 
        className = {`fade-in`}
        sx ={{pb: 20, ml:1, mr:1}}>

        <AlertSnack  
            openSnack = {warnDelete} 
            onClose = {()=> setWarnDelete(false)} 
            type = {"success"} 
            text = {"Entry deleted."} 
          />

          <AlertSnack  
            openSnack = {editSuccess} 
            onClose = {()=> setEditSuccess(false)} 
            type = {"success"} 
            text = {"Entry successfully edited."} 
          />

        <AlertSnack  
            openSnack = {entryAdded} 
            onClose = {()=> setEntryAdded(false)} 
            type = {"success"} 
            text = {"Entry successfully added."} 
          />

        <Paper
            elevation = {3} 
            square 
            sx = {summaryTheme.textContent}
        >
        <Typography variant="h4" gutterBottom sx = {{mt: 2, textAlign:'center'}}>Sharpenings</Typography>
        <Typography sx = {{lineHeight:'1.5'}} variant = "body">Here, you may enter your skate sharpenings to keep track of when you last went to the pro shop.
        Not sure about what hollow to use? Check out this guide below. The standard cut is usually 1/2", but may depend on the shop.</Typography>
        </Paper> 
        
        <Box component ="img"
            sx = {{width: '100%', margin:'auto', mt: 2, mb: 2, maxWidth: "600px", borderStyle:'solid', borderRadius: 4, borderColor: 'primary.light'}}
            src ="https://cdn.shopify.com/s/files/1/0505/8838/5453/files/blog-skate-sharpening-skate-bite-guide-en.png?v=1626575546"
            alt="sharpening diagram"
        />
        <Typography sx= {{fontSize: ".5em"}}>Source: <a href="https://www.sourceforsports.ca/pages/skate-sharpening">https://www.sourceforsports.ca/pages/skate-sharpening</a> </Typography>

        <Dialog open = {open} onClose={handleClose}> 
        <DialogTitle>Enter Sharpenings</DialogTitle>
        <DialogContent>
        <DialogContentText>Please enter your info here.</DialogContentText>
        
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
        <FormControl sx={{ m: 1, minWidth: 80 }}>
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
        </FormControl>
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
        </DialogContent>
        <DialogActions>
        </DialogActions>
        </Dialog>    
          
        <Button sx ={{mt:2}} variant="outlined" onClick={handleClickOpen}>
        Enter Sharpenings
        </Button>
          {cutHistory.length > 0 ?
            <TableContainer sx = {{ mt: 2, display: 'flex', justifyContent: 'center', width:'auto'}}>
            <Table sx = {{ minWidth: 300, maxWidth: 650}} aria-label="sharpen table">
            <TableHead sx = {{bgcolor: 'primary.light', color: 'text.secondary'}}>
            <TableRow>
                <TableCell sx = {tableTheme.headingStyle}>Date (YYYY-MM-DD)</TableCell>
                <TableCell sx = {tableTheme.headingStyle} align="left">Cut</TableCell>
                <TableCell sx = {tableTheme.headingStyle} align = "left">Notes</TableCell>
                <TableCell></TableCell>
            </TableRow>    
            </TableHead>
            <TableBody>
            {trimRows.map((row)=> (
                <TableRow
                    key={row.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                > 
                <TableCell sx = {tableTheme.cellStyle} component="th" scope="row">{row.date}</TableCell>
                <TableCell sx = {tableTheme.cellStyle} align="left">{`${row.cut}"`}</TableCell>
                <TableCell sx = {tableTheme.cellStyle} align="left">{row.notes}</TableCell>
                <TableCell>
                    <SharpenEditor 
                        entryId = {row.id}
                        cutHistory = {cutHistory}
                    />
                </TableCell>
                </TableRow>   
            ))
            }           
            </TableBody>
             {/* pagination area */}
            <TableFooter>
            <TableRow>
            <TablePagination
                rowsPerPageOptions={[5, 10, 15, { label: 'All', value: -1 }]}
                colSpan={10}
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                SelectProps={{
                inputProps: {
                    'aria-label': 'rows per page',
                },
                native: true,
                }}
            >
            </TablePagination>
            </TableRow>
            </TableFooter>
            </Table>
          </TableContainer>
          :
          null
          }
          
    </Box>
    )
};