import React, {useEffect, useState} from 'react';
import EditorPopUp from "./EditorPopUp";

import { db } from "../firebase";
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// material ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function RealTimeList(props) {
    
    const [pointsHistory, setPointsHistory] = useState([]);
    
    const calcTotals = (type, arr) => {

      if (type === 'goals') {
        let goals = 0;
        arr.forEach((entry) => {
          goals += Number(entry.goals);
        })
        return goals;
      }
      else if (type === 'assists') {
        let assists = 0;
        arr.forEach((entry) => {
          assists += Number(entry.assists);
        })
        return assists;
      }
    
    };

    useEffect(() => {
        try {
            const q = query(collection(db, "points-history"), where("player_id", "==", props.activeUser.player_id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const ptsArr = [];
            querySnapshot.forEach((doc) => {
                ptsArr.push(doc.data());
            });
                setPointsHistory(ptsArr);
            });

            return () => {
                unsubscribe();
            }
        }
        catch(err) {
            console.log(err)
        }
    }, [props.activeUser]);  

    return (
        <section className ="table">
        <h3>Current Season Stats</h3>
        <TableContainer sx = {{maxWidth: 600}} component={Paper}>
        <Table sx={{ minWidth: 450}} aria-label="stats table">
          <TableHead sx = {{bgcolor: 'primary.light', color: 'text.primary'}}>
            <TableRow >
              <TableCell>Date (YYYY-MM-DD)</TableCell>
              <TableCell align="left">Goals</TableCell>
              <TableCell align="left">Assists</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx = {{bgcolor: 'contrastText'}}>
              <TableCell sx = {{fontWeight: 'bold'}} component="th" scope="row">Total</TableCell>
              <TableCell sx = {{fontWeight: 'bold'}} align="left">{calcTotals('goals', pointsHistory)}</TableCell>
              <TableCell sx = {{fontWeight: 'bold'}} align="left">{calcTotals('assists', pointsHistory)}</TableCell>
            </TableRow>
            {pointsHistory ? pointsHistory.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{row.date}</TableCell>
                <TableCell align="left">{row.goals}</TableCell>
                <TableCell align="left">{row.assists}</TableCell>
                <TableCell><EditorPopUp entryId = {row.id} pointsHistory = {pointsHistory} /></TableCell>
              </TableRow>
            )) 
            :
            null
        }
          </TableBody>
        </Table>
      </TableContainer>
      </section>
    )
}