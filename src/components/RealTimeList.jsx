import React, {useEffect, useState} from 'react';
import EditorPopUp from "./EditorPopUp";

import { db } from "../firebase";
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import {UserAuth} from '../contexts/AuthContext';

// material ui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function RealTimeList(props) {
    
    const {user, logOut} = UserAuth();
    const [pointsHistory, setPointsHistory] = useState([]);

    let ptsArr = [];
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
            {pointsHistory ? pointsHistory.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{row.date}</TableCell>
                <TableCell align="left">{row.goals}</TableCell>
                <TableCell align="left">{row.assists}</TableCell>
                <td><EditorPopUp entryId = {row.id} /></td>
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