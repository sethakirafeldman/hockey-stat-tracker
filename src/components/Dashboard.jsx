import React from 'react';
import StatEntry from "./StatEntry";
import RealTimeList from "./RealTimeList";

import {UserAuth} from '../contexts/AuthContext';

export default function Dashboard(props) {
    // at dashboard level, get player_id from users table
    // pass in as props to StatEntry and PointHistory
    const {user} = UserAuth();
    
    return (
        <>
            <div>Welcome, {props.activeUser.name}</div>
            <StatEntry activeUser = {props.activeUser} />
            <RealTimeList activeUser = {props.activeUser} />
        </>
    )
}