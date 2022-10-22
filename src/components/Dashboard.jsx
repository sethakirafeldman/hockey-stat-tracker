import React from 'react';
import StatEntry from "./StatEntry";
import PointHistory from "./PointHistory";

import { collection, addDoc } from "firebase/firestore"; 
import db from "../firebase";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import {UserAuth} from '../contexts/AuthContext';

export default function Dashboard() {
    const {user} = UserAuth();
    // console.log(db)
    return (
        <>
            <div>Welcome, {user.displayName}</div>
            <StatEntry />
            <PointHistory />
        </>
    )
}