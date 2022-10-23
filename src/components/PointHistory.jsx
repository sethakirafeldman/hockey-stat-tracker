//react
import React from 'react';
import { useEffect, useState } from 'react';

//firebase
import { db } from "../firebase";
import { collection, query, where, getDocs, docs, getDoc } from "firebase/firestore";

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
 
    function createData(date, goals , assists) {
        return { date, goals, assists };
    }

    function createTableData() {
        ptsArr.forEach((entry)=> {
            let tempArr = [];
            let tempObj = {date: entry.date, goals: entry.goals, assists: entry.assists, id: entry.id};
            setRows(prevState => 
                [...prevState, tempObj]
            );
        });
        
    };

    let ptsArr = [];
    async function getPlayerHistory() {
        const q = query(collection(db, "points-history"), where("player_id", "==", 'f1e39716-ddf8-44b1-83a4-b6d396c85c98'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            // doc.data returned values to go into table. store in array
            ptsArr.push(doc.data());
        });
        createTableData();
    }

    useEffect(() => {
        getPlayerHistory();
    }, [])

    return (
        <><h3>Current Season Stats</h3>
        <TableContainer sx = {{maxWidth: 600}} component={Paper}>
        <Table sx={{ minWidth: 450}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Date (YYYY-MM-DD)</TableCell>
              <TableCell align="left">Goals</TableCell>
              <TableCell align="left">Assists&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows ? rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.date}
                </TableCell>
                <TableCell align="left">{row.goals}</TableCell>
                <TableCell align="left">{row.assists}</TableCell>
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