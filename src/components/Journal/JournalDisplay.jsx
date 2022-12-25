import React, {useEffect, useState} from 'react';
import AlertSnack from ".././AlertSnack";
import JournalEditor from "./JournalEditor";

import {convertToEmoticons} from "../../utils";

// mui
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

//firebase
import { db } from "../../firebase";
import { collection, onSnapshot, query, where } from 'firebase/firestore';

export default function JournalDisplay ({activeUser}) {

    const [journalHistory, setJournalHistory] = useState([]);
    const [editSuccess, setEditSuccess] = useState(false);
    const [warnDelete, setWarnDelete] = useState(false);

    useEffect(() => {
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

    <Box sx = {{overflow:'auto', width:'100%'}}>
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

    { journalHistory.length > 0 ?
     <TableContainer sx = {{ display: "flex", justifyContent: 'center', width:'auto'}}
     component ={Paper}
     >
        <Table
            sx = {{ minWidth: 350, maxWidth: 650, ml:1, mr:1}}
            aria-label="journal table"
        >
        <TableHead sx = {{ bgcolor: 'primary.light', color: 'text.primary'}}>
        <TableRow sx = {{bgcolor: 'contrastText'}}>
         <TableCell sx = {{color:'white', padding: 1}} align="left">Date</TableCell>
         <TableCell sx = {{color:'white', padding: 1}} align="left">Before</TableCell>
         <TableCell sx = {{color:'white', padding: 1}} align="left">After</TableCell>
         <TableCell sx = {{color:'white', padding: 1}} align="left">League</TableCell>
         <TableCell sx = {{color:'white', padding: 1}} align="left">Journal Entry</TableCell>
         <TableCell sx = {{color:'white', padding: 1}} align="left">View / Edit</TableCell>
        </TableRow>

        {journalHistory.map((row) => (
            <TableRow
                name = {row.entryId}
                key = {row.entryId}
                sx={{ '&:last-child td, &:last-child th': {border: 0}}}
            >
            <TableCell 
                name = {row.dateField} 
                sx = {{bgcolor: "white", padding: 1}} 
                component="th" 
                scope="row">
                {row.dateField}
            </TableCell>
            <TableCell 
                sx = {{textAlign: "center", bgcolor: "white", padding: 1}} 
                align="center">
                {convertToEmoticons(row.preGame)}
            </TableCell>
            <TableCell 
                sx = {{textAlign: "center", bgcolor: "white", padding: 1}} 
                align="center">
                {convertToEmoticons(row.postGame)}
            </TableCell>
            <TableCell
                sx = {{textAlign: "center", maxWidth: "2em", bgcolor: "white", padding: 1}} 
                align="center">
            {row.leagueField}
            </TableCell>
            <TableCell  
                sx = {{textAlign: "left", maxWidth: "23vw", bgcolor: "white", padding: 1, whiteSpace: "nowrap", textOverflow:"ellipsis", overflow: 'hidden' }}  
                align="center">
                {row.textField}
            </TableCell>

            <TableCell 
                sx = {{textAlign: "center", bgcolor: "white", padding: 1, cursor: "pointer" }} 
            >
                <JournalEditor 
                    activeUser = {activeUser}
                    journalHistory = {journalHistory}
                    entryId = {row.entryId}
                />
            </TableCell>
            </TableRow>
        ))

        }
        </TableHead>
        </Table>
     </TableContainer>
    : 
    null
    }
     </Box>
    )
}