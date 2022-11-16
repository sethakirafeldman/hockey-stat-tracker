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
        return Number(goals);
      }
      else if (type === 'assists') {
        let assists = 0;
        arr.forEach((entry) => {
          assists += Number(entry.assists);
        })
        return Number(assists);
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
              ptsArr.sort((a, b) => {
                  return new Date(b.date) - new Date(a.date);
              });
              setPointsHistory(ptsArr);
              props.realTimeCallBack(ptsArr);
            });

            return () => {
                unsubscribe();
            }

        }
        catch(err) {
            console.log(err)
        }
    // eslint-disable-next-line
    }, [props.activeUser]);  

    return (
        <section className ="table">
        <h3>Current Season Stats</h3>
        <TableContainer sx = {{maxWidth: 600}} component={Paper}>
        <Table sx={{minWidth: 350}} aria-label="stats table">
          <TableHead sx = {{bgcolor: 'primary.light', color: 'text.primary'}}>
            <TableRow >
              <TableCell sx = {{color:'white', whiteSpace: 'nowrap'}}>Date (YYYY-MM-DD)</TableCell>
              <TableCell sx = {{color:'white'}} align="left">Goals</TableCell>
              <TableCell sx = {{color:'white'}} align="left">Assists</TableCell>
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