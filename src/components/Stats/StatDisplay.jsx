import React, {useEffect, useState} from 'react';
import StatEditor from "./StatEditor";
import AlertSnack from '../General/AlertSnack';

import {tableTheme} from '../../theme';

import { db } from "../../firebase";
import { collection, onSnapshot, query, where } from 'firebase/firestore';

// mui
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  Table, 
  TableBody, 
  TableCell, TableRow, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableFooter 
} from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


export default function StatDisplay({activeUser, realTimeCallBack}) {
  const [pointsHistory, setPointsHistory] = useState([]);
  const [warnDelete, setWarnDelete] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

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
    },
    plusMinus: (arr) => {
        let result = 0;
        let negNum = 0;
        let posNum = 0;
        if (arr.length > 1) {
            arr.forEach((entry) =>{
              entry < 0 ? negNum += Number(entry.plusMinus)
              :
              posNum += Number(entry.plusMinus)
            });
            result = (posNum + negNum ) / 2
            return Math.floor(result);
        }
        else { // when arr is only one value
            return arr[0]
        } 
    }
  };

    useEffect(() => {
        try {
            const q = query(collection(db, "points-history"), where("player_id", "==", activeUser.player_id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const ptsArr = [];
              querySnapshot.docChanges().forEach((change) => {
                // const entryStr = change.doc._document.data.value.mapValue.fields.id.stringValue;
                if (change.type === "modified") {
                  // console.log(entryStr);
                    setEditSuccess(true);
                   
                    // add class to row
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

    // pagination update
    useEffect(() => {
      setCount(pointsHistory.length);
      let trimmed;
      if (rowsPerPage > 0 && rowsPerPage < pointsHistory.length ) {
        trimmed = pointsHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
        setTrimRows(trimmed);
      }

      else {
        setTrimRows(pointsHistory);
      }
    }, [rowsPerPage, page, pointsHistory])

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

         {pointsHistory.length > 0 ? 
        <>
        <Box sx = {{display:'flex', justifyContent:'center', alignItems:'center', mt:1, mb:1}}>
        <Accordion component = {Paper} sx ={{width:'fitContent' }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="career-stats-expand"
          id="career-stats-accordion"
        >
         <Typography variant = "h7">Career Stats</Typography>
         </AccordionSummary>
            <AccordionDetails >
            <Paper sx = {{display:'flex', flexDirection:'column', padding:1}}>
              <Typography>Total Goals | <strong>{calcTotals.goals(pointsHistory)}</strong></Typography>
              <Typography>Total Assists | <strong>{calcTotals.assists(pointsHistory)}</strong></Typography>
              <Typography>Average +/- | <strong>{calcTotals.plusMinus(pointsHistory)}</strong></Typography>
              <Typography>Total Points | <strong>{calcTotals.total(pointsHistory)}</strong></Typography>
              </Paper>
            </AccordionDetails>
        </Accordion>
        </Box>
        <TableContainer 
          sx = {{ display: 'flex', justifyContent: 'center', width:'auto'}}
          component={Paper}>
        <Table
        sx = {{ minWidth: 325, maxWidth: 650, ml:1, mr:1}}
        aria-label="stats table">
          <TableHead sx = {{bgcolor: 'primary.light', color: 'text.primary'}}>
            <TableRow>
              <TableCell sx = {tableTheme.headingStyle}>YYYY-MM-DD</TableCell>
              <TableCell sx = {tableTheme.headingStyle} align="left">Goals</TableCell>
              <TableCell sx = {tableTheme.headingStyle} align="left">Assists</TableCell>
              <TableCell sx = {tableTheme.headingStyle} align="left">+/-</TableCell>
              <TableCell sx = {tableTheme.headingStyle} align="left">League</TableCell>
              <TableCell sx = {tableTheme.headingStyle}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody >            
            {trimRows.map((row) => ( 
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
              >
                <TableCell sx = {tableTheme.cellStyle} component="th" scope="row">{row.date}</TableCell>
                <TableCell sx = {tableTheme.cellStyle} align="left">{row.goals}</TableCell>
                <TableCell sx = {tableTheme.cellStyle} align="left">{row.assists}</TableCell>
                <TableCell sx = {tableTheme.cellStyle} align="left">{row.plusMinus}</TableCell>
                <TableCell sx = {tableTheme.cellStyle} align="left">{row.league}</TableCell>
                <TableCell sx = {tableTheme.cellStyle}><StatEditor entryId = {row.id} pointsHistory = {pointsHistory} /></TableCell>
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
      </>
      :
      null
      }    
      </Box>

    )
}