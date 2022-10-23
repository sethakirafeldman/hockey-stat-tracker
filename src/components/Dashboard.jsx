import React from 'react';
import StatEntry from "./StatEntry";
import PointHistory from "./PointHistory";

import { collection, addDoc } from "firebase/firestore"; 

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import {UserAuth} from '../contexts/AuthContext';

export default function Dashboard(props) {
    // at dashboard level, get player_id from users table
    // pass in as props to StatEntry and PointHistory

    const {user} = UserAuth();

    return (
        <>
            <div>Welcome, {props.activeUser.name}</div>
            <StatEntry activeUser = {props.activeUser} />
            <PointHistory activeUser = {props.activeUser} />
        </>
    )
}