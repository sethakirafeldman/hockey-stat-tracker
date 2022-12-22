import React, {useEffect, useState} from 'react';
import StatEditor from "./StatEditor";
import AlertSnack from '../AlertSnack';

import { db } from "../../firebase";
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// material ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export default function StatDisplay({activeUser, realTimeCallBack}) {
    
  const [pointsHistory, setPointsHistory] = useState([]);
  const [warnDelete, setWarnDelete] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  const calcTotals = {
    goals: (arr) => {      
      let goals = 0;
      arr.forEach((entry) => {
        goals += Number(entry.goals);
      })
    return Number(goals);
    },
    assists: (arr) => {
      let assists = 0;
      arr.forEach((entry) => {
        assists += Number(entry.assists);
      })
      return Number(assists);
    },
    total: (arr) => {
      let total = 0;
      arr.forEach((entry) => {
        total += Number(entry.assists) + Number(entry.goals);
      });
      return Number(total);
    }
  };

    useEffect(() => {
        try {
            const q = query(collection(db, "points-history"), where("player_id", "==", activeUser.player_id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const ptsArr = [];
              querySnapshot.docChanges().forEach((change) => {
                if (change.type === "modified") {
                    setEditSuccess(true);
                }

                else if (change.type === "removed") {
                    setWarnDelete(true);
                }
              });

              querySnapshot.forEach((doc) => {
                  ptsArr.push(doc.data());
              });
              ptsArr.sort((a, b) => {
                  return new Date(b.date) - new Date(a.date);
              });
              setPointsHistory(ptsArr);
              realTimeCallBack(ptsArr); // this gets sent to graphs
            });

            return () => {
                unsubscribe();
            }

        }
        catch(err) {
            // console.log(err)
        }
    // eslint-disable-next-line
    }, [activeUser]);  

    return (
        <Box sx = {{overflow:'auto'}}>
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

        <h3>Points to Date</h3>
        <TableContainer 
        sx = {{ display: 'flex', justifyContent: 'center', width:'auto'}}
        component={Paper}>

        <Table
        sx = {{ minWidth: 350, maxWidth: 650, ml:1, mr:1}}
        aria-label="stats table">
          <TableHead sx = {{bgcolor: 'primary.light', color: 'text.primary'}}>
            <TableRow>
              <TableCell sx = {{color:'white', padding: 1}}>Date (YYYY-MM-DD)</TableCell>
              <TableCell sx = {{color:'white', padding: 1}} align="left">Goals</TableCell>
              <TableCell sx = {{color:'white', padding: 1}} align="left">Assists</TableCell>
              <TableCell sx = {{color:'white', padding: 1}} align="left">+/-</TableCell>
              <TableCell sx = {{color:'white', padding: 1}} align="left">League</TableCell>
              <TableCell sx = {{color:'white', padding: 1}}>Total Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            <TableRow sx = {{bgcolor: 'contrastText'}}>
              <TableCell sx = {{fontWeight: 'bold', padding: 1 }} component="th" scope="row">Total</TableCell>
              <TableCell sx = {{fontWeight: 'bold', padding: 1}} align="left">{calcTotals.goals(pointsHistory)}</TableCell>
              <TableCell sx = {{fontWeight: 'bold', padding: 1}} align="left">{calcTotals.assists(pointsHistory)}</TableCell>
              <TableCell sx = {{fontWeight: 'bold', padding: 1}} align="left"></TableCell>
              <TableCell sx = {{fontWeight: 'bold', padding: 1}} align="left"></TableCell>
              <TableCell sx = {{fontWeight: 'bold', padding: 1}} align="left">{calcTotals.total(pointsHistory)}</TableCell>
            </TableRow>
            {pointsHistory ? pointsHistory.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
              >
                <TableCell sx = {{padding: 1}} component="th" scope="row">{row.date}</TableCell>
                <TableCell sx = {{padding: 1}} align="left">{row.goals}</TableCell>
                <TableCell sx = {{padding: 1}} align="left">{row.assists}</TableCell>
                <TableCell sx = {{padding: 1}} align="left">{row.plusMinus}</TableCell>
                <TableCell sx = {{padding: 1}} align="left">{row.league}</TableCell>
                <TableCell sx = {{padding: 1}}><StatEditor entryId = {row.id} pointsHistory = {pointsHistory} /></TableCell>
              </TableRow>
            )) 
            :
            null
        }
          </TableBody>
        </Table>
      </TableContainer>
      </Box>
    )
}