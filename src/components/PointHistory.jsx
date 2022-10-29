//react
import React from 'react';
import { useEffect, useState, useRef, useContext } from 'react';

import EditorPopUp from "./EditorPopUp";

//firebase
import { db } from "../firebase";
import { collection, query, where, getDocs, docs, getDoc, onSnapshot, doc } from "firebase/firestore";

// material ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function PointHistory(props) {
    //db rule temporarily set to 'true' to allow localhost dev.
    const [rows, setRows] = useState([]);
    const [refresh, setRefresh] = useState('');

    useEffect(() => {
        // prevents duplicate render on refresh.
        if(!initialRender.current) {
            getPlayerHistory(props.activeUser);
        }
        else {
            initialRender.current = false; 
        } 
    }, [props.activeUser]);
      
    function createTableData() {
        let ptsSet = new Set(ptsArr) // in case of duplicates
        ptsSet.forEach((entry)=> {
            let tempArr = [];
            let tempObj = {date: entry.date, goals: entry.goals, assists: entry.assists, id: entry.id};
            setRows(prevState => 
                [...prevState, tempObj]
            );
        });
        
    };

    let ptsArr = [];
    async function getPlayerHistory() {
        const q = query(collection(db, "points-history"), where("player_id", "==", props.activeUser.player_id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            ptsArr.push(doc.data());
        });
        createTableData();
    }

    // look at https://firebase.google.com/docs/firestore/query-data/listen#listen_to_multiple_documents_in_a_collection 

    const initialRender = useRef(true);


    return (
        <>
        <h3>Current Season Stats</h3>
        <TableContainer sx = {{maxWidth: 600}} component={Paper}>
        <Table sx={{ minWidth: 450}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date (YYYY-MM-DD)</TableCell>
              <TableCell align="left">Goals</TableCell>
              <TableCell align="left">Assists</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows ? rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{row.date}</TableCell>
                <TableCell align="left">{row.goals}</TableCell>
                <TableCell align="left">{row.assists}</TableCell>
                <td><EditorPopUp rowId = {row.id} createTableData = {createTableData} /></td>
              </TableRow>
            )) 
            :
            null
        }
          </TableBody>
        </Table>
      </TableContainer>
      </> 
    )
}